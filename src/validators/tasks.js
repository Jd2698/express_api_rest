const { body, validationResult } = require('express-validator')
const statusEnum = require('../enums/statusEnum.js')

const validateCreate = [
	body('user_id').exists().notEmpty().isNumeric(),
	body('title').optional().isString().isLength({ max: 25 }),
	body('description').exists().notEmpty().isString().isLength({ max: 80 }),
	body('status').optional().isIn(Object.values(statusEnum)),
	body('deadline')
		.optional()
		.isDate()
		.custom(value => {
			const date = new Date()
			console.log(date)
		})
]

const validateUpdate = [
	body('user_id').exists().notEmpty().isNumeric(),
	body('title').optional().isString(),
	body('description').optional().isString(),
	body('status').optional().isIn(Object.values(statusEnum)),
	body('deadline').optional().isDate()
]

const result = (req, res, next) => {
	try {
		validationResult(req).throw()
		return next()
	} catch (error) {
		res.status(403).json({ errors: error.errors })
	}
}

module.exports = { validateCreate, validateUpdate, result }
