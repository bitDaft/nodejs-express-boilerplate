import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const __dirname = ({ url }) => {
  const __filename = fileURLToPath(url);
  return dirname(__filename);
};

export const __filename = ({ url }) => {
  return fileURLToPath(url);
};
