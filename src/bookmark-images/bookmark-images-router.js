const express = require('express')
const xss = require('xss')
const logger = require('../logger')
const BookmarkImagesService = require('./bookmark-images-service')

const bookmarkImagesRouter = express.Router()
const bodyParser = express.json()

const serializeBookmarkImage = (bookmarkImage) => ({
  id: bookmarkImage.id,
  base_url: xss(bookmarkImage.base_url),
  bytes: bookmarkImage.bytes,
  width: bookmarkImage.width,
  height: bookmarkImage.height,
  image_url: xss(bookmarkImage.image_url),
  image_format: bookmarkImage.image_format
})

bookmarkImagesRouter
  .route('/bookmark-images/:base_url')
  .get((req, res, next) => {
    BookmarkImagesService.getBookmarkImagesByUrl(req.app.get('db'), base_url)
      .then(bookmarkImages => {
        res.json(bookmarkImages.map(serializeBookmarkImage))
      })
      .catch(next)
  })

bookmarkImagesRouter
  .route('/bookmark-images')
  .post(bodyParser, (req, res, next) => {
    for (const field of ['base_url', 'image_url']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`)
        return res.status(400).send(`'${field}' is required`)
      }
    }

    const { base_url, bytes, width, height, image_url, image_format } = req.body

    if (!isWebUri(image_url)) {
      logger.error(`Invalid url '${image_url}' supplied`)
      return res.status(400).send(`'url' must be a valid URL`)
    }

    const newBookmarkImage = { base_url, bytes, width, height, image_url, image_format }

    BookmarkImagesService.insertBookmarkImage(req.app.get('db'), newBookmarkImage)
      .then(bookmarkImage => {
        logger.info(`Bookmark Image with id ${bookmarkImage.id} created.`)
        res
          .status(201)
          // .location(`/bookmark-images/${bookmarkImage.id}`)
          .json(serializeBookmarkImage(bookmarkImage))
      })
      .catch(next)
  })
