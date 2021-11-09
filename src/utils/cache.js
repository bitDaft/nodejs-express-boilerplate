import NodeCache from "node-cache";

const opt = {
  stdTTL: 300,
  checkperiod: 300,
};

// #Used when defining the cache keys and time
export const BASIC_KEY = (token) => `${token}_basic`;
export const BASIC_KEY_TIMEOUT = 60 * 60 * 24 * 7; // in seconds, = 1 week

export const basic_cache = new NodeCache(opt);
