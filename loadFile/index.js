import fs from 'fs';
import path from 'path';

import { __dirname } from '#lib/getFileDir';
import { fileLoader, jsonLoader } from '#lib/fileLoader';
import log from '#lib/logger';

const files = {};

const loadFiles = async () => {
  const dirname = __dirname(import.meta);
  const files = fs
    .readdirSync(path.resolve(dirname))
    .filter((file) => file !== 'index.js' && file !== 'readme.md');
  for (const filename of files) {
    let fileData = null;
    if (filename.endsWith('.json')) {
      fileData = await jsonLoader(path.join(dirname, filename));
    } else {
      fileData = await fileLoader(path.join(dirname, filename));
    }
    const baseName = path.basename(filename);
    const baseNameExt = path.extname(baseName);
    const name = baseName.split(baseNameExt)[0];
    files[name] = fileData;
  }
  log.info('Completed loading of files');
};

await loadFiles();

export default files;
