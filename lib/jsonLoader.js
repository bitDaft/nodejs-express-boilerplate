import { readFile } from 'fs/promises';
import { readFileSync } from 'fs';
import path from 'path';

export const jsonLoader = async (filepath) => JSON.parse(await readFile(path.resolve(filepath)));
export const jsonLoaderSync = (filepath) => JSON.parse(readFileSync(path.resolve(filepath)));

export default { jsonLoader, jsonLoaderSync };
