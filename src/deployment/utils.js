import { resolve } from 'path';
import { load } from '../utils/blazegraph.js';

export function loadDoIntoTripleStore(context, journalPath) {
  const obj = context.selectedDigitalObject;
  const graph = obj.iri;
  const data = resolve(obj.path, 'enriched/enriched.ttl');
  load(graph, data, journalPath);
}

export function loadMetadataIntoTripleStore(context, journalPath) {
  const obj = context.selectedDigitalObject;
  const graph = `${context.lodIri}${context.selectedDigitalObject.doString}`;
  const data = resolve(obj.path, 'enriched/enriched-metadata.ttl');
  load(graph, data, journalPath);
}

export function loadRedundantIntoTripleStore(context, journalPath) {
  const obj = context.selectedDigitalObject;
  const graph = `${obj.iri}/redundant`;
  const data = resolve(obj.path, 'enriched/redundant.ttl');
  load(graph, data, journalPath);
}