import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import { __dirname } from '../lib/getFileDir.js';

export const injectEnv = (config) => {
  const dotOpt = {
    path: path.join(__dirname(import.meta), '../environment', config.ENV_filename || '.env'),
    debug: true,
  };

  if (!fs.existsSync(dotOpt.path)) {
    throw Error(`Env file '${dotOpt.path}' does not exist. Please create it!`);
  }
  dotenv.config(dotOpt);
};
