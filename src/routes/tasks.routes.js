const { Router } = require('express')
const {
	validateCreate,
	validateUpdate,
	result
} = require('../validators/tasks.js')
const {
	getTask,
	getTasks,
	createTask,
	updateTask
} = require('../controllers/tasks.controller.js')

const router = Router()

router.get('/', getTasks)
router.post('/', validateCreate, result, createTask)
router.put('/:id', validateUpdate, result, updateTask)
router.get('/:id', getTask)

module.exports = router
