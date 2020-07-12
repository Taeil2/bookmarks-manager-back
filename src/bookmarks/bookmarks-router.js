const express = require("express");
const { isWebUri } = require("valid-url");
const xss = require("xss");
const logger = require("../logger");
const BookmarksService = require("./bookmarks-service");
const { requireAuth } = require("../middleware/jwt-auth");

const bookmarksRouter = express.Router();
const bodyParser = express.json();

const serializeBookmark = (bookmark) => ({
  id: bookmark.id,
  page_id: bookmark.page_id,
  name: xss(bookmark.name),
  url: xss(bookmark.url),
  base_url: xss(bookmark.base_url),
  bookmark_order: bookmark.bookmark_order,
  folder_name: xss(bookmark.folder_name),
  group_name: xss(bookmark.group_name),
  is_folder: bookmark.is_folder,
  hidden: bookmark.hidden,
});

bookmarksRouter.route("/:page_id").get((req, res, next) => {
  const { page_id } = req.params;
  BookmarksService.getBookmarksByPage(req.app.get("db"), page_id)
    .then((bookmarks) => {
      res.json(bookmarks.map(serializeBookmark));
    })
    .catch(next);
});

bookmarksRouter.post("/", bodyParser, (req, res, next) => {
  for (const field of ["page_id", "name", "bookmark_order"]) {
    if (!req.body[field]) {
      logger.error(`${field} is required`);
      return res.status(400).send(`'${field}' is required`);
    }
  }

  const {
    page_id,
    name,
    url,
    base_url,
    bookmark_order,
    folder_name,
    group_name,
    is_folder,
    hidden,
  } = req.body;

  // if (!isWebUri(url)) {
  //   logger.error(`Invalid url '${url}' supplied`)
  //   return res.status(400).send(`'url' must be a valid URL`)
  // }
  // any additional checks here? such as name, folder name, group name length? does base_url need to be a valid url?

  const newBookmark = {
    page_id,
    name,
    url,
    base_url,
    bookmark_order,
    folder_name,
    group_name,
    is_folder,
    hidden,
  };

  BookmarksService.insertBookmark(req.app.get("db"), newBookmark)
    .then((bookmark) => {
      logger.info(`Bookmark with id ${bookmark.id} created.`);
      return (
        res
          .status(201)
          // .location(`/bookmarks/${bookmark.id}`)
          .json(serializeBookmark(bookmark))
      );
    })
    .catch(next);
});

bookmarksRouter
  .route("/:bookmark_id")
  .all((req, res, next) => {
    const { bookmark_id } = req.params;
    BookmarksService.getBookmarkById(req.app.get("db"), bookmark_id)
      .then((bookmark) => {
        if (!bookmark) {
          logger.error(`Bookmark with id ${bookmark_id} not found.`);
          return res.status(404).json({
            error: { message: `Bookmark not found` },
          });
        }
        res.bookmark = bookmark;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    return res.json(serializeBookmark(res.bookmark));
  })
  .patch(bodyParser, (req, res, next) => {
    const { bookmark_id } = req.params;

    const {
      page_id,
      name,
      url,
      base_url,
      bookmark_order,
      folder_name,
      group_name,
      hidden,
    } = req.body;
    const newBookmarkFields = {
      page_id,
      name,
      url,
      base_url,
      bookmark_order,
      folder_name,
      group_name,
      hidden,
    };

    BookmarksService.updateBookmark(
      req.app.get("db"),
      bookmark_id,
      newBookmarkFields
    )
      .then((bookmark) => {
        logger.info(`Bookmark with id ${bookmark_id} updated.`);
        return res.status(204).json(serializeBookmark(bookmark));
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { bookmark_id } = req.params;
    // set the order of each bookmark after it to minus 1
    BookmarksService.getBookmarksByPage(req.app.get("db"), res.bookmark.page_id)
      .then((bookmarks) => {
        bookmarks.forEach((bookmark) => {
          if (bookmark.bookmark_order > res.bookmark.bookmark_order) {
            let newOrder = bookmark.bookmark_order - 1;
            BookmarksService.updateBookmark(req.app.get("db"), bookmark.id, {
              bookmark_order: newOrder,
            });
          }
        });
      })
      .catch(next);
    // delete the bookmark
    BookmarksService.deleteBookmark(req.app.get("db"), bookmark_id)
      .then((numRowsAffected) => {
        logger.info(`Bookmark with id ${bookmark_id} deleted.`);
        return res.status(204).end();
      })
      .catch(next);
  });

module.exports = bookmarksRouter;
