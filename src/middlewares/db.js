import { User } from '#models';

export const getUserById = (id) => {
  return User.query()
    .where({
      id,
      is_deleted: false,
    })
    .withGraphFetched('[role refresh_tokens]');
};
