const xss = require("xss");

const PagesService = {
  getUserPages(knex, user_id) {
    return knex.select("*").from("pages").where("user_id", user_id);
  },
  getPageById(knex, id) {
    return knex.select("*").from("pages").where("id", id).first();
  },
  insertPage(knex, newPage) {
    return knex
      .insert(newPage)
      .into("pages")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  updatePage(knex, id, newPageFields) {
    return knex("pages").where({ id }).update(newPageFields);
  },
  deletePage(knex, id) {
    return knex("pages").where({ id }).delete();
  },
};

module.exports = PagesService;
