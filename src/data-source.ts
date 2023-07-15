import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { User } from './entity/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  database: process.env.POSTGRES_DB!,
  synchronize: true,
  logging: String(process.env.NODE_ENV) === 'development',
  dropSchema: String(process.env.NODE_ENV) === 'test',
  entities: [User],
  migrations: [],
  subscribers: [],
});
