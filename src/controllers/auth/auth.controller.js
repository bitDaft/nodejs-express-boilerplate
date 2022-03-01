import { default as jwt } from 'jsonwebtoken';

import { Failure } from '#lib/responseHelpers';
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
  patchUserInstance,
  clearResetUserInstance,
  getUserWithResetToken,
} from './db.js';
import {
  validateForgotPassword,
  validateLogin,
  validateRefreshToken,
  validateRegister,
  validateValidateResetToken,
  validateVerify,
} from './validate.js';

const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;

export const loginUser = async (email, password) => {
  validateLogin({ email, password });

  const users = await getUserWithEmailAndValid(email, true);
  const user = users[0];
  if (!user || !user.isVerified || !user.validatePassword(password))
    throw new Failure('Invalid Email or Password', 401, 'INVALID');

  const jwtToken = jwt.sign({ id: user.id }, config.jwtSecret, {
    expiresIn: '15m',
  });

  let refresh_token = await createRefreshTokenforUser(user.id);

  return {
    user: basicUser(user),
    role: user.role.name,
    access_token: jwtToken,
    refresh_token: refresh_token.refresh_token,
    expires_at: new Date(Date.now() + 15 * MINUTE).getTime(),
  };
};

export const registerUser = async (name, email, password) => {
  validateRegister({ name, email, password });

  // # Throw error if search index is anything other than 0
  const search_index = password.search(PASSWORD_RE);
  if (search_index)
    throw new Failure(
      'Password must have a minimum length of 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character(@$!%*?&)'
    );

  const users = await getUserWithEmail(email);
  if (users.length) throw new Failure('Email already registered', 400, 'EXISTS');

  const user = await createUser(name, email, password);

  await sendRegistrationSuccessEmail(name, email, user.verification_token).catch(async (err) => {
    await deleteUserInstance(user);
    throw new Failure('Could not register user. Please try again later', 500);
  });

  return user;
};

export const verifyUser = async (token) => {
  validateVerify({ token });

  const users = await getUserWithVerificationToken(token);
  const user = users[0];

  if (!user) throw new Failure('Invalid verification token given');
  if (user.isVerified) throw new Failure('User has already been verified');

  if (new Date(user.verification_expiry).getTime() < Date.now()) {
    await deleteUserInstance(user);
    throw new Failure('Verification time has expired. please register again', 400, 'EXPIRED');
  }

  user.verify();
  await patchUserInstance(user);

  sendVerificationSuccessEmail(user.email);

  return user;
};

export const refreshToken = async (refToken) => {
  validateRefreshToken({ refToken });

  const tokens = await getRefreshTokenWithToken(refToken);
  const token = tokens[0];
  if (!token) throw new Failure('Invalid refresh token given');

  if (!token.isValid || !token.user) {
    await deleteRefreshTokenInstance(token);
    throw new Failure('Invalid or Expired Refresh token. please login again', 400, 'EXPIRED');
  }

  const jwtToken = jwt.sign({ id: user.id }, config.jwtSecret, {
    expiresIn: '15m',
  });

  const user = token.user;
  await deleteRefreshTokenInstance(token);

  const refresh_token = await createRefreshTokenforUser(user.id);

  return {
    access_token: jwtToken,
    refresh_token: refresh_token.refresh_token,
    expires_at: new Date(Date.now() + 15 * MINUTE).getTime(),
  };
};

export const revokeToken = async (refToken, refreshTokens) => {
  validateRefreshToken({ refToken });

  const token = refreshTokens.find((token) => token.refresh_token === refToken);
  if (!token) throw new Failure('Invalid refresh token given');

  await deleteRefreshTokenInstance(token);
  return true;
};

export const forgotPassword = async (email) => {
  validateForgotPassword({ email });

  const users = await getUserWithEmailAndValid(email, true);
  const user = users[0];

  if (!user) return true;

  user.reset();
  await patchUserInstance(user);

  await sendForgotPasswordEmail(email, user.reset_token).catch(async (err) => {
    await clearResetUserInstance(user);
    throw new Failure('Could not send Password reset email. Please try again later', 500);
  });

  return true;
};

export const validateResetToken = async (token) => {
  validateValidateResetToken({ token });

  const users = await getUserWithResetToken(token);
  const user = users[0];
  if (!user) throw new Failure('Invalid reset token given');

  return user;
};

export const resetPassword = async (token, password) => {
  validateRestPassword({ token, password });

  // # Throw error if search index is anything other than 0
  const search_index = password.search(PASSWORD_RE);
  if (search_index)
    throw new Failure(
      'Password must have a minimum length of 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character'
    );

  let user = await validateResetToken(token);

  user.setPassword(password);
  clearResetUserInstance(user);

  sendPasswordResetSuccessEmail(user.email);
  return true;
};
