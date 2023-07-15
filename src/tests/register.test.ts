require('dotenv').config();
import { request } from 'graphql-request';

import server from '../server';
import { host } from './constants';
import { UserRepo } from '../repository';
import { AppDataSource } from '../data-source';

beforeAll(async () => {
	await AppDataSource.initialize();
	server.listen(8000);
});

const name = 'testuser';
const email = 'user@test.com';
const password = '123';

const mutation = `#graphql
mutation {
	register(name: "${name}", email: "${email}", password: "${password}"){
		name
		email
	}
}
`;

test('Register user', async () => {
	const res = await request(host, mutation);
	expect(res).toEqual({
		register: {
			name,
			email,
		},
	});

	const users = await UserRepo.find({ where: { email } });
	expect(users).toHaveLength(1);

	const user = users[0];
	expect(user.email).toEqual(email);
	expect(user.password).not.toEqual(password);
});

afterAll(async () => {
	await AppDataSource.destroy();
	server.close();
});
