const taskErrors = {
	userIdRequired: 'User ID field is required',
	userIdEmpty: 'User ID field cannot be empty',
	userIdNumeric: 'User ID field must be a number',
	userNotFound: 'User not found',
	titleLength: 'Title must be between 1 and 25 characters long',
	descriptionRequired: 'Description field is required',
	descriptionEmpty: 'Description field cannot be empty',
	descriptionLength: 'Description must be between 1 and 80 characters long',
	statusNotFound: 'Status field not found'
}

const userErrors = {
	nameRequired: 'Name field is required',
	nameEmpty: 'Name field cannot be empty',
	nameLength: 'Name must be between 3 and 30 characters long',
	emailRequired: 'Email field is required',
	emailEmpty: 'Email field cannot be empty',
	emailValid: 'Email field must contain a valid email address',
	emailInUse: 'Email field is already in use',
	passwordRequired: 'Password field is required',
	passwordEmpty: 'Password field cannot be empty',
	passwordLength: 'Password must be between 5 and 30 characters long'
}

module.exports = { taskErrors, userErrors }
