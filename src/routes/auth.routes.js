const { Router } = require('express')

const { login } = require('../controllers/auth.controller.js')

const { createUser } = require('../controllers/users.controller.js')

const { validateCreate, result } = require('../validators/users.js')

const router = Router()

router.post('/login', login)
router.post('/register', validateCreate, result, createUser)

module.exports = router
