const express = require('express')
const xss = require('xss')
const logger = require('../logger')
const PagesService = require('./pages-service')
const { requireAuth } = require('../middleware/jwt-auth')

const pagesRouter = express.Router()
const bodyParser = express.json()

const serializePage = (page) => ({
  id: page.id,
  user_id: page.user_id,
  name: xss(page.name),
  page_order: page.page_order,
  is_drawer: page.is_drawer,
})

pagesRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    PagesService.getUserPages(req.app.get('db'), req.user.id)
      .then(pages => {
        res.json(pages.map(serializePage))
      })
      .catch(next)
  })

pagesRouter
  .post('/', requireAuth, bodyParser, (req, res, next) => {
    const user_id = req.user.id

    for (const field of ['name', 'page_order']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`)
        return res.status(400).send(`'${field}' is required`)
      }
    }

    const { name, page_order, is_drawer } = req.body

    const newPage = {user_id, name, page_order, is_drawer }

    PagesService.insertPage(req.app.get('db'), newPage)
      .then(page => {
        logger.info(`Page with id ${page.id} created.`)
        res
          .status(201)
          .location(`/page/${page.id}`)
          .json(serializePage(page))
      })
      .catch(next)
  })

pagesRouter
  .route('/:page_id')
  .all(requireAuth, (req, res, next) => {
    const { page_id } = req.params
    PagesService.getPageById(req.app.get('db'), page_id)
      .then(page => {
        if (!page) {
          logger.error(`Page with id ${page_id} not found.`)
          return res.status(404).json({
            error: { message: `Page not found` }
          })
        }
        res.page = page
        next()
      })
      .catch(next)
  })
  .get((req, res) => {
    res.json(serializePage(res.page))
  })
  .patch(bodyParser, (req, res, next) => {
    const { name, page_order } = req.body
    const newPageFields = { name, page_order }

    PagesService.updatePage(req.app.get('db'), page_id, newPageFields)
      .then(numRowsAffected => {
        logger.info(`Page with id ${page_id} updated.`)
        res.status(204).end()
      })
      .catch(next)
  })
  .delete((req, res, next) => {
    PagesService.deletePage(req.app.get('db'), page_id)
      .then(numRowsAffected => {
        logger.info(`Page with id ${page_id} deleted.`)
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = pagesRouter
