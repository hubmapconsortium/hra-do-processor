import { existsSync, readFileSync } from 'fs';
import { throwOnError } from './sh-exec.js';

export function mergeTurtles(outputPath, prefixesPath, inputPaths) {
  let prefixMap = {};
  if (prefixesPath && existsSync(prefixesPath)) {
    prefixMap = JSON.parse(readFileSync(prefixesPath));
  }
  const prefixesString = Object.entries(prefixMap)
    .map(([key, value]) => `-p${key}=${value}`)
    .join(' ');

  throwOnError(
    `cat ${inputPaths.join(' ')} | owl-cli write -i turtle -o ntriple - - > ${outputPath}.nt`,
    `failed to merge ${outputPath}`
  );
  throwOnError(
    `owl-cli write --writeRdfType ${prefixesString} ${outputPath}.nt ${outputPath} && rm -f ${outputPath}.nt`,
    `failed to prettify ${outputPath}`
  );
}
