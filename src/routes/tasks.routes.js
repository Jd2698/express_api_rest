const { Router } = require('express')
const taskController = require('../controllers/tasks.controller.js')

const router = Router()

router.get('/tasks', taskController.getTasks)
router.post('/tasks', taskController.createTask)
router.put('/tasks/:id', taskController.updateTask)
router.get('/tasks/:id', taskController.getTask)

module.exports = router
