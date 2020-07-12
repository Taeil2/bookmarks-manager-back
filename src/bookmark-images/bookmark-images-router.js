const express = require("express");
const xss = require("xss");
const logger = require("../logger");
const BookmarkImagesService = require("./bookmark-images-service");
const { requireAuth } = require("../middleware/jwt-auth");

const bookmarkImagesRouter = express.Router();
const bodyParser = express.json();

const serializeBookmarkImage = (bookmarkImage) => ({
  id: bookmarkImage.id,
  base_url: xss(bookmarkImage.base_url),
  bytes: bookmarkImage.bytes,
  width: bookmarkImage.width,
  height: bookmarkImage.height,
  image_url: xss(bookmarkImage.image_url),
  image_format: bookmarkImage.image_format,
});

bookmarkImagesRouter.route("/").get(requireAuth, (req, res, next) => {
  const base_url = req.query.base_url;
  BookmarkImagesService.getBookmarkImagesByUrl(req.app.get("db"), base_url)
    .then((bookmarkImages) => {
      return res.json(bookmarkImages.map(serializeBookmarkImage));
    })
    .catch(next);
});

bookmarkImagesRouter.post("/", requireAuth, bodyParser, (req, res, next) => {
  const { url, icons } = req.body;
  icons.forEach((icon) => {
    const { width, height, bytes } = icon;
    const base_url = url;
    const image_url = icon.url;
    const image_format = icon.format;

    const newBookmarkImage = {
      base_url,
      bytes,
      width,
      height,
      image_url,
      image_format,
    };
    BookmarkImagesService.insertBookmarkImage(
      req.app.get("db"),
      newBookmarkImage
    )
      .then((bookmarkImage) => {
        logger.info(`Bookmark Image with id ${bookmarkImage.id} created.`);
        res
          .status(201)
          // .location(`/bookmark-images/${bookmarkImage.id}`)
          .json(serializeBookmarkImage(bookmarkImage));
      })
      .catch(next);
  });
});

module.exports = bookmarkImagesRouter;
