import * as yup from 'yup';
import bcrypt from 'bcrypt';

import { UserRepo } from '../../../repository';
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  invalidLogin,
  nameNotLongEnough,
  passwordNotLongEnough,
} from '../../../utils/error';
import { formatYupError } from '../../../utils/format';
import { YogaInitialContext } from 'graphql-yoga';

const schema = yup.object().shape({
  name: yup.string().min(3, nameNotLongEnough).max(255),
  email: yup.string().min(3, emailNotLongEnough).max(255).email(invalidEmail),
  password: yup.string().min(3, passwordNotLongEnough).max(255),
});

export const getUsers = async (_, {}) => {
  return await UserRepo.find();
};

export const getUser = async (_, { id }) => {
  return await UserRepo.findOne({ where: { id } });
};

export const registerUser = async (_, args) => {
  try {
    await schema.validate(args, { abortEarly: false });
  } catch (err) {
    const error = err as yup.ValidationError;
    return { errors: formatYupError(error), user: null };
  }

  const { name, email, password } = args;

  const userExists = await UserRepo.findOne({ where: { email } });

  if (userExists)
    return {
      user: null,
      errors: [
        {
          path: 'email',
          message: duplicateEmail,
        },
      ],
    };

  const user = UserRepo.create({
    name,
    email,
    password,
  });
  await UserRepo.save(user);

  return { user, errors: null };
};

export const loginUser = async (_, args, ctx: YogaInitialContext) => {
  try {
    await schema.validate(args, { abortEarly: false });
  } catch (err) {
    const error = err as yup.ValidationError;
    return { errors: formatYupError(error), user: null };
  }

  const { email, password } = args;

  const user = await UserRepo.findOne({ where: { email } });
  if (user && (await bcrypt.compare(password, user.password))) {
    return { user, errors: null };
  }

  return {
    user: null,
    errors: [
      {
        path: 'login',
        message: invalidLogin,
      },
    ],
  };
};
