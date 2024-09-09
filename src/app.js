const express = require('express')
const user = require('../db/models').User

const app = express()

app.get('/users', async (req, res) => {
	try {
		const data = await user.findAll()
		res.json(data)
	} catch (error) {
		console.log(error)
		res.status(500).json(error.message)
	}
})

app.listen(3000, () => console.log('running on port 3000'))
