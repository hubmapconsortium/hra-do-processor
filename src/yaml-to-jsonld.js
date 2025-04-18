import { load } from 'js-yaml';
import { readFileSync, writeFileSync } from 'node:fs';

// Usage: node yaml-to-jsonld.js <input.yaml> <context.jsonld> <output.jsonld>

// Read the input normalized YAML file
const data = load(readFileSync(process.argv[2]));

// Read the context JSON-LD file
const context = load(readFileSync(process.argv[3]));

// Inject the context into the data
data['@context'] = context['@context']; 

// Write the output JSON-LD file
writeFileSync(process.argv[4], JSON.stringify(data, null, 2));