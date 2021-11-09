import { default as config } from "./config.json";

let new_config = { ...config };

// #Custom parsing of values to correct types from string and validation checks
const validateAndParse = (new_key, key) => {
  switch (new_key) {
    case "DB_debug":
      new_config[new_key] = process.env[key] === "true";
      break;
    case "DB_pool_max":
    case "DB_pool_min":
    case "DB_port":
    case "PORT":
    case "SMTP_port":
      if (isNaN(+process.env[key])) {
        throw Error(`Invalid value provided for env variable ${key}`);
      }
      new_config[new_key] = +process.env[key];
      break;
    default:
      new_config[new_key] = process.env[key];
  }
};

for (let key in process.env) {
  if (key.startsWith(`${config.ENV_PREFIX}_`)) {
    if (!process.env[key]) {
      throw Error(`Environment variable ${key} not set`);
    } else {
      let new_key = key.split(`${config.ENV_PREFIX}_`)[1];
      validateAndParse(new_key, key);
    }
  }
}

export default new_config;
