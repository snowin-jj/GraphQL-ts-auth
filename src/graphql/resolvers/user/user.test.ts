require('dotenv').config();
import { request } from 'graphql-request';

import server from '../../../server';
import { host } from '../../../utils/constants';
import { UserRepo } from '../../../repository';
import { AppDataSource } from '../../../data-source';
import {
	duplicateEmail,
	emailNotLongEnough,
	invalidEmail,
	invalidLogin,
	nameNotLongEnough,
	passwordNotLongEnough,
} from '../../../utils/error';

beforeAll(async () => {
	await AppDataSource.initialize();
	server.listen(8000);
});

const name = 'testuser';
const email = 'user@test.com';
const password = '123';

const mutation = (name: string, email: string, password: string) => `#graphql
mutation {
	registerUser(name:"${name}", email:"${email}", password:"${password}") {
		user {
			name
			email
		}
		errors {
			path
			message
		}
  }
}
`;

const loginMutation = (email: string, password: string) => `#graphql
mutation {
	loginUser(email: "${email}", password: "${password}") {
		user {
			name
			email
		}
		errors {
			path
			message
		}
	}
}
`;

describe('Create new user', () => {
	/*
		Tests for email
	*/
	it('should create new user', async () => {
		const res = await request(host, mutation(name, email, password));
		// Check the response
		expect(res).toEqual({
			registerUser: {
				user: {
					email,
					name,
				},
				errors: null,
			},
		});

		const users = await UserRepo.find({ where: { email } });
		// Check if the user is added
		expect(users).toHaveLength(1);

		const user = users[0];
		// Check if the email we passed is same in the db
		expect(user.email).toEqual(email);
		// Check if the password is hashe or nor
		expect(user.password).not.toEqual(password);
	});

	it('should return error if user already exists', async () => {
		const res: any = await request(host, mutation(name, email, password));
		expect(res.registerUser.errors).toHaveLength(1);
		expect(res.registerUser.errors[0]).toEqual({
			path: 'email',
			message: duplicateEmail,
		});
	});

	it('should return error if the email is invalid', async () => {
		const res: any = await request(host, mutation(name, 'we', password));
		expect(res).toEqual({
			registerUser: {
				user: null,
				errors: [
					{
						path: 'email',
						message: emailNotLongEnough,
					},
					{
						path: 'email',
						message: invalidEmail,
					},
				],
			},
		});
	});

	/*
		Tests for password
	*/
	it('should return an error if password is not long enough', async () => {
		const res = await request(host, mutation(name, email, '12'));
		expect(res).toEqual({
			registerUser: {
				user: null,
				errors: [
					{
						path: 'password',
						message: passwordNotLongEnough,
					},
				],
			},
		});
	});

	/*
		Tests for name
	*/
	it('should return an error if name is not long enough', async () => {
		const res = await request(host, mutation('we', email, password));
		expect(res).toEqual({
			registerUser: {
				user: null,
				errors: [
					{
						path: 'name',
						message: nameNotLongEnough,
					},
				],
			},
		});
	});

	/*
		Tests for bad email and bad password
	*/
	it('should return an error if email is bad & not long enough and also same with password', async () => {
		const res = await request(host, mutation(name, 'de', 'pe'));
		expect(res).toEqual({
			registerUser: {
				user: null,
				errors: [
					{
						path: 'email',
						message: emailNotLongEnough,
					},
					{
						path: 'email',
						message: invalidEmail,
					},
					{
						path: 'password',
						message: passwordNotLongEnough,
					},
				],
			},
		});
	});
});

describe('Login user', () => {
	it('Should sign in the user', async () => {
		const res = await request(host, loginMutation(email, password));
		expect(res).toEqual({
			loginUser: {
				user: {
					name,
					email,
				},
				errors: null,
			},
		});
	});

	it('Should return an error if user pass invalid credentails', async () => {
		const res = await request(host, loginMutation(email, '8278'));
		expect(res).toEqual({
			loginUser: {
				user: null,
				errors: [
					{
						path: 'login',
						message: invalidLogin,
					},
				],
			},
		});
	});
});

// close all connections
afterAll(async () => {
	if (AppDataSource.isInitialized) {
		await AppDataSource.destroy();
	}
	server.close();
});
