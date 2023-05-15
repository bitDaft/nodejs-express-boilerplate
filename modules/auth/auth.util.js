import config from '#config';
import { MINUTE } from '#utils/timeConstants';

// # Helpers
export const basicUser = (user) => {
  const { id, email, name, role_id, role, additional_information } = user;
  return { id, name, email, role: role.name };
};

export const getJWTExpiresTime = () =>
  new Date(Date.now() + config.accessTokenDuration * MINUTE).getTime();
