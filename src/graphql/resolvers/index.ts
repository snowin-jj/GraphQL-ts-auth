import { Resolvers } from '../../generated/graphql';
import { register } from './user';

const resolvers: Resolvers = {
  Query: {
    hello: (_, { name }) => `Hello, ${name}`,
  },

  Mutation: {
    register,
  },
};

export default resolvers;
