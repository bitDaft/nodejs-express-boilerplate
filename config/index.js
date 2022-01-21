import fs from 'fs';
import path from 'path';
import process from 'process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { __dirname } from '#lib/getFileDir';
import jsonLoader from '#lib/jsonLoader';

// TODO: this needs to be replaced once node supports json imports natively
const config = await jsonLoader(path.join(__dirname(import.meta), 'config.json'));

const envPre = config.ENV_PREFIX ?? '';

// # Custom parsing of values to correct types from string and validation checks
// ^ Add or change env key validation here based on requirement
const validateAndGetParsedValue = (new_key) => {
  const key = `${envPre}${new_key}`;
  const value = process.env[key];
  switch (new_key) {
    case 'PROXY':
    case 'DB_debug':
      return value === 'true';
    case 'DB_pool_max':
    case 'DB_pool_min':
    case 'DB_port':
    case 'PORT':
    case 'SMTP_port':
      if (isNaN(+value)) throw Error(`Invalid value provided for env variable ${key}`);
      return +value;
    default:
      return value;
  }
};

const mergeConfigs = async () => {
  const dotOpt = {
    path: path.join(__dirname(import.meta), '../environment', config.ENV_filename ?? '.env'),
    debug: true,
  };

  if (!fs.existsSync(dotOpt.path)) {
    throw Error(`Env file '${dotOpt.path}' does not exist. Please create it!`);
  }

  let dotenv = await import('dotenv');
  dotenv.config(dotOpt);

  for (const key in process.env) {
    if (!key.startsWith(envPre)) continue;
    if (!process.env[key]) throw Error(`Environment variable ${key} not set`);
    const new_key = key.split(envPre)[1];
    config[new_key] = validateAndGetParsedValue(new_key);
  }
};

const init = async () => {
  // # Combines cli args into config for uniform access
  const parsedArgs = yargs(hideBin(process.argv)).argv;
  for (let key in parsedArgs) config[key] = parsedArgs[key];

  // # Combines process.env into config for uniform access
  if (process.env.NODE_ENV !== 'production') await mergeConfigs();

  return config;
};

export default await init();
