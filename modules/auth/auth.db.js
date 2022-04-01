import { RefreshToken, User } from '#models';
import { randomToken } from '#utils/randomToken';
import { DAY, MINUTE } from '#utils/timeConstants';

export const createUser = (name, email, password) => {
  return User.query()
    .insert({
      name: name,
      email: email,
      password: '',
      salt: '',
      valid: false,
      verification_token: randomToken(),
      verification_expiry: new Date(Date.now() + 15 * MINUTE),
    })
    .then(async (user) => {
      user.setPassword(password);
      await patchUserInstance(user);
      return user;
    });
};

export const getUserWithEmail = (email) => {
  return User.query().where('email', email).limit(1);
};

export const getUserWithEmailAndValid = (email, valid) => {
  return User.query()
    .where('email', email)
    .andWhere('valid', valid)
    .limit(1)
    .withGraphFetched('role');
};

export const getUserWithVerificationToken = (token) => {
  return User.query().where('verification_token', token).limit(1);
};

export const getUserWithResetToken = (token) => {
  return User.query()
    .where('reset_token', token)
    .where('reset_token_expiry', '>', Date.now())
    .andWhere('valid', true)
    .limit(1);
};

export const patchUserInstance = (user) => {
  return user.$query().patch();
};

export const clearResetUserInstance = (user) => {
  user.reset_token = null;
  user.reset_token_expiry = null;
  return patchUserInstance(user);
};

export const deleteUserInstance = (user) => {
  return user.$query().hardDelete();
};

export const getRefreshTokenWithToken = (token) => {
  return RefreshToken.query().where('refresh_token', token).limit(1).withGraphFetched('user');
};

export const createRefreshTokenforUser = (userId) => {
  return RefreshToken.query().insert({
    user_id: userId,
    refresh_token: randomToken(),
    expires: new Date(Date.now() + 90 * DAY),
  });
};

export const deleteRefreshTokenInstance = (refreshToken) => {
  return refreshToken.$query().delete();
};
