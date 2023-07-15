import { UserRepo } from '../../repository';

export const register = async (_, { name, email, password }) => {
  const user = UserRepo.create({
    name,
    email,
    password,
  });

  await UserRepo.save(user);

  return user;
};
