import { readFileSync, writeFileSync } from 'fs';
import { dump, load } from 'js-yaml';
import { resolve } from 'path';
import { update2dFtuCrosswalk } from './update-2d-ftu-crosswalk.js';
import { updateRefOrganCrosswalk } from './update-ref-organ-crosswalk.js';
import { getDigitalObjectInformation } from './utils/digital-object.js';
import { getLatestDigitalObject } from './utils/get-latest.js';

export async function updateCollection(context) {
  const obj = context.selectedDigitalObject;
  const doListing = resolve(obj.path, 'raw/digital-objects.yaml');
  const childObjects = load(readFileSync(doListing))['digital-objects'];

  const updated = childObjects.map((child) => {
    const doTypeAndName = child.split('/').slice(0, 2);
    const latest = getLatestDigitalObject(context.doHome, ...doTypeAndName, context.purlIri);
    return latest.doString;
  });

  writeFileSync(doListing, dump({ 'digital-objects': updated }));

  if (context.update2dFtuCrosswalk) {
    // Update all reference organ crosswalk files
    const ftuCrosswalk = updated.find((d) => d.startsWith('2d-ftu/asct-b-2d-models-crosswalk'));
    const ftuIllustrations = updated.filter((d) => d !== ftuCrosswalk && d.startsWith('2d-ftu/'));

    for (const ftu of ftuIllustrations) {
      console.log(`Updating crosswalk for ${ftu} using ${ftuCrosswalk}`);
      update2dFtuCrosswalk({
        ...context,
        selectedDigitalObject: getDigitalObjectInformation(resolve(context.doHome, ftu), context.purlIri),
        crosswalk: ftuCrosswalk,
      });
    }
  }

  if (context.updateRefOrganCrosswalk) {
    // Update all reference organ crosswalk files
    const refOrganCrosswalk = updated.find((d) => d.startsWith('ref-organ/asct-b-3d-models-crosswalk'));
    const refOrgans = updated.filter((d) => d !== refOrganCrosswalk && d.startsWith('ref-organ/'));

    for (const refOrgan of refOrgans) {
      console.log(`Updating crosswalk for ${refOrgan} using ${refOrganCrosswalk}`);
      await updateRefOrganCrosswalk({
        ...context,
        selectedDigitalObject: getDigitalObjectInformation(resolve(context.doHome, refOrgan), context.purlIri),
        crosswalk: refOrganCrosswalk,
      });
    }
  }
}
