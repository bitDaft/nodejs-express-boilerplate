import fs from 'fs';
import path from 'path';
import process from 'process';

import { default as configFile } from './config.json';

const envPrefix = `${configFile.ENV_PREFIX}_`;

let config = { ...configFile };

// # Custom parsing of values to correct types from string and validation checks
// ^ Add or change env key validation here based on requirement
const validateAndGetParsedValue = (new_key) => {
  const key = `${envPrefix}${new_key}`;
  const value = process.env[key];
  switch (new_key) {
    case 'DB_debug':
      return value === 'true';
    case 'DB_pool_max':
    case 'DB_pool_min':
    case 'DB_port':
    case 'PORT':
    case 'SMTP_port':
      if (isNaN(+value))
        throw Error(`Invalid value provided for env variable ${key}`);
      return +value;
    default:
      return value;
  }
};

console.log(import.meta);
console.log(path.join(process.cwd(), config.ENV_file_path));

const initConfig = async () => {
  if (process.env.NODE_ENV !== 'production') {
    const dotenv_options = {
      // ^ This may be switched to any other file as needed
      path: path.join(process.cwd(), config.ENV_file_path),
      debug: true,
    };

    if (!fs.existsSync(dotenv_options.path)) {
      console.error(
        `Env file at path '${dotenv_options.path}' does not exist. Please create it before proceeding!`
      );
      throw Error(
        `Env file at path '${dotenv_options.path}' does not exist. Please create it before proceeding!`
      );
    }

    await import('dotenv').then((dotenv) => {
      dotenv.config(dotenv_options);

      // # Combines the info from process.env into config for uniform access
      for (const key in process.env) {
        if (key.startsWith(envPrefix)) {
          if (!process.env[key]) {
            console.error(`Environment variable ${key} not set`);
            throw Error(`Environment variable ${key} not set`);
          }
          const new_key = key.split(envPrefix)[1];
          config[new_key] = validateAndGetParsedValue(new_key);
        }
      }
    });
  }
  return config;
};

export default await initConfig();
