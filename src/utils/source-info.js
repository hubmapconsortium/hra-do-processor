import { dirname } from 'path';
import { fileURLToPath } from 'url';

export function getFileName(import_meta_url) {
  return fileURLToPath(import_meta_url);
}

export function getDirName(import_meta_url) {
  return dirname(fileURLToPath(import_meta_url));
}
