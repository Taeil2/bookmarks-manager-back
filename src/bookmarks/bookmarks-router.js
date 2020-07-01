const express = require('express')
const { isWebUri } = require('valid-url')
const xss = require('xss')
const logger = require('../logger')
const BookmarksService = require('./bookmarks-service')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

const serializeBookmark = (bookmark) => ({
  id: bookmark.id,
  page_id: bookmark.page_id,
  name: xss(bookmark.name),
  url: xss(bookmark.url),
  base_url: xss(bookmark.base_url),
  bookmark_order: bookmark.bookmark_order,
  folder_name: xss(bookmark.folder_name),
  group_name: xss(bookmark.group_name),
  hidden: bookmark.hidden
})

bookmarksRouter
  .route('/bookmarks/:page_id')
  .get((req, res, next) => {
    const { page_id } = req.params
    BookmarksService.getBookmarksByPage(req.app.get('db'), page_id)
      .then(bookmarks => {
        res.json(bookmarks.map(serializeBookmark))
      })
      .catch(next)
  })

bookmarksRouter
  .route('/bookmarks')
  .post(bodyParser, (req, res, next) => {
    for (const field of ['page_id', 'name', 'url', 'base_url', 'bookmark_order']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`)
        return res.status(400).send(`'${field}' is required`)
      }
    }

    const { page_id, name, url, base_url, bookmark_order, folder_name, group_name, hidden } = req.body

    if (!isWebUri(url)) {
      logger.error(`Invalid url '${url}' supplied`)
      return res.status(400).send(`'url' must be a valid URL`)
    }
    // any additional checks here? such as name, folder name, group name length? does base_url need to be a valid url?

    const newBookmark = { page_id, name, url, base_url, bookmark_order, folder_name, group_name, hidden }

    BookmarksService.insertBookmark(req.app.get('db'), newBookmark)
      .then(bookmark => {
        logger.info(`Bookmark with id ${bookmark.id} created.`)
        res
          .status(201)
          // .location(`/bookmarks/${bookmark.id}`)
          .json(serializeBookmark(bookmark))
      })
      .catch(next)
  })

bookmarksRouter
  .route('/bookmarks/:bookmark_id')
  .all((req, res, next) => {
    const { bookmark_id } = req.params
    BookmarksService.getBookmarkById(req.app.get('db'), bookmark_id)
      .then(bookmark => {
        if (!bookmark) {
          logger.error(`Bookmark with id ${bookmark_id} not found.`)
          return res.status(404).json({
            error: { message: `Bookmark not found` }
          })
        }
        res.bookmark = bookmark
        next()
      })
      .catch(next)
  })
  .get((req, res) => {
    res.json(serializeBookmark(res.bookmark))
  })
  .update((req, res, next) => {
    const { page_id, name, url, base_url, bookmark_order, folder_name, group_name, hidden } = req.body
    const newBookmarkFields = { page_id, name, url, base_url, bookmark_order, folder_name, group_name, hidden }

    BookmarksService.updateBookmark(req.app.get('db'), bookmark_id, newBookmarkFields)
      .then(numRowsAffected => {
        logger.info(`Bookmark with id ${bookmark_id} updated.`)
        res.status(204).end()
      })
      .catch(next)
  })
  .delete((req, res, next) => {
    BookmarksService.deleteBookmark(req.app.get('db'), bookmark_id)
      .then(numRowsAffected => {
        logger.info(`Bookmark with id ${bookmark_id} deleted.`)
        res.status(204).end()
      })
      .catch(next)
  })
