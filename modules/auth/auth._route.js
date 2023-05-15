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
import { DAY } from '#utils/timeConstants';
import config from '#config';

const router = express.Router();

const loginExistingUserHandler = async (req, res) => {
  const { email, password } = req.body;
  const userData = await loginExistingUser(email, password);
  res.cookie(config.refreshCookieName, userData.refreshToken, {
    expires: new Date(Date.now() + config.refreshTokenDuration * DAY),
    ...config.refreshCookieOption,
    sameSite: config.isDev ? 'None' : 'Lax',
  });
  return userData;
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

const refreshTokenHandler = async (req, res) => {
  const _refreshToken = req.cookies[config.refreshCookieName];
  const refreshData = await refreshToken(_refreshToken);
  res.cookie(config.refreshCookieName, refreshData.refreshToken, {
    expires: new Date(Date.now() + config.refreshTokenDuration * DAY),
    ...config.refreshCookieOption,
    sameSite: config.isDev ? 'None' : 'Lax',
  });
  return refreshData;
};

const revokeTokenHandler = async (req, res) => {
  const token = req.query.token;
  const userId = req.user.id;
  await revokeToken(token, userId);
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

router.post(`/login`, loginExistingUserHandler);
router.post(`/register`, registerNewUserHandler);
router.get(`/verify`, verifyUserHandler);

router.get(`/refresh-token`, refreshTokenHandler);
router.get(`/revoke-token`, authorize(), revokeTokenHandler);

router.post(`/forgot-password`, requestPasswordChangeHandler);
router.get(`/validate-reset-token`, validateResetTokenHandler);
router.post(`/reset-password`, resetUserPasswordHandler);

export default router;
