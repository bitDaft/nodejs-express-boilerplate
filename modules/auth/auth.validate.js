import { Failure } from '#lib/responseHelpers';

export const validateRegister = ({ name, email, password }, cb = (key, value) => {}) => {
  if (typeof name !== 'string' || !name) {
    throw new Failure('Invalid name given');
  }
  cb('name', name);
  if (typeof email !== 'string' || !email) {
    throw new Failure('Invalid email given');
  }
  cb('email', email);
  if (typeof password !== 'string' || !password) {
    throw new Failure('Invalid password given');
  }
  cb('password', password);
};

export const validateLogin = ({ email, password }, cb = (key, value) => {}) => {
  if (typeof email !== 'string' || !email) {
    throw new Failure('Invalid email given');
  }
  cb('email', email);
  if (typeof password !== 'string' || !password) {
    throw new Failure('Invalid password given');
  }
  cb('password', password);
};

export const validateVerify = ({ token }, cb = (key, value) => {}) => {
  if (typeof token !== 'string' || !token) {
    throw new Failure('Invalid verification token given');
  }
  cb('token', token);
};

export const validateRefreshToken = ({ refToken }, cb = (key, value) => {}) => {
  if (typeof refToken !== 'string' || !refToken) {
    throw new Failure('Invalid refresh token given');
  }
  cb('refToken', refToken);
};

export const validateForgotPassword = ({ email }, cb = (key, value) => {}) => {
  if (typeof email !== 'string' || !email) {
    throw new Failure('Invalid email given');
  }
  cb('email', email);
};

export const validateValidateResetToken = ({ token }, cb = (key, value) => {}) => {
  if (typeof token !== 'string' || !token) {
    throw new Failure('Invalid reset token given');
  }
  cb('token', token);
};

export const validateRestPassword = ({ token, password }, cb = (key, value) => {}) => {
  if (typeof token !== 'string' || !token) {
    throw new Failure('Invalid reset token given');
  }
  cb('token', token);
  if (typeof password !== 'string' || !password) {
    throw new Failure('Invalid password given');
  }
  cb('password', password);
};
