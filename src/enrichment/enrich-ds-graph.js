import { readFileSync } from 'fs';
import { error } from 'console';
import { resolve } from 'path';
import { getRawData } from '../normalization/normalize-omap.js';
import { info, warning, more } from '../utils/logging.js';
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
    extractOntologySubset,
    isFileEmpty,
    logOutput,
} from './utils.js';

export function enrichDatasetGraphMetadata(context) {
    const { selectedDigitalObject: obj } = context;
    const normalizedPath = resolve(obj.path, 'normalized/normalized-metadata.yaml');
    const enrichedPath = resolve(obj.path, 'enriched/enriched-metadata.ttl');
    convertNormalizedMetadataToRdf(context, normalizedPath, enrichedPath);
}

export async function enrichDatasetGraphData(context) {
    try {
        const { selectedDigitalObject: obj } = context;
        const normalizedPath = resolve(obj.path, 'normalized/normalized.yaml');
        const baseInputPath = resolve(obj.path, 'enriched/base-input.ttl');
        convertNormalizedDataToOwl(context, normalizedPath, baseInputPath);
        logOutput(baseInputPath);

        // Extract terms from reference ontologies to enrich the graph data
        const ontologyExtractionPaths = [];
        ontologyExtractionPaths.push(baseInputPath); // Set the base input path as the initial

        const uberonEntitiesPath = collectEntities(context, 'uberon', baseInputPath, true);
        if (!isFileEmpty(uberonEntitiesPath)) {
            info('Extracting a subset of UBERON ontology.');
            const uberonSubsetPath = extractOntologySubset(
                context,
                'uberon',
                uberonEntitiesPath,
                ["BFO:0000050"]
            );
            logOutput(uberonSubsetPath);
            ontologyExtractionPaths.push(uberonSubsetPath);
        }

        const fmaEntitiesPath = collectEntities(context, 'fma', baseInputPath);
        if (!isFileEmpty(fmaEntitiesPath)) {
            info('Extracting FMA.');
            const fmaExtractPath = extractClassHierarchy(
                context,
                'fma',
                'http://purl.org/sig/ont/fma/fma62955',
                fmaEntitiesPath
            );
            logOutput(fmaExtractPath);
            ontologyExtractionPaths.push(fmaExtractPath);
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
        info(`Creating ds-graph: ${enrichedPath}`);
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
