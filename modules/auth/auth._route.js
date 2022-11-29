import express from 'express';

import { authorize } from '#middlewares';

import {
  registerNewUser,
  verifyUser,
  loginExistingUser,
  refreshToken,
  requestPasswordChange,
  validateResetToken,
  resetUserPassword,
  revokeToken,
} from '#controller/auth';

const router = express.Router();

const loginExistingUserHandler = async (req) => {
  const { email, password } = req.body;
  return await loginExistingUser(email, password);
};

const registerNewUserHandler = async (req) => {
  const { name, email, password } = req.body;
  await registerNewUser(name, email, password);
  return 'User has been registered. Please check your email to verify';
};

const verifyUserHandler = async (req) => {
  const verificationToken = req.query.token;
  await verifyUser(verificationToken);
  return 'You have been verified successfully';
};

const refreshTokenHandler = async (req) => {
  const _refreshToken = req.query.token;
  return await refreshToken(_refreshToken);
};

const revokeTokenHandler = async (req) => {
  const token = req.query.token;
  const userId = req.user.id;
  const refreshTokens = req.refreshTokens;
  await revokeToken(token, refreshTokens, userId);
  return "User's token has been revoked";
};

const requestPasswordChangeHandler = async (req) => {
  const { email } = req.body;
  await requestPasswordChange(email);
  return 'Please check your email to reset password';
};

const validateResetTokenHandler = async (req) => {
  const token = req.query.token;
  await validateResetToken(token);
  return "User's token is valid";
};

const resetUserPasswordHandler = async (req) => {
  const token = req.query.token;
  const { password } = req.body;
  await resetUserPassword(token, password);
  return "User's password has been reset";
};

router.post('/login', loginExistingUserHandler);
router.post('/register', registerNewUserHandler);
router.get('/verify', verifyUserHandler);

router.get('/refresh-token', refreshTokenHandler);
router.get('/revoke-token', authorize(), revokeTokenHandler);

router.post('/forgot-password', requestPasswordChangeHandler);
router.get('/validate-reset-token', validateResetTokenHandler);
router.post('/reset-password', resetUserPasswordHandler);

export default router;
