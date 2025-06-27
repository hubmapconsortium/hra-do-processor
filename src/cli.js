#!/usr/bin/env node

import { Command } from 'commander';
import { build } from './building/build.js';
import { createDb } from './create-db.js';
import { deploy } from './deployment/deploy.js';
import { bumpDraft } from './drafting/bump-draft.js';
import { newDraft } from './drafting/new-draft.js';
import { enrich } from './enrichment/enrich.js';
import { finalize } from './finalizing/finalize.js';
import { validate } from './validation/validate.js';
import { reconstruct } from './reconstruction/reconstruct.js';
import { deployDoiXml } from './finalizing/misc-files.js';
import { genAsctbCollectionJson } from './gen-asctb-collection-json.js';
import { list } from './list.js';
import { migrateCcfLandmarks } from './migration/ccf-landmarks/migrate.js';
import { migrateCcfOwl } from './migration/ccf-owl/migrate.js';
import { migrateCcfReleases } from './migration/ccf-releases/migrate.js';
import { migrateSchemas } from './migration/schemas/migrate.js';
import { normalize } from './normalization/normalize.js';
import { update2dFtuCrosswalk } from './update-2d-ftu-crosswalk.js';
import { updateCollection } from './update-collection.js';
import { updateRefOrganCrosswalk } from './update-ref-organ-crosswalk.js';
import { getContext, getProcessorVersion, parseDirectory } from './utils/context.js';
import { error } from './utils/logging.js';

const program = new Command();

program
  .name('do-processor')
  .description('Digital Object Processing Command-Line Interface')
  .version(getProcessorVersion())
  .option('--base-iri <string>', 'Base IRI for Digital Objects')
  .option('--do-home <string>', 'Digital Objects home directory', parseDirectory)
  .option('--processor-home <string>', 'DO Processor home', parseDirectory)
  .option('--deployment-home <string>', 'DO deployment home', parseDirectory)
  .option('--skip-validation', 'Skip validation in each command', false)
  .option('--exclude-bad-values', 'Do not pass invalid values from data processors', false);

program
  .command('normalize')
  .description(
    "Mechanically normalizes a Digital Object from it's raw form. Minimally, it converts the source DO type + integrates the metadata into a single linkml-compatible JSON file."
  )
  .argument('<digital-object-path>', 'Path to the digital object relative to DO_HOME')
  .action((str, _options, command) => {
    normalize(getContext(program, command, str)).catch((e) => error(e));
  });

program
  .command('new-draft')
  .description('Creates a draft digital object from a given Digital Object')
  .argument('<digital-object-path>', 'Path to the digital object relative to DO_HOME')
  .option(
    '--latest',
    'Use the latest version of the given Digital Object for the new draft regardless of the version indicated',
    false
  )
  .option('--force', 'Deletes the existing draft, if it already exists', false)
  .action((str, _options, command) => {
    newDraft(getContext(program, command, str));
  });

program
  .command('bump-draft')
  .description('Increments the latest version of the digital object based on the given option, default is --minor')
  .argument('<digital-object-path>', 'Path to the digital object relative to DO_HOME')
  .option('--major', 'Increments the latest digital object version by 1', false)
  .option('--minor', 'Increments the latest digital object version by 0.1', false)
  .option('--patch', 'Increments the latest digital object version by 0.0.1', false)
  .action((str, _options, command) => {
    bumpDraft(getContext(program, command, str));
  });

program
  .command('update-collection')
  .description("Update a collection to the latest version of each digital object in it's metadata")
  .option('--update-2d-ftu-crosswalks', 'Update 2D FTUs with the overall crosswalk in the release.', false)
  .option('--update-ref-organ-crosswalks', 'Update reference organs with the overall crosswalk in the release.', false)
  .argument('<digital-object-path>', 'Path to the digital object relative to DO_HOME')
  .action((str, _options, command) => {
    updateCollection(getContext(program, command, str));
  });

program
  .command('update-2d-ftu-crosswalk')
  .description("Update a 2d-ftu's individual crosswalk file with information from the collated version.")
  .argument('<digital-object-path>', 'Path to the 2d-ftu digital object relative to DO_HOME')
  .option('-C, --crosswalk <crosswalk-path>', 'Path to the crosswalk digital object relative to DO_HOME')
  .action((str, _options, command) => {
    update2dFtuCrosswalk(getContext(program, command, str));
  });

