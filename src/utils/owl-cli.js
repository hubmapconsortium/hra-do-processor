import { existsSync, readFileSync } from 'fs';
import { throwOnError } from './sh-exec.js';

export function mergeTurtles(outputPath, prefixesPath, inputPaths, defaultPrefix = undefined) {
  let prefixMap = {};
  if (prefixesPath && existsSync(prefixesPath)) {
    prefixMap = JSON.parse(readFileSync(prefixesPath));
  }
  if (defaultPrefix) {
    prefixMap['='] = defaultPrefix;
  }
  const prefixesString = Object.entries(prefixMap)
    .map(([key, value]) => `-p${key}=${value}`)
    .join(' ');

  const blankNode = `_:${outputPath.split('/').slice(-5, -3).join('_')}_0`;
  throwOnError(
    `cat ${inputPaths.join(' ')} | owl-cli write --anonymousNodeIdPattern ${blankNode} -i turtle -o ntriple - - > ${outputPath}.nt`,
    `failed to merge ${outputPath}`
  );
  throwOnError(
    `owl-cli write --anonymousNodeIdPattern ${blankNode} --writeRdfType ${prefixesString} ${outputPath}.nt ${outputPath} && rm -f ${outputPath}.nt`,
    `failed to prettify ${outputPath}`
  );
}
