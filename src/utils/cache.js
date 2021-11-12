import NodeCache from "node-cache";
import { MINUTE, SECOND } from "#utils/timeConstants";

// #Used when defining the cache keys and time
export const BASIC_KEY = (token) => `${token}_basic`;

const opt = {
  stdTTL: (5 * MINUTE) / 1000,
  checkperiod: (30 * SECOND) / 1000,
};

export const basic_cache = new NodeCache({
  ...opt,
  stdTTL: (30 * MINUTE) / 1000,
});
