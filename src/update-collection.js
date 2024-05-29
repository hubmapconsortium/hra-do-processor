import { readFileSync, writeFileSync } from 'fs';
import { dump, load } from 'js-yaml';
import { resolve } from 'path';
import { getLatestDigitalObject } from './utils/get-latest.js';

export function updateCollection(context) {
  const obj = context.selectedDigitalObject;
  const doListing = resolve(obj.path, 'raw/digital-objects.yaml');
  const childObjects = load(readFileSync(doListing))['digital-objects'];

  const updated = childObjects.map((child) => {
    const doTypeAndName = child.split('/').slice(0, 2);
    const latest = getLatestDigitalObject(context.doHome, ...doTypeAndName, context.purlIri);
    return latest.doString;
  });

  writeFileSync(doListing, dump({ 'digital-objects': updated }));
}
