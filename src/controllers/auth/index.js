import { default as jwt } from 'jsonwebtoken';

import { Failure } from '#lib/responseHelpers';
import { easyCatch } from '#lib/easyCatch';
import config from '#config';

import {
  sendRegistrationSuccessEmail,
  sendVerificationSuccessEmail,
  sendPasswordResetSuccessEmail,
  sendForgotPasswordEmail,
} from './notification.js';
import { basicUser } from './util.js';
import {
  getUserWithEmail,
  getUserWithEmailAndValid,
  deleteRefreshTokenInstance,
  createRefreshTokenforUser,
  createUser,
  deleteUserInstance,
  getUserWithVerificationToken,
  getRefreshTokenWithToken,
  verifyUserInstance,
  resetUserInstance,
  clearResetUserInstance,
  getUserWithResetToken,
  resetUserPasswordInstance,
} from './db.js';

export const loginUser = async (email, password) => {
  if (typeof email !== 'string' && !email) {
    throw new Failure('Invalid Email given');
  }
  if (typeof password !== 'string' && !password) {
    throw new Failure('Invalid Password given');
  }
  let loginCatch = easyCatch('Unable to log in user');

  let users = await getUserWithEmailAndValid(email, true).catch(loginCatch('user fetch'));

  if (!users.length || !users[0].isVerified || !users[0].validatePassword(password)) {
    throw new Failure('Invalid Email or Password', 401, 'INVALID');
  }
  let user = users[0];

  let jwtToken = jwt.sign({ sub: user.id, id: user.id }, config.jwtSecret, {
    expiresIn: '15m',
  });

  if (user.refresh_token) {
    await deleteRefreshTokenInstance(user.refresh_token).catch(loginCatch('delete refresh token'));
  }

  let refresh_token = await createRefreshTokenforUser(user.id).catch(
    loginCatch('create refresh token')
  );

  return {
    user: basicUser(user),
    role: user.role,
    access_token: jwtToken,
    refresh_token: refresh_token.refresh_token,
  };
};

export const registerUser = async (name, email, password) => {
  if (typeof name !== 'string' && !name) {
    throw new Failure('Invalid Name given');
  }
  if (typeof email !== 'string' && !email) {
    throw new Failure('Invalid Email given');
  }
  if (typeof password !== 'string' && !password) {
    throw new Failure('Invalid Password given');
  }

  let registerCatch = easyCatch('Unable to register user');

  let password_re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;

  let search_index = password.search(password_re);
  // # Throw error if search index is anything other than 0
  if (search_index) {
    throw new Failure(
      'Password must have a minimum length of 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character'
    );
  }

  let users = await getUserWithEmail(email).catch(registerCatch('user fetch'));

  let user = null;
  if (users.length) {
    throw new Failure('Email already registered', 400, 'EXISTS');
  } else {
    user = await createUser(name, email, password).catch(registerCatch('user create'));
  }

  await sendRegistrationSuccessEmail(name, email, user.verification_token).catch(async (err) => {
    await deleteUserInstance(user).catch(registerCatch('user delete'));
    await registerCatch('email send')(err);
  });

  return user;
};

export const verifyUser = async (token) => {
  if (typeof token !== 'string' && !token) {
    throw new Failure('Invalid Token given');
  }
  let verifyCatch = easyCatch('Unable to verify user');

  let users = await getUserWithVerificationToken(token).catch(verifyCatch('user fetch'));

  if (!users.length) throw new Failure('Invalid Token given');

  let user = users[0];

  if (user.isVerified) {
    throw new Failure('User has already been verified');
  }

  if (new Date(user.verification_expiry).getTime() < Date.now()) {
    await deleteUserInstance(user).catch(verifyCatch('user delete'));
    throw new Failure('Verification time has expired. please register again', 400, 'EXPIRED');
  }

  await verifyUserInstance(user).catch(verifyCatch('user verification'));

  sendVerificationSuccessEmail(user.email);

  return user;
};

export const refreshToken = async (token_string) => {
  if (typeof token_string !== 'string' && !token_string) {
    throw new Failure('Invalid Refresh token given');
  }

  let refreshCatch = easyCatch('Unable to refresh token');

  let tokens = await getRefreshTokenWithToken(token_string).catch(refreshCatch('token fetch'));

  if (!tokens.length) {
    throw new Failure('Invalid Refresh token given', 400, 'INVALID');
  }
  let token = tokens[0];

  if (!token.isValid || !token.user) {
    await deleteRefreshTokenInstance(token).catch(refreshCatch('invalid token delete'));
    throw new Failure('Invalid or Expired Refresh token. please login again', 400, 'EXPIRED');
  }

  let user = token.user;

  let jwtToken = jwt.sign({ sub: user.id, id: user.id }, config.jwtSecret, {
    expiresIn: '15m',
  });

  await deleteRefreshTokenInstance(token).catch(refreshCatch('valid token delete'));

  let refresh_token = await createRefreshTokenforUser(user.id).catch(
    refreshCatch('refresh token create')
  );

  return {
    access_token: jwtToken,
    refresh_token: refresh_token.refresh_token,
  };
};

export const revokeToken = async (token_string) => {
  if (typeof token_string !== 'string' && !token_string) {
    throw new Failure('Invalid Refresh token given');
  }
  let revokeCatch = easyCatch('Unable to revoke token');

  let tokens = await getRefreshTokenWithToken(token_string).catch(revokeCatch('token fetch'));

  if (!tokens.length) {
    throw new Failure('Invalid Refresh token given', 400, 'INVALID');
  }
  let token = tokens[0];

  if (!token.isValid || !token.user) {
    await deleteRefreshTokenInstance(token).catch(revokeCatch('invalid token delete'));
    return true;
  }

  let user = token.user;

  await deleteRefreshTokenInstance(token).catch(revokeCatch('valid token delete'));

  return true;
};

export const forgotPassword = async (email) => {
  if (typeof email !== 'string' && !email) {
    throw new Failure('Invalid Email given');
  }
  let forgotCatch = easyCatch('Unable to reset password');

  let users = await getUserWithEmailAndValid(email, true).catch(forgotCatch('user fetch'));

  if (!users.length) {
    return true;
  }

  let user = users[0];

  await resetUserInstance(user).catch(forgotCatch('user reset'));

  await sendForgotPasswordEmail(email, user.reset_token).catch(async (err) => {
    await clearResetUserInstance(user).catch(forgotCatch('user reset clear'));
    await forgotCatch('email sending')(err);
  });

  return true;
};

export const validateResetToken = async (token) => {
  if (typeof token !== 'string' && !token) {
    throw new Failure('Invalid Reset token given');
  }
  let validateCatch = easyCatch('Unable to reset password');

  let users = await getUserWithResetToken(token).catch(validateCatch('user reset fetch'));

  if (!users.length) {
    throw new Failure('Invalid token');
  }

  return users[0];
};

export const resetPassword = async (token, password) => {
  if (typeof token !== 'string' && !token) {
    throw new Failure('Invalid Reset token given');
  }
  if (typeof password !== 'string' && !password) {
    throw new Failure('Invalid Reset password given');
  }
  let resetCatch = easyCatch('Unable to reset password');

  let password_re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;

  let search_index = password.search(password_re);
  // # Throw error if search index is anything other than 0
  if (search_index) {
    throw new Failure(
      'Password must have a minimum length of 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character'
    );
  }

  let user = await validateResetToken(token);

  resetUserPasswordInstance(user, password).catch(resetCatch('user reset password'));

  sendPasswordResetSuccessEmail(user.email);
  return true;
};
