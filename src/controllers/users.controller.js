const User = require('../../db/models').User

const getUsers = async (req, res) => {
	const { includeDeleted } = req.query

	try {
		let showUsersDeleted

		if (includeDeleted && includeDeleted.toLowerCase() == 'true') {
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
		console.log('Error fetching  users:', error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

const getUser = async (req, res) => {
	const { id } = req.params

	try {
		const foundUser = await User.findOne({
			where: {
				id,
				is_deleted: 1
			},
			include: 'Tasks'
		})
		if (!foundUser) return res.status(404).json({ message: 'User not found' })

		res.json(foundUser)
	} catch (error) {
		console.log('Error fetching  user:', error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

const createUser = async (req, res) => {
	try {
		const newUser = await User.create(req.body)
		res.json(newUser)
	} catch (error) {
		console.log('Error creating user:', error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

const updateUser = async (req, res) => {
	const { id } = req.params

	const authenticatedUserId = req.user.user.id
	if (authenticatedUserId != id)
		return res.status(403).json({ message: 'User without permissions' })

	try {
		const existingUser = await User.findOne({ where: { id, is_deleted: 1 } })
		if (!existingUser)
			return res.status(404).json({ message: 'User not found' })

		existingUser.set(req.body)
		await existingUser.save()

		res.json(existingUser)
	} catch (error) {
		console.log('Error updating users:', error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

const deleteUser = async (req, res) => {
	const { id } = req.params

	const authenticatedUserId = req.user.user.id
	if (authenticatedUserId != id)
		return res.status(403).json({ message: 'User without permissions' })

	try {
		const existingUser = await User.findByPk(id)
		if (!existingUser)
			return res.status(404).json({ message: 'User not found' })

		existingUser.set({ is_deleted: 0 })

		await existingUser.save()
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
