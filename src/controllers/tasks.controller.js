const Task = require('../../db/models').Task

const getTasks = async (req, res) => {
	try {
		const data = await Task.findAll({
			include: 'User'
		})

		res.json(data)
	} catch (error) {
		console.log(error)
		res.status(500).json(error.message)
	}
}

const getTask = async (req, res) => {
	const { id } = req.params

	try {
		const task = await Task.findByPk(id, { include: 'User' })
		if (!task) return res.status(404).json({ message: 'Task not found' })

		res.json(task)
	} catch (error) {
		console.log(error)
		res.status(500).json(error.message)
	}
}

const createTask = async (req, res) => {
	try {
		const result = await Task.create(req.body)
		res.json(result)
	} catch (error) {
		console.log(error)
		res.status(500).json(error.message)
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
		console.log(error)
		res.status(500).json(error.message)
	}
}

module.exports = {
	getTask,
	getTasks,
	createTask,
	updateTask
}
