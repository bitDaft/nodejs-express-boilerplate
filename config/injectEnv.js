import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import { __dirname } from '../lib/getFileDir.js';

export const injectEnv = (config) => {
  let filename = null;
  if (config.ENV_FILENAME) filename = config.ENV_FILENAME;

  const dotOpt = {
    path: path.join(__dirname(import.meta), 'environment', filename || '.env'),
    debug: true,
  };

  if (!fs.existsSync(dotOpt.path)) {
    throw Error(`Env file '${dotOpt.path}' does not exist. Please change or create it!`);
  }
  let output = dotenv.config(dotOpt).parsed;
  for (let key in output) {
    if (output[key] === undefined) {
      throw Error(`Key ${key} has no value set`);
    }
  }
};
