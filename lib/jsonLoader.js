import { readFile } from 'fs/promises';
import path from 'path';

export const jsonl = async (filename) => {
  let data = await readFile(path.resolve(`${filename}`));
  return JSON.parse(data);
};
