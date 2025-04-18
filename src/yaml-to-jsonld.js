import { load } from 'js-yaml';
import { readFileSync, writeFileSync } from 'node:fs';

const data = load(readFileSync(process.argv[2]));
const context = load(readFileSync(process.argv[3]));

// Inject the context into the data
data['@context'] = context['@context']; 

writeFileSync(process.argv[4], JSON.stringify(data, null, 2));