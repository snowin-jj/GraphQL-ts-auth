import { Resolvers } from '../../generated/graphql';
import { registerUser, getUsers, getUser, loginUser } from './user';

const resolvers: Resolvers = {
  Query: {
    getUsers,
    getUser,
  },

  Mutation: {
    registerUser,
    loginUser,
  },
};

export default resolvers;
