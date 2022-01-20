import { RefreshToken, User } from "#models";
import { randomToken } from "#lib/randomTokenString";
import { DAY, MINUTE } from "#lib/timeConstants";

export const createUser = (name, email, password) => {
  return User.query()
    .insert({
      name: name,
      email: email,
      password: "",
      salt: "",
      valid: false,
      role: 1,
      verification_token: randomToken(),
      verification_expiry: new Date(Date.now() + 15 * MINUTE),
    })
    .then(async (user) => {
      user.setPassword(password);
      await user.$query().patch();
      return user;
    });
};

export const getUserWithEmail = (email) => {
  return User.query()
    .where("email", email)
    .limit(1)
    .withGraphFetched("[role refresh_token]");
};

export const getUserWithEmailAndValid = (email, valid) => {
  return User.query()
    .where("email", email)
    .andWhere("valid", valid)
    .limit(1)
    .withGraphFetched("[role refresh_token]");
};

export const getUserWithVerificationToken = (token) => {
  return User.query()
    .where("verification_token", token)
    .limit(1)
    .withGraphFetched("[role refresh_token]");
};

export const getUserWithResetToken = (token) => {
  return User.query()
    .where("reset_token", token)
    .where("reset_token_expiry", ">", Date.now())
    .andWhere("valid", true)
    .limit(1)
    .withGraphFetched("[role refresh_token]");
};

export const resetUserPasswordInstance = (user, password) => {
  user.setPassword(password);
  user.reset_token = null;
  user.reset_token_expiry = null;
  return user.$query().patch();
};

export const verifyUserInstance = (user) => {
  user.verify();
  return user.$query().patch();
};

export const resetUserInstance = (user) => {
  user.reset();
  return user.$query().patch();
};

export const clearResetUserInstance = (user) => {
  user.reset_token = null;
  user.reset_token_expiry = null;
  return user.$query().patch();
};

export const deleteUserInstance = (user) => {
  return user.$query().delete();
};

export const getRefreshTokenWithToken = (token) => {
  return RefreshToken.query()
    .where("refresh_token", token)
    .limit(1)
    .withGraphFetched("user");
};

export const createRefreshTokenforUser = (user_id) => {
  return RefreshToken.query().insert({
    user_id,
    refresh_token: randomToken(),
    expires: new Date(Date.now() + 7 * DAY),
  });
};

export const deleteRefreshTokenInstance = (refresh_token) => {
  return refresh_token.$query().delete();
};
