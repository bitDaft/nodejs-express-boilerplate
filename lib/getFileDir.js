import { fileURLToPath } from 'url';
import path from 'path';

export const __dirname = ({ url }) => path.dirname(fileURLToPath(url));
export const __filename = ({ url }) => path.basename(fileURLToPath(url));
