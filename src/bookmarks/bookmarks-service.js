const xss = require("xss");

const BookmarksService = {
  getBookmarksByPage(knex, page_id) {
    return knex.select("*").from("bookmarks").where("page_id", page_id);
  },
  getBookmarkById(knex, id) {
    return knex.select("*").from("bookmarks").where("id", id).first();
  },
  insertBookmark(knex, newBookmark) {
    return knex
      .insert(newBookmark)
      .into("bookmarks")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  updateBookmark(knex, id, newBookmarkFields) {
    return knex("bookmarks")
      .where({ id })
      .update(newBookmarkFields)
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  deleteBookmark(knex, id) {
    return knex("bookmarks").where({ id }).delete();
  },
};

module.exports = BookmarksService;
