import { RefreshToken, User } from '#models';

export const getUserById = (id) => {
  return User.query().where({ id }).limit(1).withGraphFetched('[role]');
};

export const getUserRootRefreshTokenById = (id) => {
  return RefreshToken.query().where({ user_id: id, parent_id: null });
};
