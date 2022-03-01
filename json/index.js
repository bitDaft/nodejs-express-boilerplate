import fs from 'fs';
import path from 'path';

import { __dirname } from '#lib/getFileDir';
import { jsonLoader } from '#lib/jsonLoader';

const jsonFiles = {};

const loadFiles = async () => {
  const dirname = __dirname(import.meta);
  const files = fs.readdirSync(dirname).filter((file) => file.endsWith('.json'));
  for (const filename of files) {
    const jsonData = await jsonLoader(path.join(dirname, filename));
    const name = path.basename(filename).split('.json')[0];
    jsonFiles[name] = jsonData;
  }
  console.info('Completed loading of all JSON files');
};

await loadFiles();

export default jsonFiles;
