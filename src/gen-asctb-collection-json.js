import { readFileSync, writeFileSync } from 'fs';
import { load } from 'js-yaml';
import { resolve } from 'path';
import { getRawData } from './normalization/normalize-asct-b.js';
import { getDigitalObjectInformation } from './utils/digital-object.js';

export async function genAsctbCollectionJson(context) {
  const obj = context.selectedDigitalObject;
  const doListing = resolve(obj.path, 'raw/digital-objects.yaml');
  const childObjects = load(readFileSync(doListing))['digital-objects'];
  const asctbObjects = childObjects.filter((obj) => obj.startsWith('asct-b/') && !obj.includes('-crosswalk/'));

  const result = {};
  for (const doName of asctbObjects) {
    const obj = getDigitalObjectInformation(resolve(context.doHome, doName), context.purlIri);
    const rawData = await getRawData({
      ...context,
      selectedDigitalObject: obj,
    });
    result[obj.name] = rawData;
  }

  writeFileSync(context.output, JSON.stringify(result, null, 2));
}
