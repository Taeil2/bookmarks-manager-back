const express = require('express')
const path = require('path')
const xss = require('xss')
const logger = require('../logger')
const UsersService = require('./users-service')
const PagesService = require('../pages/pages-service')
const { requireAuth } = require('../middleware/jwt-auth')

const usersRouter = express.Router()
const jsonBodyParser = express.json()
const validator = require('email-validator')

const serializeUser = (user) => ({
  id: user.id,
  email: xss(user.email),
  password: user.password,
  date_created: user.date_created,
  note: xss(user.note),
  enable_pages: user.enable_pages,
  enable_folders: user.enable_folders,
  icon_size: user.icon_size,
  icon_shape: user.icon_shape,
  icons_per_row: user.icons_per_row,
  icon_alignment: user.icon_alignment,
  enable_groups: user.enable_groups,
  enable_hiding: user.enable_hiding,
})

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { email, password } = req.body

    for (const field of ['email', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })

      if (!validator.validate(email)) {
        return res.status(400).json({
          error: `Email is not a valid email`
        })
      }

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
                // create page 1 and drawer page for user
                const page1 = {
                  user_id: user.id,
                  name: 'Page 1',
                  page_order: 1,
                  is_drawer: false
                }
                const drawerPage =  {
                  user_id: user.id,
                  name: 'Drawer',
                  page_order: null,
                  is_drawer: true
                }

                PagesService.insertPage(req.app.get('db'), page1)
                  .then(page => {
                    logger.info(`Page with id ${page.id} created.`)
                    res
                      .status(201)
                      // .location(`/page/${page.id}`)
                      // .json(serializePage(page))
                  })
                  .catch(next)

                PagesService.insertPage(req.app.get('db'), drawerPage)
                  .then(page => {
                    logger.info(`Page with id ${page.id} created.`)
                    res
                      .status(201)
                      // .location(`/page/${page.id}`)
                      // .json(serializePage(page))
                  })
                  .catch(next)

                return res
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
  .route('/user')
  .all(requireAuth, (req, res, next) => {
    const user_id = req.user.id
    UsersService.getUserById(req.app.get('db'), user_id)
      .then(user => {
        if (!user) {
          logger.error(`User with id ${user_id} not found.`)
          return res.status(404).json({
            error: { message: `User Not Found` }
          })
        }
        res.user = user
        next()
      })
      .catch(next)
  })
  .get((req, res) => {
    res.json(serializeUser(res.user))
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { note, enable_pages, enable_folders, icon_size, icon_shape, icons_per_row, icon_alignment, enable_groups, enable_hiding } = req.body
    const user_id = req.user.id

    // if (!icon_size.matches("small|medium|large")) {
    //   logger.error(`Invalid icon size ${icon_size} supplied`)
    //   return res.status(400).send(`'icon_size' must be either small, medium, or large`)
    // }
    // if (!icon_shape.matches("square|rounded|circle")) {
    //   logger.error(`Invalid icon shape ${icon_shape} supplied`)
    //   return res.status(400).send(`'icon_shape' must be either square, rounded, or circle`)
    // }
    // if (!icon_alignment.matches("left|center|right")) {
    //   logger.error(`Invalid icon alignment ${icon_alignment} supplied`)
    //   return res.status(400).send(`'icon_alignment' must be either left, center, or right`)
    // }

    const newUserFields = { note, enable_pages, enable_folders, icon_size, icon_shape, icons_per_row, icon_alignment, enable_groups, enable_hiding }

    UsersService.updateUser(req.app.get('db'), user_id, newUserFields)
      .then(numRowsAffected => {
        logger.info(`User with id ${user_id} updated.`)
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = usersRouter
