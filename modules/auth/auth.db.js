import config from '#config';
import { RefreshToken, User } from '#models';
import { randomToken } from '#utils/randomToken';
import { DAY, MINUTE } from '#utils/timeConstants';

export const createUser = (name, email, password) => {
  const user = User.fromJson({
    name: name,
    email: email,
    valid: false,
    verification_token: randomToken(),
    verification_expiry: new Date(Date.now() + config.verificationTokenDuration * MINUTE),
  });
  user.setPassword(password);
  return User.query().insert(user);
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
  user.clearReset();
  return patchUserInstance(user);
};

export const deleteUserInstance = (user) => {
  return user.$query().delete();
};

export const getRefreshTokenWithToken = (token) => {
  return RefreshToken.query().where('refresh_token', token).limit(1).withGraphFetched('user');
};

export const createRefreshTokenforUser = (userId, parent_id) => {
  return RefreshToken.query().insert({
    user_id: userId,
    refresh_token: randomToken(),
    expires: new Date(Date.now() + config.refreshTokenDuration * DAY),
    parent_id,
  });
};

export const invalidateRefreshTokenInstance = (refreshTokenId) => {
  return RefreshToken.query().patch({ valid: false }).where('id', refreshTokenId);
};

export const deleteRefreshTokenChain = (refreshTokenId) => {
  return RefreshToken.query().delete().where('id', refreshTokenId);
};
