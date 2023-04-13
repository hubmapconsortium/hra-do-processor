import { resolve } from 'path';
import sh from 'shelljs';
import { convertNormalizedToOwl } from './utils.js';
import { extractClassHierarchy, mergeOntologies } from '../utils/robot.js';

export function enrichAsctb(context) {
  // TODO: do more than a straight conversion to rdf
  overrideSchemaId(context);
  convertNormalizedToOwl(context);
  extractClassHierarchy(context, "uberon");
  extractClassHierarchy(context, "cl");
  extractClassHierarchy(context, "hgnc");
  mergeOntologies(context, ["uberon", "cl", "hgnc"]);
  revertChanges(context);
}

function overrideSchemaId(context) {
  const { selectedDigitalObject: obj, processorHome } = context;
  const newId = `http://purl.humanatlas.io/${obj.doString}`;
  const schema = resolve(processorHome, 'schemas/generated/linkml', `${obj.type}.yaml`);
  sh.exec(`sed -i.bak 's|^id:.*|id: ${newId}|' ${schema}`);
}

function revertChanges(context) {
  const { selectedDigitalObject: obj, processorHome } = context;
  const originalSchema = resolve(processorHome, 'schemas/generated/linkml', `${obj.type}.yaml.bak`);
  const schema = resolve(processorHome, 'schemas/generated/linkml', `${obj.type}.yaml`);
  sh.exec(`mv ${originalSchema} ${schema}`);
}
