const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      email: 'test1@gmail.com',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      note: null,
      enable_pages: false,
      enable_folders: true,
      icon_size: 'medium',
      icon_shape: 'rounded',
      icons_per_row: 5,
      icon_alignment: 'center',
      enable_groups: false,
      enable_hiding: false,
    },
    {
      id: 2,
      email: 'test2@gmail.com',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      note: null,
      enable_pages: false,
      enable_folders: true,
      icon_size: 'medium',
      icon_shape: 'rounded',
      icons_per_row: 5,
      icon_alignment: 'center',
      enable_groups: false,
      enable_hiding: false,
    },
    {
      id: 3,
      email: 'test3@gmail.com',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      note: null,
      enable_pages: false,
      enable_folders: true,
      icon_size: 'medium',
      icon_shape: 'rounded',
      icons_per_row: 5,
      icon_alignment: 'center',
      enable_groups: false,
      enable_hiding: false,
    },
    {
      id: 4,
      email: 'test4@gmail.com',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      note: null,
      enable_pages: false,
      enable_folders: true,
      icon_size: 'medium',
      icon_shape: 'rounded',
      icons_per_row: 5,
      icon_alignment: 'center',
      enable_groups: false,
      enable_hiding: false,
    },
  ]
}

function makePagesArray(users) {
  return [
    {
      id: 1,
      user_id: users[0].id,
      name: 'Page 1',
      page_order: 1,
      is_drawer: false
    },
    {
      id: 2,
      user_id: users[0].id,
      name: 'Drawer',
      page_order: null,
      is_drawer: true
    },
    {
      id: 3,
      user_id: users[1].id,
      name: 'Page 1',
      page_order: 1,
      is_drawer: false
    },
    {
      id: 4,
      user_id: users[1].id,
      name: 'Drawer',
      page_order: null,
      is_drawer: true
    },
    {
      id: 5,
      user_id: users[2].id,
      name: 'Page 1',
      page_order: 1,
      is_drawer: false
    },
    {
      id: 6,
      user_id: users[2].id,
      name: 'Drawer',
      page_order: null,
      is_drawer: true
    },
    {
      id: 7,
      user_id: users[3].id,
      name: 'Page 1',
      page_order: 1,
      is_drawer: false
    },
    {
      id: 8,
      user_id: users[3].id,
      name: 'Drawer',
      page_order: null,
      is_drawer: true
    },
  ]
}

function makeBookmarksArray(pages) {
  return [
    {
      id: 1,
      page_id: pages[0].id,
      name: 'Google',
      url: 'https://www.google.com/',
      base_url: 'https://www.google.com',
      bookmark_order: 1,
      folder_name: null,
      group_name: null,
      hidden: false
    },
    {
      id: 2,
      page_id: pages[0].id,
      name: 'Yahoo',
      url: 'https://www.yahoo.com/',
      base_url: 'https://www.yahoo.com',
      bookmark_order: 2,
      folder_name: null,
      group_name: null,
      hidden: false
    },
    {
      id: 3,
      page_id: pages[0].id,
      name: 'Bing',
      url: 'https://www.bing.com/',
      base_url: 'https://www.bing.com',
      bookmark_order: 3,
      folder_name: null,
      group_name: null,
      hidden: false
    },
    {
      id: 4,
      page_id: pages[0].id,
      name: 'Baidu',
      url: 'https://www.baidu.com/',
      base_url: 'https://www.baidu.com',
      bookmark_order: 4,
      folder_name: null,
      group_name: null,
      hidden: false
    },
  ];
}

function makeBookmarkImagesArray() {
  return [
    {
      id: 1,
      base_url: 'https://www.google.com',
      bytes: 3035,
      width: 180,
      height: 180,
      image_url: "https://www.google.com/images/branding/product_ios/3x/gsa_ios_60dp.png",
      image_format: 'png',
    },
    {
      id: 2,
      base_url: 'https://www.google.com',
      bytes: 2102,
      width: 120,
      height: 120,
      image_url: "https://www.google.com/images/branding/product_ios/2x/gsa_ios_60dp.png",
      image_format: 'png',
    },
    {
      id: 3,
      base_url: 'https://www.google.com',
      bytes: 2051,
      width: 114,
      height: 114,
      image_url: "https://www.google.com/images/branding/product_ios/2x/gsa_ios_57dp.png",
      image_format: 'png',
    },
    {
      id: 4,
      base_url: 'https://www.google.com',
      bytes: 1044,
      width: 57,
      height: 57,
      image_url: "https://www.google.com/images/branding/product_ios/1x/gsa_ios_57dp.png",
      image_format: 'png',
    },
    {
      id: 5,
      base_url: 'https://www.google.com',
      bytes: 5430,
      width: 32,
      height: 32,
      image_url: "https://www.google.com/favicon.ico",
      image_format: 'ico',
    },
  ];
}

