import { __dirname } from '#lib/getFileDir';
import jsonLoader from '#lib/jsonLoader';
import fs from 'fs';
import path from 'path';

const jsonFiles = {};

fs.readdirSync(__dirname(import.meta))
  .filter((file) => file.endsWith('.json'))
  .forEach(async (file) => {
    const jsonData = await jsonLoader(file);
    const filename = path.basename(file).split(".json")[0];
    jsonFiles[filename] = jsonData;
  });

export const jsonFiles;