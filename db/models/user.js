'use strict'
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

	User.addHook('beforeCreate', (user, options) => {
		user.is_deleted = 1
	})

	return User
}
