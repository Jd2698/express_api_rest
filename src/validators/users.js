const { body, validationResult } = require('express-validator')
const { Op } = require('sequelize')
const User = require('../../db/models').User

const { userErrors } = require('../utils/errorMessages.js')

const validateCreate = [
	body('name')
		.exists()
		.withMessage(userErrors.nameRequired)
		.notEmpty()
		.withMessage(userErrors.nameEmpty)
		.isString()
		.isLength({ min: 3, max: 30 })
		.withMessage(userErrors.nameLength),
	body('email')
		.exists()
		.withMessage(userErrors.emailRequired)
		.notEmpty()
		.withMessage(userErrors.emailEmpty)
		.isEmail()
		.withMessage(userErrors.emailValid)
		.normalizeEmail()
		.custom(async value => {
			const user = await User.findOne({
				where: {
					email: value
				}
			})
			if (user) throw new Error(userErrors.emailInUse)
		}),
	body('password')
		.exists()
		.withMessage(userErrors.passwordRequired)
		.notEmpty()
		.withMessage(userErrors.passwordEmpty)
		.isString()
		.isLength({ min: 5, max: 30 })
		.withMessage(userErrors.passwordLength)
]

const validateUpdate = [
	body('name')
		.optional()
		.isString()
		.isLength({ min: 3, max: 30 })
		.withMessage(userErrors.nameLength),
	body('email')
		.optional()
		.isEmail()
		.withMessage(userErrors.emailValid)
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

			if (user) throw new Error(userErrors.emailInUse)
		}),
	body('password')
		.optional()
		.isString()
		.isLength({ min: 5, max: 30 })
		.withMessage(userErrors.passwordLength)
]

const result = (req, res, next) => {
	try {
		validationResult(req).throw()
		return next()
	} catch (error) {
		res.status(400).json({ errors: error.array() })
	}
}

module.exports = { validateCreate, validateUpdate, result }
