import * as yup from 'yup';

import { UserRepo } from '../../../repository';
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  nameNotLongEnough,
  passwordNotLongEnough,
} from '../../../utils/error';
import { formatYupError } from '../../../utils/format';

const schema = yup.object().shape({
  name: yup.string().min(3, nameNotLongEnough).max(255),
  email: yup.string().min(3, emailNotLongEnough).max(255).email(invalidEmail),
  password: yup.string().min(3, passwordNotLongEnough).max(255),
});

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

// Success
// {
//   "data": {
//     "registerUser": {
//       "id": "224b5d7f-5374-4e11-9d9a-3b7024c820dc",
//       "name": "kumar",
//       "email": "kumar@gmail.com"
//     }
//   }
// }

// failure
// {
//   "errors": [
//     {
//       "message": "Email already exists",
//       "locations": [
//         {
//           "line": 2,
//           "column": 3
//         }
//       ],
//       "path": [
//         "registerUser"
//       ]
//     }
//   ],
//   "data": {
//     "registerUser": null
//   }
// }
