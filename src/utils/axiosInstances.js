import axios from "axios";

import config from "#config";

export let auth_http = axios.create({
  baseURL: config.auth_url,
  method: "POST",
});

auth_http.interceptors.response.use(
  (response) => {
    if (response.data.error) {
      throw new Error("Auth token could not be obtained");
    }
    return response;
  },
  (err) => Promise.reject(err)
);

export let token_http = axios.create({
  baseURL: config.token_url,
});
