import { Failure } from '#lib/responseHelpers';

const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;

export const validateRegister = ({ name, email, password }) => {
  let data = {};
  if (typeof name !== 'string' || !name) {
    throw new Failure('Invalid name given', 400, 'USER_INPUT');
  }
  data.name = name;
  if (typeof email !== 'string' || !email) {
    throw new Failure('Invalid email given', 400, 'USER_INPUT');
  }
  data.email = email.toLowerCase();
  if (typeof password !== 'string' || !password) {
    throw new Failure('Invalid password given', 400, 'USER_INPUT');
  }
  const searchIndex = password.search(PASSWORD_RE);
  // # Throw error if search index is anything other than 0
  if (searchIndex)
    throw new Failure(
      'Password must have a minimum length of 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character(@$!%*?&)',
      400,
      'USER_INPUT'
    );
  data.password = password;
  return data;
};

export const validateLogin = ({ email, password }) => {
  let data = {};
  if (typeof email !== 'string' || !email) {
    throw new Failure('Invalid email given', 400, 'USER_INPUT');
  }
  data.email = email.toLowerCase();
  if (typeof password !== 'string' || !password) {
    throw new Failure('Invalid password given', 400, 'USER_INPUT');
  }
  data.password = password;
  return data;
};

export const validateVerify = ({ token }) => {
  let data = {};
  if (typeof token !== 'string' || !token) {
    throw new Failure('Invalid verification token given', 400, 'USER_INPUT');
  }
  data.token = token;
  return data;
};

export const validateRefreshToken = ({ refToken }) => {
  let data = {};
  if (typeof refToken !== 'string' || !refToken) {
    throw new Failure('Invalid refresh token given', 400, 'USER_INPUT');
  }
  data.refToken = refToken;
  return data;
};

export const validateForgotPassword = ({ email }) => {
  let data = {};
  if (typeof email !== 'string' || !email) {
    throw new Failure('Invalid email given', 400, 'USER_INPUT');
  }
  data.email = email.toLowerCase();
  return data;
};

export const validateValidateResetToken = ({ token }) => {
  let data = {};
  if (typeof token !== 'string' || !token) {
    throw new Failure('Invalid reset token given', 400, 'USER_INPUT');
  }
  data.token = token;
  return data;
};

export const validateRestPassword = ({ token, password }) => {
  let data = {};
  if (typeof token !== 'string' || !token) {
    throw new Failure('Invalid reset token given', 400, 'USER_INPUT');
  }
  data.token = token;
  if (typeof password !== 'string' || !password) {
    throw new Failure('Invalid password given', 400, 'USER_INPUT');
  }
  // # Throw error if search index is anything other than 0
  const searchIndex = password.search(PASSWORD_RE);
  if (searchIndex)
    throw new Failure(
      'Password must have a minimum length of 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character'
    );
  data.password = password;
  return data;
};
