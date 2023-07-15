import { Resolvers } from '../../generated/graphql';
import { registerUser } from './user';

const resolvers: Resolvers = {
  Query: {
    hello: (_, { name }) => `Hello, ${name}`,
  },

  Mutation: {
    registerUser,
  },
};

export default resolvers;
