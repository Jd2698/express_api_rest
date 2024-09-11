const express = require('express')

const userRoutes = require('./routes/users.routes.js')
const taskRoutes = require('./routes/tasks.routes.js')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', userRoutes)
app.use('/api/tasks', taskRoutes)

app.listen(3000, () => console.log('running on port 3000'))
