import { resolve } from 'path';
import sh from 'shelljs';
import { more } from './logging.js';
import { throwOnError } from './sh-exec.js';

export function query(input, query, output) {
  throwOnError(
    `robot query -i ${input} --query ${query} ${output}`,
    `Querying ${input} failed.`
  );
}

export function extract(input, upperTerm, lowerTerms, output, outputFormat="owl") {
  throwOnError(
    `robot extract -i ${input} \
              --method MIREOT \
              --upper-term ${upperTerm} \
              --lower-terms ${lowerTerms} \
              --intermediates minimal \
           convert --format ${outputFormat} -o ${output}`,
    'Class hierarchy extraction failed. See errors above.'
  );
}

export function filter(input, anyTerms, annotationTerms=['rdfs:label'], output, outputFormat="owl") {
  const termArguments = annotationTerms.map(term => `--term ${term}`).join(" ");
  throwOnError(
    `robot filter -i ${input} \
                  --include-terms ${anyTerms} \
                  ${termArguments} \
           convert --format ${outputFormat} -o ${output}`,
    'Class(es) extraction failed. See errors above.'
  );
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

export function convert(input, output, outputFormat) {
  throwOnError(
    `robot convert -i ${input} --format ${outputFormat} -o ${output}`,
    'Data conversion failed.'
  );
}

export function remove(input, output, subsetSelector) {
  throwOnError(
    `robot remove --input ${input} --select ${subsetSelector} -o ${output}`,
    'Data removal failed.'
  );
}

