import { readFileSync, writeFileSync } from 'node:fs';

// Check if file argument is provided
if (process.argv.length < 3) {
  console.error('Please provide a JSON file path as an argument');
  process.exit(1);
}

try {
  // Read and parse JSON file
  const filePath = process.argv[2];
  const jsonData = JSON.parse(readFileSync(filePath, 'utf8'));

  // Extract @context object
  const context = jsonData['@context'];
  if (!context) {
    console.error('No @context found in the JSON file');
    process.exit(1);
  }

  // Add placement
  context['placement'] = {
    '@reverse': 'source'
  };
  // Add samples
  context['samples'] = {
    '@reverse': 'donor'
  };
  // Add collision_source
  context['collision_source'] = {
    '@reverse': 'all_collisions'
  };
  // Add corridor_source
  context['corridor_source'] = {
    '@reverse': 'corridor'
  };
  // Add cell_source
  context['cell_source'] = {
    '@reverse': 'summaries'
  };

  // Update the original JSON with modified context
  jsonData['@context'] = context;

  // Write back to file
  writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
} catch (error) {
  console.error('Error processing file:', error.message);
  process.exit(1);
}