const app = require('../src/app.js')
const request = require('supertest')
const User = require('../db/models/index.js').User
const userAuth = require('./userAuth.js')

describe('Auth', () => {
	describe('Auth middleware', () => {
		test('should respond with a 401 status code', async () => {
			const response = await request(app).get('/api/users')

			expect(response.statusCode).toBe(401)
			expect(response.headers['content-type']).toEqual(
				expect.stringContaining('json')
			)
			expect(response.body).toHaveProperty('error')
		})
	})

	describe('POST register and login', () => {
		// register
		test('should respond with a 200 status code', async () => {
			const response = await request(app)
				.post('/api/auth/register')
				.send(userAuth)

			expect(response.statusCode).toBe(201)
			expect(response.body).toHaveProperty('user')
			expect(response.headers['content-type']).toEqual(
				expect.stringContaining('json')
			)

			userAuth.id = response.body.user.id
		})

		// login
		test('should respond with a 200 status code and return the token', async () => {
			const response = await request(app).post('/api/auth/login').send(userAuth)

			expect(response.statusCode).toBe(200)
			expect(response.body).toHaveProperty('token')
			expect(response.headers['content-type']).toEqual(
				expect.stringContaining('json')
			)

			userAuth.token = response.body.token
		})
	})
})

describe('users', () => {
	describe('GET /user', () => {
		test('should respond with a 200 status code and return an users array', async () => {
			const response = await request(app)
				.get('/api/users')
				.set('Authorization', `bearer ${userAuth.token}`)

			expect(response.statusCode).toBe(200)
			expect(response.headers['content-type']).toEqual(
				expect.stringContaining('json')
			)
			expect(response.body).toHaveProperty('users')
			expect(response.body.users).toBeInstanceOf(Array)
		})
	})

	describe('PUT /user', () => {
		test('should respond with a 200 status code and return an user object', async () => {
			const response = await request(app)
				.put('/api/users/' + userAuth.id)
				.send({ name: 'updated' })
				.set('Authorization', `bearer ${userAuth.token}`)

			expect(response.statusCode).toBe(200)
			expect(response.headers['content-type']).toEqual(
				expect.stringContaining('json')
			)
			expect(response.body).toHaveProperty('user')
			expect(response.body.user).toBeInstanceOf(Object)
		})

		test('should respond with a 403 status', async () => {
			const response = await request(app)
				.put('/api/users/' + (userAuth.id - 1))
				.send({ name: 'updated' })
				.set('Authorization', `bearer ${userAuth.token}`)

			expect(response.statusCode).toBe(403)
			expect(response.headers['content-type']).toEqual(
				expect.stringContaining('json')
			)
			expect(response.body).toHaveProperty('message')
		})
	})

	describe('DELETE /user', () => {
		test('should respond with a 202 status code', async () => {
			const response = await request(app)
				.delete('/api/users/' + userAuth.id)
				.set('Authorization', `bearer ${userAuth.token}`)

			expect(response.statusCode).toBe(202)
		})

		test('should respond with a 403 status code', async () => {
			const response = await request(app)
				.delete('/api/users/' + (userAuth.id - 1))
				.set('Authorization', `bearer ${userAuth.token}`)

			expect(response.statusCode).toBe(403)
		})

		// 404 does not work
	})
})

// Delete the created user
afterAll(async () => {
	await User.destroy({
		where: {
			id: userAuth.id
		}
	})
})
