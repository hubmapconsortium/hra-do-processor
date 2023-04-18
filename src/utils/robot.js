import { resolve } from 'path';
import { throwOnError } from './sh-exec.js';

export function extractClassHierarchy(context, ontology) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const inputOntology = resolve(processorHome, `mirrors/${ontology}.ttl`);
  const query = resolve(processorHome, `src/utils/get-${ontology}-terms.sparql`);

  const input = resolve(obj.path, `enriched/enriched.ttl`);
  const termList = resolve(obj.path, `enriched/${ontology}-terms.csv`);
  const output = resolve(obj.path, `enriched/${ontology}-extract.ttl`);

  throwOnError(
    `robot query -i ${input} --query ${query} ${termList} && \
     sed -i '1d' ${termList} && \
     robot extract -i ${inputOntology} \
              --method subset \
              --term-file ${termList} \
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

  throwOnError(
    `robot merge ${inputParams} \
           convert --format ttl -o ${merged} && \
     mv ${merged} ${output}`,
     'Merge ontologies failed. See errors above.'
  );

  return output;
}
