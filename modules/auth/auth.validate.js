import { Failure } from '#lib/responseHelpers';

export const validateRegister = ({ name, email, password }) => {
  let data = {};
  if (typeof name !== 'string' || !name) {
    throw new Failure('Invalid name given');
  }
  data.name = name;
  if (typeof email !== 'string' || !email) {
    throw new Failure('Invalid email given');
  }
  data.email = email.toLowerCase();
  if (typeof password !== 'string' || !password) {
    throw new Failure('Invalid password given');
  }
  data.password = password;
  return data;
};

export const validateLogin = ({ email, password }) => {
  let data = {};
  if (typeof email !== 'string' || !email) {
    throw new Failure('Invalid email given');
  }
  data.email = email.toLowerCase();
  if (typeof password !== 'string' || !password) {
    throw new Failure('Invalid password given');
  }
  data.password = password;
  return data;
};

export const validateVerify = ({ token }) => {
  let data = {};
  if (typeof token !== 'string' || !token) {
    throw new Failure('Invalid verification token given');
  }
  data.token = token;
  return data;
};

export const validateRefreshToken = ({ refToken }) => {
  let data = {};
  if (typeof refToken !== 'string' || !refToken) {
    throw new Failure('Invalid refresh token given');
  }
  data.refToken = refToken;
  return data;
};

export const validateForgotPassword = ({ email }) => {
  let data = {};
  if (typeof email !== 'string' || !email) {
    throw new Failure('Invalid email given');
  }
  data.email = email.toLowerCase();
  return data;
};

export const validateValidateResetToken = ({ token }) => {
  let data = {};
  if (typeof token !== 'string' || !token) {
    throw new Failure('Invalid reset token given');
  }
  data.token = token;
  return data;
};

export const validateRestPassword = ({ token, password }) => {
  let data = {};
  if (typeof token !== 'string' || !token) {
    throw new Failure('Invalid reset token given');
  }
  data.token = token;
  if (typeof password !== 'string' || !password) {
    throw new Failure('Invalid password given');
  }
  data.password = password;
  return data;
};
