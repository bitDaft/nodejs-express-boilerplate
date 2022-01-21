import { readFile } from 'fs/promises';
import path from 'path';

const jsonLoader = async (filename) => JSON.parse(await readFile(path.resolve(filename)));

export default await jsonLoader;
