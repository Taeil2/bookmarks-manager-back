const xss = require("xss");

const BookmarkImagesService = {
  getBookmarkImagesByUrl(knex, url) {
    return knex.select("*").from("bookmark_images").where("base_url", url);
  },
  insertBookmarkImage(knex, newBookmarkImage) {
    return knex
      .insert(newBookmarkImage)
      .into("bookmark_images")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  // getBookmarkImageById(knex, id) {
  //   return knex
  //     .select('*')
  //     .from('bookmark_images')
  //     .where('id', id)
  //     .first()
  // },
  // updateBookmarkImage(knex, id, newBookmarkImageFields) {
  //   return knex('bookmark_images')
  //     .where({ id })
  //     .update(newBookmarkImageFields)
  // },
  // deleteBookmarkImage(knex, id) {
  //   return knex('bookmark_images')
  //     .where({ id })
  //     .delete()
  // }
};

module.exports = BookmarkImagesService;
