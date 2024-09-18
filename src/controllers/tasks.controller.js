const Task = require('../../db/models').Task
const User = require('../../db/models').User

const getTasks = async (req, res) => {
	const { userDeleted } = req.query

	try {
		let userCondition

		if (userDeleted && userDeleted.toLowerCase() == 'true') {
			userCondition = 0
		} else {
			userCondition = 1
		}

		const data = await Task.findAll({
			include: {
				model: User,
				where: {
					is_deleted: userCondition
				}
			}
		})

		res.json(data)
	} catch (error) {
		console.log('Error getting tasks:', error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

const getTask = async (req, res) => {
	const { id } = req.params

	try {
		const task = await Task.findByPk(id, { include: 'User' })
		if (!task) return res.status(404).json({ message: 'Task not found' })

		res.json(task)
	} catch (error) {
		console.log('Error getting task: ', error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

const createTask = async (req, res) => {
	try {
		const result = await Task.create(req.body)
		res.json(result)
	} catch (error) {
		console.log('Error creating task:', error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

const updateTask = async (req, res) => {
	const { id } = req.params

	try {
		const task = await Task.findByPk(id)
		if (!task) return res.status(404).json({ message: 'Task not found' })

		task.set(req.body)
		await task.save()

		res.json(task)
	} catch (error) {
		console.log('Error updating task:', error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

const deleteTask = async (req, res) => {
	const { id } = req.params

	try {
		const result = await Task.destroy({
			where: {
				id
			}
		})

		if (!result) return res.status(404).json({ message: 'Task not foundS' })

		res.sendStatus(202)
	} catch (error) {
		console.log('Error deleting task:', error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

module.exports = {
	getTask,
	getTasks,
	createTask,
	updateTask,
	deleteTask
}
