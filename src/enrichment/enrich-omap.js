import { readFileSync } from 'fs';
import { error } from 'console';
import { resolve } from 'path';
import { getRawData } from '../normalization/normalize-omap.js';
import { info, more } from '../utils/logging.js';
import { RdfBuilder, iri, literal } from '../utils/rdf-builder.js';
import { retrieveAntibody } from '../utils/scicrunch-client.js';
import { convert, merge } from '../utils/robot.js';
import { enrichBasicData } from './enrich-basic.js';
import {
  cleanTemporaryFiles,
  collectEntities,
  convertNormalizedDataToOwl,
  convertNormalizedMetadataToRdf,
  excludeTerms,
  extractClassHierarchy,
  isFileEmpty,
  logOutput,
} from './utils.js';

export function enrichOmapMetadata(context) {
  const { selectedDigitalObject: obj } = context;
  const normalizedPath = resolve(obj.path, 'normalized/normalized-metadata.yaml');
  const enrichedPath = resolve(obj.path, 'enriched/enriched-metadata.ttl');
  convertNormalizedMetadataToRdf(context, normalizedPath, enrichedPath);
}

export async function enrichOmapData(context) {
  const rawData = await getRawData(context);
  if (rawData.length === 0) {
    enrichBasicData(context);
  } else {
    try {
      const { selectedDigitalObject: obj } = context;
      const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
      const baseInputPath = resolve(obj.path, 'enriched/base-input.ttl');
      convertNormalizedDataToOwl(context, normalizedPath, baseInputPath);
      logOutput(baseInputPath);

      // Extract terms from reference ontologies to enrich the graph data
      const ontologyExtractionPaths = [];
      ontologyExtractionPaths.push(baseInputPath); // Set the base input path as the initial

      const rridEntitiesPath = collectEntities(context, 'rrid', baseInputPath);
      if (!isFileEmpty(rridEntitiesPath)) {
        const rridExtractPath = resolve(obj.path, `enriched/rrid-extract.ttl`);
        const rrids = readFileSync(rridEntitiesPath).toString()
          .split(/[\n\r]/)
          .filter((str) => str)
          .map((str) => /.*RRID:(?<rrid>.*)/.exec(str).groups.rrid)
          .map((str) => str.toLowerCase());
        const builder = await retrieveAntibody(rrids).then((response) => {
          return response.reduce((accum, item) => {
            const antibody = item["_source"]["item"];
            const antibodyIri = `https://identifiers.org/RRID:${antibody.identifier}`;
            return accum
              .add(
                iri(antibodyIri),
                iri("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
                iri("http://www.w3.org/2002/07/owl#Class"))
              .add(
                iri(antibodyIri), 
                iri("http://www.w3.org/2000/01/rdf-schema#label"),
                literal(antibody.name))
              .add(
                iri(antibodyIri), 
                iri("http://www.w3.org/2000/01/rdf-schema#comment"),
                literal(antibody.description));
          }, new RdfBuilder(`${context.purlIri}/rrid/antibody`));
        });
        builder.save(rridExtractPath);
        logOutput(rridExtractPath);
        ontologyExtractionPaths.push(rridExtractPath);
      }

      const uberonEntitiesPath = collectEntities(context, 'uberon', baseInputPath);
      if (!isFileEmpty(uberonEntitiesPath)) {
        info('Extracting UBERON.');
        const uberonExtractPath = extractClassHierarchy(
          context,
          'uberon',
          'http://purl.obolibrary.org/obo/UBERON_0001062',
          uberonEntitiesPath
        );
        logOutput(uberonExtractPath);
        ontologyExtractionPaths.push(uberonExtractPath);
      }

      const hgncEntitiesPath = collectEntities(context, 'hgnc', baseInputPath);
      if (!isFileEmpty(hgncEntitiesPath)) {
        info('Extracting HGNC.');
        const hgncExtractPath = extractClassHierarchy(
          context,
          'hgnc',
          'http://purl.bioontology.org/ontology/HGNC/gene',
          hgncEntitiesPath
        );
        logOutput(hgncExtractPath);
        ontologyExtractionPaths.push(hgncExtractPath);
      }

      info('Merging files:');
      for (const inputPath of ontologyExtractionPaths) {
        more(` -> ${inputPath}`);
      }
      const enrichedWithOntologyPath = resolve(obj.path, 'enriched/enriched-with-ontology.owl');
      merge(ontologyExtractionPaths, enrichedWithOntologyPath);
      logOutput(enrichedWithOntologyPath);

      const trimmedOutputPath = resolve(obj.path, 'enriched/trimmed-output.ttl');
      info(`Excluding unwanted terms.`);
      excludeTerms(context, enrichedWithOntologyPath, trimmedOutputPath);

      const enrichedPath = resolve(obj.path, 'enriched/enriched.ttl');
      info(`Creating omap: ${enrichedPath}`);
      convert(trimmedOutputPath, enrichedPath, 'ttl');
    } catch (e) {
      error(e);
    } finally {
      // Clean up
      info('Cleaning up temporary files.');
      cleanTemporaryFiles(context);
      info('Done.');
    }
  }
}
