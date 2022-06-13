import { User } from '#models';

export const getUserById = (id) => {
  return User.query()
    .where({
      id,
    })
    .limit(1)
    .withGraphFetched('[role refresh_tokens]');
};
