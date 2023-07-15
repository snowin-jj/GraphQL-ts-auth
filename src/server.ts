import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { createSchema } from 'graphql-yoga';

import resolvers from './graphql/resolvers';

const typeDefs = readFileSync('./src/graphql/schema.graphql', 'utf-8');

// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga({
	schema: createSchema({
		typeDefs,
		resolvers,
	}),
});

// Pass it into a server to hook into request handlers.
const server = createServer(yoga);

export default server;