program
  .command('update-ref-organ-crosswalk')
  .description("Update a reference organ's individual crosswalk file with information from the collated version.")
  .argument('<digital-object-path>', 'Path to the reference organ digital object relative to DO_HOME')
  .option('-C, --crosswalk <crosswalk-path>', 'Path to the crosswalk digital object relative to DO_HOME')
  .action((str, _options, command) => {
    updateRefOrganCrosswalk(getContext(program, command, str));
  });

program
  .command('gen-asct-b-collection-json')
  .description('Generate a json file of all raw ASCT+B data in json format from a given collection.')
  .argument('<collection-path>', 'Path to the collection digital object relative to DO_HOME')
  .option('-o, --output <json-path>', 'Path to the output JSON file to generate')
  .action((str, _options, command) => {
    genAsctbCollectionJson(getContext(program, command, str));
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
  .command('reconstruct')
  .description('Reconstructs a given digital object from the enriched graph data')
  .argument('<digital-object-path>', 'Path to the digital object relative to DO_HOME')
  .action((str, _options, command) => {
    reconstruct(getContext(program, command, str));
  });

program
  .command('build')
  .description('Given a Digital Object, checks for and runs normalization, enrichment, and packaging in one command.')
  .option('-c, --clean', 'clean and re-run all steps')
  .option('--update-db', 'Create or update the blazegraph database in the deployment home.')
  .argument('<digital-object-path>', 'Path to the digital object relative to DO_HOME')
  .action((str, _options, command) => {
    build(getContext(program, command, str));
  });

program
  .command('deploy')
  .description('Deploys a given Digital Object to the deployment home (default ./site)')
  .option('--update-db', 'Create or update the blazegraph database in the deployment home.')
  .option('--remove-individuals', 'Remove OWL individuals (data instances) from the graph', false)
  .argument('<digital-object-path>', 'Path to the digital object relative to DO_HOME')
  .action((str, _options, command) => {
    deploy(getContext(program, command, str));
  });

program
  .command('deploy-doi-xml')
  .description('Write the DOI xml for a given Digital Object to the deployment home')
  .argument('<digital-object-path>', 'Path to the digital object relative to DO_HOME')
  .action((str, _options, command) => {
    deployDoiXml(getContext(program, command, str));
  });

program
  .command('finalize')
  .description('Finalize the deployment home before sending to the live server')
  .option('--skip-db', 'Skip recreating the blazegraph database.')
  .option('--exclude-base-href', 'Exclude the base href element from html pages.', false)
  .action((_options, command) => {
    finalize(getContext(program, command));
  });

program
  .command('create-db')
  .description('Create a blazegraph database from select digital objects')
  .option('--include-all-versions', 'Include all versions of all digital objects when building', false)
  .option('--journal <journal>', 'override journal output path')
  .action((_options, command) => {
    createDb(getContext(program, command));
  });

program
  .command('migrate-schemas')
  .description('Migrate linkml schemas to HRA Digital Object format for publishing')
  .action((_options, command) => {
    migrateSchemas(getContext(program, command));
  });

program
  .command('migrate-ccf-landmarks')
  .description('Migrate ccf landmarks to HRA Digital Object format')
  .action((_options, command) => {
    migrateCcfLandmarks(getContext(program, command));
  });

program
  .command('migrate-ccf-releases')
  .description('Migrate ccf releases to HRA Digital Object format')
  .argument('<ccf-releases-path>', 'Path to the ccf-releases repository checked out locally', parseDirectory)
  .action((ccfReleasesPath, _options, command) => {
    migrateCcfReleases({ ...getContext(program, command), ccfReleasesPath });
  });

program
  .command('migrate-ccf-owl')
  .description('Migrate CCF.OWL to HRA Digital Object format')
  .action((_options, command) => {
    migrateCcfOwl(getContext(program, command));
  });

program
  .command('list')
  .description('Lists all digital objects in the DO_HOME directory')
  .action((_options, command) => {
    list(getContext(program, command));
  });

program
  .command('validate')
  .description('Runs the test suite against the generated enriched graph data')
  .argument('<digital-object-path>', 'Path to the digital object relative to DO_HOME')
  .action((str, _options, command) => {
    validate(getContext(program, command, str));
  });

program.parse(process.argv);
