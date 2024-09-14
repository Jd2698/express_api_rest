const { body, validationResult } = require('express-validator')
const statusEnum = require('../enums/statusEnum.js')
const User = require('../../db/models').User

const { taskErrors } = require('../utils/errorMessages.js')

const validateUserId = () => [
	body('user_id')
		.exists()
		.withMessage(taskErrors.userIdRequired)
		.notEmpty()
		.withMessage(taskErrors.userIdEmpty)
		.isNumeric()
		.withMessage(taskErrors.userIdNumeric)
		.custom(async value => {
			const user = await User.findByPk(value)
			if (!user) throw new Error(taskErrors.userNotFound)
		})
]

const validateTitle = () => [
	body('title')
		.optional()
		.isString()
		.isLength({ max: 25 })
		.withMessage(taskErrors.titleLength)
]

const validateStatus = () => [
	body('status')
		.optional()
		.isIn(Object.values(statusEnum))
		.withMessage(taskErrors.statusNotFound)
]

const validateCreate = [
	...validateUserId(),
	...validateStatus(),
	...validateTitle(),
	body('description')
		.exists()
		.withMessage(taskErrors.descriptionRequired)
		.notEmpty()
		.withMessage(taskErrors.descriptionEmpty)
		.isString()
		.isLength({ max: 80 })
		.withMessage(taskErrors.descriptionLength)
]

const validateUpdate = [
	...validateUserId(),
	...validateStatus(),
	...validateTitle(),
	body('description')
		.optional()
		.isString()
		.isLength({ max: 80 })
		.withMessage(taskErrors.descriptionLength)
]

const result = (req, res, next) => {
	try {
		validationResult(req).throw()
		return next()
	} catch (error) {
		res.status(400).json({ errors: error.errors })
	}
}

module.exports = { validateCreate, validateUpdate, result }
