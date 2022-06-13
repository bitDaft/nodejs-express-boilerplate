import { default as jwt } from 'jsonwebtoken';

import { Failure } from '#lib/responseHelpers';
import config from '#config';

import {
  sendRegistrationSuccessEmail,
  sendVerificationSuccessEmail,
  sendPasswordResetSuccessEmail,
  sendForgotPasswordEmail,
} from './auth.notification.js';
import { basicUser } from './auth.util.js';
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
} from './auth.db.js';
import {
  validateForgotPassword,
  validateLogin,
  validateRefreshToken,
  validateRegister,
  validateRestPassword,
  validateValidateResetToken,
  validateVerify,
} from './auth.validate.js';

const getJWTExpiresTime = () => new Date(Date.now() + 15 * MINUTE).getTime();

export const loginExistingUser = async (email, password) => {
  const inputData = validateLogin({ email, password });

  const users = await getUserWithEmailAndValid(inputData.email, true);
  const user = users[0];
  if (!user || !user.isVerified() || !user.validatePassword(inputData.password))
    throw new Failure('Invalid Email or Password', 'USER_INPUT');

  const jwtToken = jwt.sign({ id: user.id }, config.jwtSecret, {
    expiresIn: '15m',
  });

  let refreshToken = await createRefreshTokenforUser(user.id);

  return {
    user: basicUser(user),
    role: user.role.name,
    accessToken: jwtToken,
    refreshToken: refreshToken.refresh_token,
    expiresAt: getJWTExpiresTime(),
  };
};

export const registerNewUser = async (name, email, password) => {
  const inputData = validateRegister({ name, email, password });

  const users = await getUserWithEmail(inputData.email);
  const user = users[0];
  if (user) {
    if (user.isVerified()) {
      throw new Failure('Email already registered', 409, 'ALREADY_REGISTERED');
    } else if (new Date(user.verification_expiry).getTime() > Date.now()) {
      throw new Failure('Email already registered', 409, 'ALREADY_REGISTERED');
    } else {
      await deleteUserInstance(user);
    }
  }

  const newUser = await createUser(inputData.name, inputData.email, inputData.password);

  sendRegistrationSuccessEmail(inputData.name, inputData.email, newUser.verification_token);

  return newUser;
};

export const verifyUser = async (token) => {
  const inputData = validateVerify({ token });

  const users = await getUserWithVerificationToken(inputData.token);
  const user = users[0];

  if (!user || user.isVerified())
    throw new Failure('User has already been verified', 409, 'ALREADY_VERIFIED');

  if (new Date(user.verification_expiry).getTime() < Date.now()) {
    await deleteUserInstance(user);
    throw new Failure(
      'Verification time has expired. please register again',
      'VERIFICATION_EXPIRY'
    );
  }

  user.verify();
  await patchUserInstance(user);

  sendVerificationSuccessEmail(user.email);

  return user;
};

export const refreshToken = async (refToken) => {
  const inputData = validateRefreshToken({ refToken });

  const tokens = await getRefreshTokenWithToken(inputData.refToken);
  const token = tokens[0];
  if (!token) throw new Failure('Invalid refresh token provided', 'INVALID_TOKEN');

  if (!token.isValid() || !token.user) {
    await deleteRefreshTokenInstance(token);
    throw new Failure('Invalid or expired refresh token. Please login again', 'INVALID_TOKEN');
  }

  const jwtToken = jwt.sign({ id: user.id }, config.jwtSecret, {
    expiresIn: '15m',
  });

  const user = token.user;
  await deleteRefreshTokenInstance(token);

  const refreshToken = await createRefreshTokenforUser(user.id);

  return {
    accessToken: jwtToken,
    refreshToken: refreshToken.refresh_token,
    expiresAt: getJWTExpiresTime(),
  };
};

export const revokeToken = async (refToken, refreshTokens) => {
  const inputData = validateRefreshToken({ refToken });

  const token = refreshTokens.find((token) => token.refresh_token === inputData.refToken);
  if (!token) throw new Failure('Invalid refresh token given', 'INVALID_TOKEN');

  await deleteRefreshTokenInstance(token);
  return true;
};

export const requestPasswordChange = async (email) => {
  const inputData = validateForgotPassword({ email });

  const users = await getUserWithEmailAndValid(inputData.email, true);
  const user = users[0];

  if (!user) throw new Failure('Invalid email provided', 'USER_INPUT');

  user.reset();
  await patchUserInstance(user);

  sendForgotPasswordEmail(inputData.email, user.reset_token);

  return user;
};

export const validateResetToken = async (token) => {
  const inputData = validateValidateResetToken({ token });

  const users = await getUserWithResetToken(inputData.token);
  const user = users[0];
  if (!user) throw new Failure('Invalid reset token given', 'INVALID_TOKEN');

  return user;
};

export const resetUserPassword = async (token, password) => {
  const inputData = validateRestPassword({ token, password });

  const user = await validateResetToken(inputData.token);

  user.setPassword(inputData.password);
  clearResetUserInstance(user);

  sendPasswordResetSuccessEmail(user.email);
  return user;
};
