import { userCache, USER_PARENT_REFRESH_KEY } from '#utils/cache';

export const getCacheUserParentTokens = (id) => {
  return userCache.get(USER_PARENT_REFRESH_KEY(id));
};

export const setCacheUserParentTokens = (id, tokens) => {
  return userCache.set(USER_PARENT_REFRESH_KEY(id), tokens);
};

export const getCacheUser = (id) => {
  return userCache.get(id);
};

export const setCacheUser = (id, user) => {
  return userCache.set(id, user);
};