function makeExpectedPage(user, page) {
  return {
    id: page.id,
    user_id: user.id,
    name: page.name,
    page_order: page.page_order,
    is_drawer: page.is_drawer
  }
}

function makeExpectedBookmark() {

}

function makeExpectedBookmarkImage() {

}

function makeMaliciousPage(users) {
  const maliciousPage = {
    id: 1,
    user_id: users[0].id,
    name: 'Bad Name <script>alert("xss");</script>',
    page_order: 1,
    is_drawer: false
  }
  const expectedPage = {
    id: 1,
    user_id: users[0].id,
    name: 'Bad Name <script>alert("xss");</script>',
    name: 'Bad Name &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    page_order: 1,
    is_drawer: false
  }
  return {
    maliciousPage,
    expectedPage,
  }
}

// do this
function seedMaliciousPage() {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('pages')
        .insert([page])
    )
}


function makeMaliciousBookmark() {

}

function seedMaliciousBookmark() {

}

function makeMaliciousBookmarkImage() {

}

function seedMaliciousBookmarkImage() {

}



// function makeExpectedArticleComments(users, articleId, comments) {
//   const expectedComments = comments
//     .filter(comment => comment.article_id === articleId)

//   return expectedComments.map(comment => {
//     const commentUser = users.find(user => user.id === comment.user_id)
//     return {
//       id: comment.id,
//       text: comment.text,
//       date_created: comment.date_created.toISOString(),
//       user: {
//         id: commentUser.id,
//         user_name: commentUser.user_name,
//         full_name: commentUser.full_name,
//         nickname: commentUser.nickname,
//         date_created: commentUser.date_created.toISOString(),
//         date_modified: commentUser.date_modified || null,
//       }
//     }
//   })
// }

function makeBookmarksFixtures() {
  const testUsers = makeUsersArray()
  const testPages = makePagesArray(testUsers)
  const testBookmarks = makeBookmarksArray(testPages)
  const testBookmarkImages = makeBookmarkImagesArray()
  return { testUsers, testPages, testBookmarks, testBookmarkImages }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        users,
        pages,
        bookmarks,
        bookmark_images
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE pages_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE bookmarks_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE bookmark_images_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('users_id_seq', 0)`),
        trx.raw(`SELECT setval('pages_id_seq', 0)`),
        trx.raw(`SELECT setval('bookmarks_id_seq', 0)`),
        trx.raw(`SELECT setval('bookmark_images_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

// function seedArticlesTables(db, users, articles, comments=[]) {
//   // use a transaction to group the queries and auto rollback on any failure
//   return db.transaction(async trx => {
//     await seedUsers(trx, users)
//     await trx.into('blogful_articles').insert(articles)
//     // update the auto sequence to match the forced id values
//     await trx.raw(
//       `SELECT setval('blogful_articles_id_seq', ?)`,
//       [articles[articles.length - 1].id],
//     )
//     // only insert comments if there are some, also update the sequence counter
//     if (comments.length) {
//       await trx.into('blogful_comments').insert(comments)
//       await trx.raw(
//         `SELECT setval('blogful_comments_id_seq', ?)`,
//         [comments[comments.length - 1].id],
//       )
//     }
//   })
// }

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.email,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makePagesArray,
  makeBookmarksArray,
  makeBookmarkImagesArray,

  makeExpectedPage,
  makeExpectedBookmark,
  makeExpectedBookmarkImage,

  makeMaliciousPage,
  makeMaliciousBookmark,
  makeMaliciousBookmarkImage,

  seedMaliciousPage,
  seedMaliciousBookmark,
  seedMaliciousBookmarkImage,

  // makeExpectedArticle,
  // makeExpectedArticleComments,
  // makeMaliciousArticle,

  makeBookmarksFixtures,
  cleanTables,
  // seedArticlesTables,
  // seedMaliciousArticle,
  makeAuthHeader,
  seedUsers,
}
