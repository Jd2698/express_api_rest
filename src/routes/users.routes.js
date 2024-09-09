const { Router } = require('express')
const userController = require('../controllers/users.controller.js')

const router = Router()

router.get('/users', userController.getUsers)
router.post('/users', userController.createUser)
router.put('/users/:id', userController.updateUser)
router.get('/users/:id', userController.getUser)

module.exports = router
