import { readFile } from 'fs/promises';
import { readFileSync } from 'fs';
import path from 'path';

export const jsonLoader = async (filename) => JSON.parse(await readFile(path.resolve(filename)));
export const jsonLoaderSync = (filename) => JSON.parse(readFileSync(path.resolve(filename)));

export default await { jsonLoader, jsonLoaderSync };
