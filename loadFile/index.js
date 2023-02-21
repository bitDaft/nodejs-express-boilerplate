import fs from 'fs';
import path from 'path';

import { __dirname } from '#lib/getFileDir';
import { fileLoader, jsonLoader } from '#lib/fileLoader';
import log from '#logger';

const files = {};

const loadFiles = async () => {
  const dirname = __dirname(import.meta);
  const files = fs
    .readdirSync(path.resolve(dirname))
    .filter((file) => file !== 'index.js' && file !== 'readme.md');
  for (const filename of files) {
    let loaderFn = fileLoader;
    if (filename.endsWith('.json')) loaderFn = jsonLoader;
    const fileData = await loaderFn(path.join(dirname, filename));
    const baseName = path.basename(filename);
    const name = baseName.split(path.extname(baseName))[0];
    files[name] = fileData;
  }
  log.info('Completed loading of files');
};

await loadFiles();

export default files;
