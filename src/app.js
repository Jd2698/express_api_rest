const express = require('express')
require('dotenv').config()

const userRoutes = require('./routes/users.routes.js')
const authRoutes = require('./routes/auth.routes.js')
const taskRoutes = require('./routes/tasks.routes.js')
const { validateToken } = require('./middlewares/validateToken.js')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)

// middleware authToken
app.use(validateToken)

app.use('/api/users', userRoutes)
app.use('/api/tasks', taskRoutes)

module.exports = app
