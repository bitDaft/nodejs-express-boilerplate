import axios from 'axios';

import config from '#config';

export const tokenHttp = axios.create({
  baseURL: config.token_url,
});
