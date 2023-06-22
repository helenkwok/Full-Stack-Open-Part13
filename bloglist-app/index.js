const express = require('express')
require('express-async-errors')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const { errorHandler } = require('./util/middleware')

const blogsRouter = require('./controllers/blogs')
const authorsRouter = require('./controllers/authors')
const usersRouter = require('./controllers/users')
const readingListsRouter = require('./controllers/readinglists')
const loginRouter = require('./controllers/login')
const logoutRouter = require('./controllers/logout')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/users', usersRouter)
app.use('/api/readinglists', readingListsRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

// this has to be the last loaded middleware.
app.use(errorHandler)

start()
