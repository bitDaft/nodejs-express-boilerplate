import axios from "axios";

import config from "#config";

export let token_http = axios.create({
  baseURL: config.token_url,
});
