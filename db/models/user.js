'use strict'
const bcrypt = require('bcrypt')
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			User.hasMany(models.Task, {
				foreignKey: 'user_id',
				sourceKey: 'id'
			})
		}
	}
	User.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			email: {
				type: DataTypes.STRING,
				unique: true
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false
			},
			is_deleted: {
				type: DataTypes.INTEGER
			}
		},
		{
			sequelize,
			modelName: 'User'
		}
	)

	User.addHook('beforeCreate', async (user, options) => {
		try {
			user.is_deleted = 1

			const passwordWithHash = await bcrypt.hash(user.password, 5)
			user.password = passwordWithHash
		} catch (error) {
			console.log({ message: 'Error in hook beforeCreate' })
		}
	})

	return User
}
