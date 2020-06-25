require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')

const authRouter = require('./auth/auth-router')
/*
const thingsRouter = require('./things/things-router')
const reviewsRouter = require('./reviews/reviews-router')
*/

const app = express()

const morganOption = ((NODE_ENV === 'production') ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
  })

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Welcome! Server is running.')
})

app.use('/api/auth', authRouter)
/*
app.use('/api/things', thingsRouter)
app.use('/api/reviews', reviewsRouter)
*/

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
    res.status(500).json(response)
  })

module.exports = app
