import NodeCache from 'node-cache';
import { MINUTE, SECOND } from '#utils/timeConstants';

const opt = { stdTTL: (5 * MINUTE) / 1000, checkperiod: (30 * SECOND) / 1000 };

// # Used when defining the cache keys and time
export const BASIC_KEY = (token) => `${token}_basic`;
export const USER_PARENT_REFRESH_KEY = (token) => `${token}_user_parent_refresh_token`;

// ;------------------------------------
// ;------------------------------------

export const basicCache = new NodeCache({ ...opt, stdTTL: (30 * MINUTE) / 1000 });

export const userCache = new NodeCache({ ...opt, stdTTL: (30 * MINUTE) / 1000 });
