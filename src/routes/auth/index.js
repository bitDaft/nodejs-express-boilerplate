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
import { authorize } from '#middlewares';

const router = express.Router();

const loginExistingUser = async (req) => {
  const { email, password } = req.body;
  return await loginUser(email, password);
};

const registerNewUser = async (req) => {
  const { name, email, password } = req.body;
  await registerUser(name, email, password);
  return 'User has been registered. Please check your email to verify';
};

const verify = async (req) => {
  const verification_token = req.query.token;
  await verifyUser(verification_token);
  return 'You have been verified successfully';
};

const refreshTokens = async (req) => {
  const refresh_token = req.query.token;
  return await refreshToken(refresh_token);
};

const revokeTokens = async (req) => {
  const token = req.query.token;
  const refreshTokens = req.refresh_tokens;
  await revokeToken(token, refreshTokens);
  return "User's token has been revoked";
};

const requestPasswordChange = async (req) => {
  const { email } = req.body;
  await forgotPassword(email);
  return 'Please check your email to reset password';
};

const validateTheResetToken = async (req) => {
  const token = req.query.token;
  await validateResetToken(token);
  return "User's token is valid";
};

const resetUserPassword = async (req) => {
  const token = req.query.token;
  const { password } = req.body;
  await resetPassword(token, password);
  return "User's password has been reset";
};

router.post('/login', loginExistingUser);
router.post('/register', registerNewUser);
router.get('/verify', verify);

router.get('/refresh-token', refreshTokens);
router.get('/revoke-token', authorize(), revokeTokens);

router.post('/forgot-password', requestPasswordChange);
router.get('/validate-reset-token', validateTheResetToken);
router.post('/reset-password', resetUserPassword);

export default router;
