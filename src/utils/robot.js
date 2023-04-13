import chalk from 'chalk';
import { resolve } from 'path';
import sh from 'shelljs';

export function extractClassHierarchy(context, ontology) {
  const { selectedDigitalObject: obj, processorHome } = context;

  const inputOntology = resolve(processorHome, `mirrors/${ontology}.ttl`);
  const query = resolve(processorHome, `src/utils/get-${ontology}-terms.sparql`);

  const input = resolve(obj.path, `enriched/enriched.ttl`);
  const termList = resolve(obj.path, `enriched/${ontology}-terms.csv`);
  const output = resolve(obj.path, `enriched/${ontology}-extract.ttl`);

  const response = sh.exec(
    `robot query -i ${input} --query ${query} ${termList} && \
     sed -i '1d' ${termList} && \
     robot extract -i ${inputOntology} \
              --method subset \
              --term-file ${termList} \
           convert --format ttl -o ${output}`
  );
  const success = response.code !== 1;
  if (!success) {
    console.log(chalk.red('Class hierarchy extraction failed. See errors above.'));
    exit();
  }
}
