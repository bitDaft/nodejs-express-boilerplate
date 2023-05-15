import { userCache, USER_PARENT_REFRESH_KEY } from '#cache';

export const deleteCacheUserParentTokens = (id) => {
  userCache.del(id);
  return userCache.del(USER_PARENT_REFRESH_KEY(id));
};
