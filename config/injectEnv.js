import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import { __dirname } from '#lib/getFileDir';

export const injectEnv = (filename) => {
  const dotOpt = {
    path: path.join(__dirname(import.meta), 'environment', filename),
    debug: true,
  };

  if (!fs.existsSync(dotOpt.path))
    throw Error(`Env file '${dotOpt.path}' does not exist. Please change or create it!`);

  return dotenv.config(dotOpt).parsed;
};
