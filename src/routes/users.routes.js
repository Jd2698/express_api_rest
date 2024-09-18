const { Router } = require('express')
const {
	validateCreate,
	validateUpdate,
	result
} = require('../validators/users.js')

const {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser
} = require('../controllers/users.controller.js')

const router = Router()

router.get('/', getUsers)
router.post('/', validateCreate, result, createUser)
router.put('/:id', validateUpdate, result, updateUser)
router.get('/:id', getUser)
router.delete('/:id', deleteUser)

module.exports = router
