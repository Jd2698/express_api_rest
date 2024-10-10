const Task = require('../../db/models').Task
const User = require('../../db/models').User

const getTasks = async (req, res) => {
	const { includeDeleted } = req.query

	const authenticatedUserId = req.user.user.id

	try {
		let userCondition

		if (includeDeleted && includeDeleted.toLowerCase() == 'true') {
			userCondition = 0
		} else {
			userCondition = 1
		}

		const data = await Task.findAll({
			where: {
				user_id: authenticatedUserId
			},
			include: {
				model: User,
				where: {
					is_deleted: userCondition
				}
			}
		})

		res.json(data)
	} catch (error) {
		console.log('Error fetching  tasks:', error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

const getTask = async (req, res) => {
	const { id } = req.params

	const authenticatedUserId = req.user.user.id

	try {
		const task = await Task.findOne({
			where: { id, user_id: authenticatedUserId },
			include: { model: User }
		})

		if (!task) return res.status(404).json({ message: 'Task not found' })

		res.json(task)
	} catch (error) {
		console.log('Error fetching  task: ', error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

const createTask = async (req, res) => {
	const authenticatedUserId = req.user.user.id

	try {
		const newTask = await Task.create({
			...req.body,
			user_id: authenticatedUserId
		})

		res.status(201).json(newTask)
	} catch (error) {
		console.log('Error creating task:', error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

const updateTask = async (req, res) => {
	const { id } = req.params
	const authenticatedUserId = req.user.user.id

	try {
		const existingTask = await Task.findByPk(id)
		if (!existingTask)
			return res.status(404).json({ message: 'Task not found' })

		if (authenticatedUserId != existingTask.user_id)
			return res.status(403).json({ message: 'User without permissions' })

		existingTask.set(req.body)
		await existingTask.save()

		res.json(existingTask)
	} catch (error) {
		console.log('Error updating task:', error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

const deleteTask = async (req, res) => {
	const { id } = req.params
	const authenticatedUserId = req.user.user.id

	try {
		const deletionResult = await Task.destroy({
			where: {
				id,
				user_id: authenticatedUserId
			}
		})

		if (!deletionResult)
			return res.status(404).json({ message: 'Task not found' })

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
