const User = require('../../db/models').User

const getUsers = async (req, res) => {
	const { usersdeleted } = req.query
	try {
		let showUsersDeleted

		if (usersdeleted && usersdeleted.toLowerCase() == 'true') {
			showUsersDeleted = 0
		} else {
			showUsersDeleted = 1
		}

		const data = await User.findAll({
			where: { is_deleted: showUsersDeleted },
			include: 'Tasks'
		})

		res.json(data)
	} catch (error) {
		console.log('Error getting users:', error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

const getUser = async (req, res) => {
	const { id } = req.params

	try {
		const user = await User.findOne({
			where: {
				id,
				is_deleted: 1
			},
			include: 'Tasks'
		})
		if (!user) return res.status(404).json({ message: 'User not found' })

		res.json(user)
	} catch (error) {
		console.log('Error getting user:', error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

const createUser = async (req, res) => {
	try {
		const result = await User.create(req.body)
		res.json(result)
	} catch (error) {
		console.log('Error creating user:', error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

const updateUser = async (req, res) => {
	const { id } = req.params

	try {
		const user = await User.findOne({ where: { id, is_deleted: 1 } })
		if (!user) return res.status(404).json({ message: 'User not found' })

		user.set(req.body)
		await user.save()

		res.json(user)
	} catch (error) {
		console.log('Error updating users:', error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

const deleteUser = async (req, res) => {
	const { id } = req.params

	try {
		const user = await User.findByPk(id)
		if (!user) return res.status(404).json({ message: 'User not found' })

		user.set({ is_deleted: 0 })

		await user.save()
		res.sendStatus(202)
	} catch (error) {
		console.log('Error deleting user:', error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

module.exports = {
	getUser,
	getUsers,
	createUser,
	updateUser,
	deleteUser
}
