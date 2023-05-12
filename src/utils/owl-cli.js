import { existsSync, readFileSync } from 'fs';
import { throwOnError } from './sh-exec.js';

export function mergeTurtles(outputPath, prefixesPath, inputPaths) {
  let prefixMap = {};
  if (prefixesPath && existsSync(prefixesPath)) {
    prefixMap = JSON.parse(readFileSync(prefixesPath));
  }
  const prefixesString =
    '-prdf -prdfs -powl -pxsd -pdcterms' +
    Object.entries(prefixMap)
      .map(([key, value]) => `-p${key}=${value}`)
      .join(' ');

  throwOnError(
    `cat ${inputPaths.join(' ')} | owl-cli write ${prefixesString} -i turtle - ${outputPath}`,
    `failed to merge and prettify ${outputPath} using ${inputPaths.join(' ')}`
  );
}
