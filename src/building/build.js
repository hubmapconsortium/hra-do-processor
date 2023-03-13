import { existsSync, readFileSync } from 'fs';
import { load } from 'js-yaml';
import { resolve } from 'path';
import sh from 'shelljs';
import { enrich } from '../enrichment/enrich.js';
import { normalize } from '../normalization/normalize.js';
import { packageIt } from '../packaging/package.js';
import { getDigitalObjectInformation } from '../utils/digital-object.js';

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
    step: 'package',
    test: 'packaged/',
    action: packageIt,
  },
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
    step: 'package',
    test: 'packaged/README.md',
    action: async (context) => {
      await runOnChildObjects(context, packageIt);
      await packageIt(context);
    },
  },
];

async function runOnChildObjects(context, action) {
  const obj = context.selectedDigitalObject;
  const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
  const childObjects = load(readFileSync(normalizedPath))['data'];
  for (const child of childObjects) {
    await action({
      ...context,
      selectedDigitalObject: getDigitalObjectInformation(resolve(context.doHome, child)),
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
    sh.exec(`pushd ${obj.path}; rm -rf normalized enriched packaged; mkdir normalized enriched packaged; popd`, {
      silent: true,
    });
  }
}

export async function build(context) {
  const { selectedDigitalObject: obj, clean } = context;
  const commands = obj.type === 'collection' ? COLLECTION_COMMANDS : COMMANDS;
  for (const cmd of commands) {
    if (clean || !testCmdSuccess(context, cmd)) {
      console.log(cmd.test);
      await cmd.action(context);
    }
  }
}
