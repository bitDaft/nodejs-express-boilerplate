import { User } from "#models";

export const getUserById = (id) => {
  return User.query()
    .where({
      id,
    })
    .withGraphFetched("[role refresh_token]");
};
