import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import { __dirname } from '../lib/getFileDir.js';

export const injectEnv = (filename) => {
  const dotOpt = {
    path: path.join(__dirname(import.meta), 'environment', filename),
    debug: true,
  };

  if (!fs.existsSync(dotOpt.path)) {
    throw Error(`Env file '${dotOpt.path}' does not exist. Please change or create it!`);
  }

  let output = dotenv.config(dotOpt).parsed;
  for (const key in output) {
    if (output[key] === undefined || output[key] === '') {
      throw Error(`Key ${key} has no value set`);
    }
  }
};
