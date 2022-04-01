import { readFile } from 'fs/promises';
import { readFileSync } from 'fs';
import path from 'path';

export const jsonLoader = async (filepath) => JSON.parse(await fileLoader(filepath));
export const jsonLoaderSync = (filepath) => JSON.parse(fileLoaderSync(path.resolve(filepath)));
export const fileLoader = async (filepath) => await readFile(path.resolve(filepath));
export const fileLoaderSync = (filepath) => readFileSync(path.resolve(filepath));

export default { jsonLoader, jsonLoaderSync };
