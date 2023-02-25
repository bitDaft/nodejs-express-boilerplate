import config from '#config';
import { MINUTE } from '#utils/timeConstants';

// # Helpers
export const basicUser = (user) => {
  const { email, name, role_id, role, additional_information } = user;
  return { name, email };
};

export const getJWTExpiresTime = () =>
  new Date(Date.now() + config.accessTokenDuration * MINUTE).getTime();
