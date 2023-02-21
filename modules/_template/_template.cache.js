import { basicCache } from '#cache';

export const getById = (id) => {
  return basicCache.get(id);
};
