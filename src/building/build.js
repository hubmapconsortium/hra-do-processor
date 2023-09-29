import { existsSync, readFileSync } from 'fs';
import { load } from 'js-yaml';
import { resolve } from 'path';
import sh from 'shelljs';
import { enrich } from '../enrichment/enrich.js';
import { normalize } from '../normalization/normalize.js';
import { getDigitalObjectInformation } from '../utils/digital-object.js';
import { banner, info } from '../utils/logging.js';
import { deploy } from '../deployment/deploy.js';

const COMMANDS = [
  {
    step: 'raw',
    test: 'raw/metadata.yaml',
    action: cleanAction,
  },
  {
    step: 'normalize',
    test: 'normalized/normalized.yaml',
    action: normalize,
  },
  {
    step: 'enrich',
    test: 'enriched/enriched.ttl',
    action: enrich,
  },
  {
    step: 'deploy',
    test: 'false',
    action: deploy,
  }
];

const COLLECTION_COMMANDS = [
  {
    step: 'raw',
    test: 'raw/metadata.yaml',
    action: async (context) => {
      await normalize(context);
      await runOnChildObjects(context, cleanAction);
      cleanAction(context);
    },
  },
  {
    step: 'normalize',
    test: 'normalized/normalized.yaml',
    action: async (context) => {
      await normalize(context);
      await runOnChildObjects(context, normalize);
    },
  },
  {
    step: 'enrich',
    test: 'enriched/enriched.ttl',
    action: async (context) => {
      await runOnChildObjects(context, enrich);
      await enrich(context);
    },
  },
  {
    step: 'deploy',
    test: 'false',
    action: async (context) => {
      await runOnChildObjects(context, deploy);
      await deploy(context);
    },
  },
];

async function runOnChildObjects(context, action) {
  const obj = context.selectedDigitalObject;
  const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
  const childObjects = load(readFileSync(normalizedPath))['data'];
  for (const child of childObjects) {
    const selectedDigitalObject = getDigitalObjectInformation(resolve(context.doHome, child), context.purlIri);
    await action({
      ...context,
      selectedDigitalObject,
    });
  }
}

function testCmdSuccess(context, cmd) {
  const testFile = resolve(context.selectedDigitalObject.path, cmd.test);
  return existsSync(testFile);
}

function cleanAction(context) {
  const { selectedDigitalObject: obj, clean } = context;
  if (clean) {
    sh.exec(`rm -rf normalized enriched packaged && mkdir normalized enriched packaged`, {
      cwd: obj.path,
      silent: true,
    });
  }
}

export async function build(context) {
  info('Preparing to build...');
  const { selectedDigitalObject: obj, clean } = context;
  const commands = obj.type === 'collection' ? COLLECTION_COMMANDS : COMMANDS;
  for (const cmd of commands) {
    if (clean || !testCmdSuccess(context, cmd)) {
      banner(`Generating resources in the '${cmd.step}' step`);
      await cmd.action(context);
    }
  }
}
