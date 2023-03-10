#!/usr/bin/env node

import { Command } from 'commander';
import { build } from './building/build.js';
import { enrich } from './enrichment/enrich.js';
import { list } from './list.js';
import { normalize } from './normalization/normalize.js';
import { packageIt } from './packaging/package.js';
import { getContext, getProcessorVersion, parseDirectory } from './utils/context.js';

const program = new Command();

program
  .name('do-processor')
  .description('Digital Object Processing Command-Line Interface')
  .version(getProcessorVersion())
  .option('--do-home <string>', 'Digital Objects home directory', parseDirectory)
  .option('--processor-home <string>', 'DO Processor home', parseDirectory)
  .option('--skip-validation', 'Skip validation in each command', false);

program
  .command('normalize')
  .description(
    "Mechanically normalizes a Digital Object from it's raw form. Minimally, it converts the source DO type + integrates the metadata into a single linkml-compatible JSON file."
  )
  .argument('<digital-object-path>', 'Path to the digital object relative to DO_HOME')
  .action((str, _options, command) => {
    normalize(getContext(program, command, str));
  });

program
  .command('enrich')
  .description(
    'Enriches a Normalized Digital Object, optionally pulling in data from other sources like Uberon, CL, Ubergraph, or other external resources. Minimally, it converts the Normalized JSON file into RDF. Optionally enriches data from the original form (ie add Metadata to nodes in the SVG or GLB files).'
  )
  .argument('<digital-object-path>', 'Path to the digital object relative to DO_HOME')
  .action((str, _options, command) => {
    enrich(getContext(program, command, str));
  });

program
  .command('package')
  .description("Packages an Enriched Digital Object, such that it can published to a website/DOI'd/etc and used")
  .argument('<digital-object-path>', 'Path to the digital object relative to DO_HOME')
  .action((str, _options, command) => {
    packageIt(getContext(program, command, str));
  });

program
  .command('build')
  .description('Given a Digital Object, checks for and runs normalization, enrichment, and packaging in one command.')
  .option('-c --clean', 'clean and re-run all steps', false)
  .argument('<digital-object-path>', 'Path to the digital object relative to DO_HOME')
  .action((str, _options, command) => {
    build(getContext(program, command, str));
  });

program
  .command('list')
  .description('Lists all digital objects in the DO_HOME directory')
  .action((_options, command) => {
    list(getContext(program, command));
  });

program.parse(process.argv);
