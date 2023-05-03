import { resolve } from 'path';
import { throwOnError } from './sh-exec.js';
import { more } from './logging.js';

export function collectEntities(context, ontology, graphData) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const query = resolve(processorHome, `src/utils/get-${ontology}-terms.sparql`);
  const output = resolve(obj.path, `enriched/${ontology}-terms.csv`);

  throwOnError(
    `robot query -i ${graphData} --query ${query} ${output} && \
     sed -i '1d' ${output}`,
    'Collect entities failed. See errors above.'
  );

  return output;
}

export function extractClassHierarchy(context, ontology, upperTerm, lowerTerms) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const inputOntology = resolve(processorHome, `mirrors/${ontology}.ttl`);
  const output = resolve(obj.path, `enriched/${ontology}-extract.ttl`);

  more(`Extracting class hierarchy from: ${inputOntology}`);
  throwOnError(
    `robot extract -i ${inputOntology} \
              --method MIREOT \
              --upper-term ${upperTerm} \
              --lower-terms ${lowerTerms} \
              --intermediates minimal \
           convert --format ttl -o ${output}`,
    'Class hierarchy extraction failed. See errors above.'
  );

  return output;
}

export function mergeOntologies(context, ontologyPaths=[]) {
  const { selectedDigitalObject: obj } = context;

  const input = resolve(obj.path, `enriched/enriched.ttl`);

  const inputParams = ontologyPaths.reduce(
    (collector, ontologyPath) => (`${collector} --input ${ontologyPath}`), "");

  const merged = resolve(obj.path, `enriched/enriched-merged.ttl`);
  const output = resolve(obj.path, `enriched/enriched.ttl`);

  more(`Merging ${ontologyPaths[0]} with:`);
  for (const ontologyPath of ontologyPaths.slice(1)) {
    more(` -> ${ontologyPath}`);
  }
  throwOnError(
    `robot merge ${inputParams} \
           convert --format ttl -o ${merged} && \
     mv ${merged} ${output}`,
     'Merge ontologies failed. See errors above.'
  );

  return output;
}
