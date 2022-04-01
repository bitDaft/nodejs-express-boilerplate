import { User } from '#models';

export const getUserById = (id) => {
  return User.query()
    .where({
      id,
    })
    .whereNotDeleted()
    .limit(1)
    .withGraphFetched('[role refresh_tokens]');
};
