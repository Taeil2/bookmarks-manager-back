const express = require('express')
const path = require('path')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
  .post('/users', jsonBodyParser, (req, res, next) => {
    const { email, password } = req.body

    for (const field of ['email', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })

    // TODO: check email doesn't start with spaces

    const passwordError = UsersService.validatePassword(password)

    if (passwordError)
      return res.status(400).json({ error: passwordError })

    UsersService.hasUserWithEmail(
      req.app.get('db'),
      email
    )
      .then(hasUserWithEmail => {
        if (hasUserWithEmail)
          return res.status(400).json({ error: `Email already exists. Login or reset your password.` })

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              email,
              password: hashedPassword,
            }

            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  // .location(req.originalUrl)
                  .json(UsersService.serializeUser(user))
              })
          })
      })
      .catch(next)
  })


usersRouter
  .route('/users/:id')
  .all((req, res, next) => {
    const { id } = req.params
    UsersService.getById(req.app.get('db'), id)
      .then(user => {
        if (!user) {
          logger.error(`User with id ${id} not found.`)
          return res.status(404).json({
            error: { message: `User Not Found` }
          })
        }
        res.user = user
        next()
      })
      .catch(next)
  })
  .update((req, res, next) => {
    const { note, enable_pages, enable_folders, icon_size, icon_shape, icons_per_row, icon_alignment, enable_groups, enable_hiding } = req.body

    if (!icon_size.matches("small|medium|large")) {
      logger.error(`Invalid icon size ${icon_size} supplied`)
      return res.status(400).send(`'icon_size' must be either small, medium, or large`)
    }
    if (!icon_shape.matches("square|rounded|circle")) {
      logger.error(`Invalid icon shape ${icon_shape} supplied`)
      return res.status(400).send(`'icon_shape' must be either square, rounded, or circle`)
    }
    if (!icon_alignment.matches("left|center|right")) {
      logger.error(`Invalid icon alignment ${icon_alignment} supplied`)
      return res.status(400).send(`'icon_alignment' must be either left, center, or right`)
    }

    const newUserFields = { note, enable_pages, enable_folders, icon_size, icon_shape, icons_per_row, icon_alignment, enable_groups, enable_hiding }

    UsersService.updateUser(req.app.get('db'), id, newUserFields)
      .then(numRowsAffected => {
        logger.info(`User with id ${id} updated.`)
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = usersRouter
