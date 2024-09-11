const { body, validationResult } = require('express-validator')
const { Op } = require('sequelize')
const User = require('../../db/models').User

const validateCreate = [
	body('name').exists().notEmpty().isString(),
	body('email')
		.exists()
		.notEmpty()
		.isEmail()
		.normalizeEmail()
		.custom(async value => {
			const user = await User.findOne({
				where: {
					email: value
				}
			})
			if (user) throw new Error('Email already in use')
		}),
	body('password').exists().notEmpty().isString()
]

const validateUpdate = [
	body('name').optional().isString().isLength({min: 3, max: 30}),
	body('email')
		.optional()
		.isEmail()
		.normalizeEmail()
		.custom(async (value, { req }) => {
			const user = await User.findOne({
				where: {
					email: value,
					[Op.not]: {
						id: req.params.id
					}
				}
			})

			if (user) throw new Error('Email already in use')
		}),
	body('password').optional().isString().isLength({min: 5, max: 30})
]

const result = (req, res, next) => {
	try {
		validationResult(req).throw()
		return next()
	} catch (error) {
		res.status(403).json({ errors: error.array() })
	}
}

module.exports = { validateCreate, validateUpdate, result }
