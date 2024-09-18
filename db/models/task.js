'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Task extends Model {
		static associate(models) {
			Task.belongsTo(models.User, {
				foreignKey: 'user_id',
				targetKey: 'id'
			})
		}
	}
	Task.init(
		{
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			title: DataTypes.STRING,
			description: {
				type: DataTypes.STRING,
				allowNull: false
			},
			status: {
				type: DataTypes.ENUM('completed', 'pending'),
				defaultValue: 'pending'
			}
		},
		{
			sequelize,
			modelName: 'Task'
		}
	)

	Task.addHook('beforeCreate', (task, options) => {
		task.status = 'pending'
	})

	return Task
}
