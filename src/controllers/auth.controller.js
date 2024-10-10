const User = require('../../db/models').User
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
	const { email, password } = req.body

	try {
		const foundUser = await User.findOne({ where: { email } })

		if (!foundUser)
			return res.status(404).json({ message: 'Invalid credentials' })

		const isPasswordValid = await bcrypt.compare(password, foundUser.password)
		if (!isPasswordValid)
			return res.status(401).json({ message: 'Invalid credentials' })

		const authToken = jwt.sign({ user: foundUser }, process.env.PRIVATEKEY, {
			expiresIn: '1h'
		})

		res.header('authorization', authToken).json({ token: authToken })
	} catch (error) {
		console.log('Login error: ' + error)
		res.status(500).json({ message: 'Internal serve error' })
	}
}

module.exports = {
	login
}
