import express from 'express';

import {
  registerUser,
  verifyUser,
  loginUser,
  refreshToken,
  forgotPassword,
  validateResetToken,
  resetPassword,
  revokeToken,
} from '#controllers/auth';
import { Failure, Success } from '#lib/responseHelpers';
const router = express.Router();

const verify = async (req, res) => {
  const verification_token = req.query.token;
  let response_data = await verifyUser(verification_token);
  if (response_data.valid) {
    return new Success('You have been verified successfully');
  } else {
    throw new Failure('User could not be verified', 500, 'UNKNOWN_ERROR');
  }
};

const refreshTokens = async (req, res) => {
  const refresh_token = req.query.token;
  let response_data = await refreshToken(refresh_token);
  if (response_data) {
    return new Success(response_data);
  } else {
    throw new Failure('User token could not be refreshed', 500, 'UNKNOWN_ERROR');
  }
};

const revokeTokens = async (req, res) => {
  const token = req.query.token;
  let response_data = await revokeToken(token);
  if (response_data) {
    return new Success("User's token has been revoked");
  } else {
    throw new Failure('User token could not be revoked', 500, 'UNKNOWN_ERROR');
  }
};

const validateTheResetToken = async (req, res) => {
  const token = req.query.token;
  let response_data = await validateResetToken(token);
  if (response_data) {
    return new Success("User's token is valid");
  } else {
    throw new Failure('User token could not be validated', 500, 'UNKNOWN_ERROR');
  }
};

const registerNewUser = async (req, res) => {
  const { name, email, password } = req.body;
  let response_data = await registerUser(name, email, password);
  if (response_data) {
    return new Success('User has been registered. Please check your email to verify.');
  } else {
    throw new Failure(
      'User could not be registered. Please contact support.',
      500,
      'UNKNOWN_ERROR'
    );
  }
};

const loginExistingUser = async (req, res) => {
  const { email, password } = req.body;
  let response_data = await loginUser(email, password);
  return new Success(response_data);
};

const requestPasswordChange = async (req, res) => {
  const { email } = req.body;
  let response_data = await forgotPassword(email);
  if (response_data) {
    return new Success('Please check your email to reset password');
  } else {
    throw new Failure('Password could not be reset. Please contact support.', 500, 'UNKNOWN_ERROR');
  }
};

const resetUserPassword = async (req, res) => {
  const token = req.query.token;
  const { password } = req.body;
  let response_data = await resetPassword(token, password);
  if (response_data) {
    return new Success("User's password has been reset");
  } else {
    throw new Failure(
      'User password could not be reset. Please contact support',
      500,
      'UNKNOWN_ERROR'
    );
  }
};

router.post('/login', loginExistingUser);
router.post('/register', registerNewUser);
router.get('/verify', verify);

router.get('/refresh-token', refreshTokens);
router.get('/revoke-token', revokeTokens);

router.post('/forgot-password', requestPasswordChange);
router.get('/validate-reset-token', validateTheResetToken);
router.post('/reset-password', resetUserPassword);

export default router;
