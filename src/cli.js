#!/usr/bin/env node

import { Command } from 'commander';
import { build } from './building/build.js';
import { enrich } from './enrichment/enrich.js';
import { list } from './list.js';
import { normalize } from './normalization/normalize.js';
import { packageIt } from './packaging/package.js';
import { getEnvironment, getProcessorVersion, parseDirectory } from './utils/cli-environment.js';

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
    normalize(getEnvironment(program, command, str));
  });

program
  .command('enrich')
  .description(
    'Enriches a Normalized Digital Object, optionally pulling in data from other sources like Uberon, CL, Ubergraph, or other external resources. Minimally, it converts the Normalized JSON file into RDF. Optionally enriches data from the original form (ie add Metadata to nodes in the SVG or GLB files).'
  )
  .argument('<digital-object-path>', 'Path to the digital object relative to DO_HOME')
  .action((str, _options, command) => {
    enrich(getEnvironment(program, command, str));
  });

program
  .command('package')
  .description("Packages an Enriched Digital Object, such that it can published to a website/DOI'd/etc and used")
  .argument('<digital-object-path>', 'Path to the digital object relative to DO_HOME')
  .action((str, _options, command) => {
    packageIt(getEnvironment(program, command, str));
  });

program
  .command('build')
  .description('Given a Digital Object, checks for and runs normalization, enrichment, and packaging in one command.')
  .argument('<digital-object-path>', 'Path to the digital object relative to DO_HOME')
  .action((str, _options, command) => {
    build(getEnvironment(program, command, str));
  });

program
  .command('list')
  .description('Lists digital object information in the DO_HOME directory')
  .argument('[glob]', 'Optional glob for filtering digital objects')
  .action((str, _options, command) => {
    list(getEnvironment(program, command, str));
  });

program.parse(process.argv);
