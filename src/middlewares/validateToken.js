const jwt = require('jsonwebtoken')

const validateToken = async (req, res, next) => {
	const authHeader = req.headers['authorization']

	if (!authHeader) return res.status(401).json({ error: 'Access denied' })

	try {
		const token = authHeader.split(' ')[1]
		if (!token) return res.status(404).json({ error: 'Access denied' })

		jwt.verify(token, process.env.PRIVATEKEY, (err, user) => {
			if (err) return res.json(err)

			req.user = user
			next()
		})
	} catch (error) {
		console.error('Error validating token:', error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

module.exports = { validateToken }
