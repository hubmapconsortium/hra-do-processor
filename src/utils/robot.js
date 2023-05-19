import { resolve } from 'path';
import sh from 'shelljs';
import { more } from './logging.js';
import { throwOnError } from './sh-exec.js';

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

export function merge(inputs, output, outputFormat="owl") {
  // Convert the inputs to OWL/XML format to avoid blank node collisions
  const owlInputs = [];
  for (const input of inputs) {
    const output = `${input}.owl`
    throwOnError(
      `robot convert -i ${input} --format owl -o ${output}`,
      'Convert to OWL during merging failed.'
    );
    owlInputs.push(output);
  }
  // Merge the OWL input files
  const inputParams = owlInputs.reduce(
    (collector, owlInput) => (`${collector} --input ${owlInput}`), "");
  try {
    throwOnError(
      `robot merge ${inputParams} \
             convert --format ${outputFormat} -o ${output}`,
      'Merge ontologies failed. See errors above.'
    );
  } finally { // Clean up the generated OWL inputs
    for (const owlInput of owlInputs) {
      sh.rm('-f', owlInput);
    }
  }
}

export function convert(input, output, outputFormat="owl") {
  throwOnError(
    `robot convert -i ${input} --format ${outputFormat} -o ${output}`,
    'Data conversion failed.'
  );
}
