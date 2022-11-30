import { Failure } from '#lib/responseHelpers';

const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;

export const validateRegister = ({ name, email, password }) => {
  let data = {};
  if (typeof name !== 'string' || !name.trim()) {
    throw new Failure('Invalid name given', 'USER_INPUT');
  }
  data.name = name.trim();
  if (typeof email !== 'string' || !email.trim()) {
    throw new Failure('Invalid email given', 'USER_INPUT');
  }
  data.email = email.trim().toLowerCase();
  if (typeof password !== 'string' || !password) {
    throw new Failure('Invalid password given', 'USER_INPUT');
  }
  const searchIndex = password.search(PASSWORD_RE);
  // # Throw error if search index is anything other than 0
  if (searchIndex)
    throw new Failure(
      'Password must have a minimum length of 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character(@$!%*?&)',
      'USER_INPUT'
    );
  data.password = password;
  return data;
};

export const validateLogin = ({ email, password }) => {
  let data = {};
  if (typeof email !== 'string' || !email.trim()) {
    throw new Failure('Invalid email given', 'USER_INPUT');
  }
  data.email = email.trim().toLowerCase();
  if (typeof password !== 'string' || !password) {
    throw new Failure('Invalid password given', 'USER_INPUT');
  }
  data.password = password;
  return data;
};

export const validateVerify = ({ token }) => {
  let data = {};
  if (typeof token !== 'string' || !token.trim()) {
    throw new Failure('Invalid verification token given', 'USER_INPUT');
  }
  data.token = token.trim();
  return data;
};

export const validateRefreshToken = ({ refToken }) => {
  let data = {};
  if (typeof refToken !== 'string' || !refToken.trim()) {
    throw new Failure('Invalid refresh token given', 'USER_INPUT');
  }
  data.refToken = refToken.trim();
  return data;
};

export const validateForgotPassword = ({ email }) => {
  let data = {};
  if (typeof email !== 'string' || !email.trim()) {
    throw new Failure('Invalid email given', 'USER_INPUT');
  }
  data.email = email.trim().toLowerCase();
  return data;
};

export const validateValidateResetToken = ({ token }) => {
  let data = {};
  if (typeof token !== 'string' || !token.trim()) {
    throw new Failure('Invalid reset token given', 'USER_INPUT');
  }
  data.token = token.trim();
  return data;
};

export const validateResetPassword = ({ token, password }) => {
  let data = {};
  if (typeof token !== 'string' || !token.trim()) {
    throw new Failure('Invalid reset token given', 'USER_INPUT');
  }
  data.token = token.trim();
  if (typeof password !== 'string' || !password) {
    throw new Failure('Invalid password given', 'USER_INPUT');
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
