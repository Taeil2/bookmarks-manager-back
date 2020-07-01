const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Pages Endpoints', () => {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => db('pages').truncate())

  afterEach('cleanup', () => db('pages').truncate())

  describe(`Unauthorized requests`, () => {
    const testUsers = helpers.makeUsersArray();
    const testPages = helpers.makePagesArray(testUsers);

    beforeEach('insert pages', () => {
      return db
        .into('pages')
        .insert(testPages)
    })

    it(`responds with 401 Unauthorized for GET /pages`, () => {
      return supertest(app)
        .get('/pages')
        .expect(401, { error: 'Unauthorized request' })
    })

    it(`responds with 401 Unauthorized for POST /pages`, () => {
      return supertest(app)
        .post('/pages')
        .send({ title: 'test-title', url: 'http://some.thing.com', rating: 1 })
        .expect(401, { error: 'Unauthorized request' })
    })

    it(`responds with 401 Unauthorized for GET /pages/:id`, () => {
      const secondPage = testPages[1]
      return supertest(app)
        .get(`/pages/${secondPage.id}`)
        .expect(401, { error: 'Unauthorized request' })
    })

    it(`responds with 401 Unauthorized for DELETE /pages/:id`, () => {
      const secondPage = testPages[1]
      return supertest(app)
        .delete(`/pages/${secondPage.id}`)
        .expect(401, { error: 'Unauthorized request' })
    })
  })

  describe('GET /pages', () => {
    context(`Given no pages`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/pages')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, [])
      })
    })

    context('Given there are pages in the database', () => {
      const testUsers = helpers.makeUsersArray();
      const testPages = helpers.makePagesArray(testUsers);

      beforeEach('insert pages', () => {
        return db
          .into('pages')
          .insert(testPages)
      })

      it('gets the pages from the store', () => {
        return supertest(app)
          .get('/pages')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, testPages)
      })
    })

    context(`Given an XSS attack pages`, () => {
      const { maliciousPage, expectedPage } = helpers.makeMaliciousPage()

      beforeEach('insert malicious pages', () => {
        return db
          .into('pages')
          .insert([maliciousPage])
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/pages`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedPage.title)
            expect(res.body[0].description).to.eql(expectedPage.description)
          })
      })
    })
  })

  describe('GET /pages/:id', () => {
    context(`Given no pages`, () => {
      it(`responds 404 when page doesn't exist`, () => {
        return supertest(app)
          .get(`/pages/123`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, {
            error: { message: `Page Not Found` }
          })
      })
    })

    context('Given there are pages in the database', () => {
      const testUsers = helpers.makeUsersArray();
      const testPages = helpers.makePagesArray(testUsers);

      beforeEach('insert pages', () => {
        return db
          .into('pages')
          .insert(testPages)
      })

      it('responds with 200 and the specified page', () => {
        const pageId = 2
        const expectedPage = testPages[pageId - 1]
        return supertest(app)
          .get(`/pages/${pageId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedPage)
      })
    })

    context(`Given an XSS attack page`, () => {
      const { maliciousPage, expectedPage} = helpers.makeMaliciousPage()

      beforeEach('insert malicious page', () => {
        return db
          .into('page')
          .insert([maliciousPage])
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/pages/${maliciousPage.id}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(expectedPage.title)
            expect(res.body.description).to.eql(expectedPage.description)
          })
      })
    })
  })

  describe('DELETE /pages/:id', () => {
    context(`Given no pages`, () => {
      it(`responds 404 when page doesn't exist`, () => {
        return supertest(app)
          .delete(`/pages/123`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, {
            error: { message: `Page Not Found` }
          })
      })
    })

    context('Given there are pages in the database', () => {
      const testUsers = helpers.makeUsersArray();
      const testPages = helpers.makePagesArray(testUsers);

      beforeEach('insert pages', () => {
        return db
          .into('pages')
          .insert(testPages)
      })

      it('removes the page by ID from the store', () => {
        const idToRemove = 2
        const expectedPages = testPages.filter(bm => bm.id !== idToRemove)
        return supertest(app)
          .delete(`/pages/${idToRemove}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then(() =>
            supertest(app)
              .get(`/pages`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedPages)
          )
      })
    })
  })

  describe('POST /pages', () => {
    it(`responds with 400 missing 'title' if not supplied`, () => {
      const newPageMissingTitle = {
        // title: 'test-title',
        url: 'https://test.com',
        rating: 1,
      }
      return supertest(app)
        .post(`/pages`)
        .send(newPageMissingTitle)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(400, `'title' is required`)
    })

    it(`responds with 400 missing 'url' if not supplied`, () => {
      const newPageMissingUrl = {
        title: 'test-title',
        // url: 'https://test.com',
        rating: 1,
      }
      return supertest(app)
        .post(`/pages`)
        .send(newPageMissingUrl)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(400, `'url' is required`)
    })

    it(`responds with 400 missing 'rating' if not supplied`, () => {
      const newPageMissingRating = {
        title: 'test-title',
        url: 'https://test.com',
        // rating: 1,
      }
      return supertest(app)
        .post(`/pages`)
        .send(newPageMissingRating)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(400, `'rating' is required`)
    })

    it(`responds with 400 invalid 'rating' if not between 0 and 5`, () => {
      const newPageInvalidRating = {
        title: 'test-title',
        url: 'https://test.com',
        rating: 'invalid',
      }
      return supertest(app)
        .post(`/pages`)
        .send(newPageInvalidRating)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(400, `'rating' must be a number between 0 and 5`)
    })

    it(`responds with 400 invalid 'url' if not a valid URL`, () => {
      const newPageInvalidUrl = {
        title: 'test-title',
        url: 'htp://invalid-url',
        rating: 1,
      }
      return supertest(app)
        .post(`/pages`)
        .send(newPageInvalidUrl)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(400, `'url' must be a valid URL`)
    })

    it('adds a new page to the store', () => {
      const newPage = {
        title: 'test-title',
        url: 'https://test.com',
        description: 'test description',
        rating: 1,
      }
      return supertest(app)
        .post(`/pages`)
        .send(newPage)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(newPage.title)
          expect(res.body.url).to.eql(newPage.url)
          expect(res.body.description).to.eql(newPage.description)
          expect(res.body.rating).to.eql(newPage.rating)
          expect(res.body).to.have.property('id')
        })
        .then(res =>
          supertest(app)
            .get(`/pages/${res.body.id}`)
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(res.body)
        )
    })

    it('removes XSS attack content from response', () => {
      const { maliciousPage, expectedPage } = helpers.makeMaliciousPage()
      return supertest(app)
        .post(`/pages`)
        .send(maliciousPage)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(expectedPage.title)
          expect(res.body.description).to.eql(expectedPage.description)
        })
    })
  })
})
