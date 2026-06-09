import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import Papa from 'papaparse';
import { resolve } from 'path';
import sh from 'shelljs';
import { buildTermPurlIndexFromCsvFile, serializeTermPurlIndex } from '../build-term-purl-index.js';
import { construct, load, select } from '../utils/blazegraph.js';
import { error, info } from '../utils/logging.js';
import { query } from '../utils/robot.js';
import { throwOnError } from '../utils/sh-exec.js';
import { reformatDigitalObjectsJsonld } from './utils/reformat-digital-objects-jsonld.js';

const CATALOG_GRAPH = 'urn:kg-catalog';
const HRA_GRAPH = 'https://purl.humanatlas.io/collection/hra';
const KG_TERMS_GRAPH = 'urn:kg-terms-index';

function resolveHraGraphTtl(context, kgDeploymentHome) {
  const deploymentHomeHraGraph = resolve(context.deploymentHome, 'collection/hra/latest/graph.ttl');
  if (existsSync(deploymentHomeHraGraph)) {
    return { hraGraphTtl: deploymentHomeHraGraph, temporaryHraGraphTtl: undefined };
  }

  if (context.hraPath) {
    const suppliedHraPath = resolve(context.hraPath);
    if (!existsSync(suppliedHraPath)) {
      throw new Error(`Unable to find HRA graph at --hra-path: ${suppliedHraPath}`);
    }
    return { hraGraphTtl: suppliedHraPath, temporaryHraGraphTtl: undefined };
  } else if (context.hraUrl) {
    const downloadedHraGraphTtl = resolve(kgDeploymentHome, 'hra.graph.ttl');
    throwOnError(
      `curl -L -f -H "Accept: text/turtle" "${context.hraUrl}" -o "${downloadedHraGraphTtl}"`,
      `Failed to download HRA graph from --hra-url: ${context.hraUrl}`
    );
    return { hraGraphTtl: downloadedHraGraphTtl, temporaryHraGraphTtl: downloadedHraGraphTtl };
  }

  throw new Error(
    'Unable to determine HRA graph TTL. Provide --hra-path or --hra-url, or ensure deploymentHome has collection/hra/latest/graph.ttl.'
  );
}

export async function buildKgExplorerData(context) {
  const { processorHome, deploymentHome } = context;

  // Query paths
  const queriesDir = resolve(processorHome, 'src/queries/kg-explorer');
  const asctbTermsInHraRq = resolve(queriesDir, 'asctb-terms-in-hra.rq');
  const asctbTermsInGraphRq = resolve(queriesDir, 'asctb-terms-in-graph.rq');
  const asctbTermsInGraphExportRq = resolve(queriesDir, 'asctb-terms-in-graph-export.rq');
  const digitalObjectsRq = resolve(queriesDir, 'digital-objects.rq');
  const digitalObjectsFrameJsonld = resolve(queriesDir, 'digital-objects.frame.jsonld');
  const asctbTermsExportRq = resolve(queriesDir, 'asctb-terms-export.rq');

  // Output / temp paths
  const kgDeploymentHome = resolve(deploymentHome, 'kg');
  sh.mkdir('-p', kgDeploymentHome);
  const journal = resolve(kgDeploymentHome, 'blazegraph.jnl');
  const asctbTermsNt = resolve(kgDeploymentHome, 'asctb-terms-index.nt');
  const kgTermsCsv = resolve(kgDeploymentHome, 'kg-terms-index.csv');
  const kgTermsNt = resolve(kgDeploymentHome, 'kg-terms-index.nt');
  const kgTermsJson = resolve(kgDeploymentHome, 'kg-terms-index.json');
  const tmpGraphNt = resolve(kgDeploymentHome, 'graph.nt');
  const tmpNt = resolve(kgDeploymentHome, 'kg-terms-index.tmp.nt');
  const tmpCsv = resolve(kgDeploymentHome, 'kg-terms-index.tmp.csv');
  const digitalObjectsTtl = resolve(kgDeploymentHome, 'digital-objects.ttl');
  const digitalObjectsJsonld = resolve(kgDeploymentHome, 'digital-objects.jsonld');
  const asctbTermsCsv = resolve(kgDeploymentHome, 'asctb-terms.csv');
  const asctbTermsJson = resolve(kgDeploymentHome, 'asctb-terms.json');

  // source paths
  const catalogTtl = resolve(deploymentHome, 'catalog.ttl');
  const { hraGraphTtl, temporaryHraGraphTtl } = resolveHraGraphTtl(context, kgDeploymentHome);

  // 1. Load catalog and HRA into blazegraph
  info('Loading catalog and HRA into blazegraph...');
  sh.rm('-f', journal);
  load(CATALOG_GRAPH, catalogTtl, journal);
  load(HRA_GRAPH, hraGraphTtl, journal);

  // 2. Extract ASCT+B terms index from HRA
  info('Extracting ASCT+B terms index from HRA...');
  construct(asctbTermsInHraRq, asctbTermsNt, journal);

  // 3. Build kg-terms-index.csv and kg-terms-index.nt by iterating each graph.nt
  info('Building kg-terms index...');
  writeFileSync(kgTermsCsv, 'iri,purl\n', 'utf8');
  sh.rm('-f', kgTermsNt);

  const graphNtFiles = globSync('**/latest/graph.nt', { cwd: deploymentHome, absolute: true }).sort();
  if (graphNtFiles.length === 0) {
    error('Please finalize and compute latest before running.');
  }
  for (const ntFile of graphNtFiles) {
    info(`Processing ${ntFile}...`);
    sh.cat(asctbTermsNt, ntFile).to(tmpGraphNt);
    query(tmpGraphNt, asctbTermsInGraphRq, tmpNt);
    query(tmpNt, asctbTermsInGraphExportRq, tmpCsv);

    // Append CSV data rows, skipping header
    const csvRows = readFileSync(tmpCsv, 'utf8').split('\n').slice(1).join('\n');
    if (csvRows.trim()) {
      appendFileSync(kgTermsCsv, csvRows + '\n', 'utf8');
    }

    // Append NT triples
    sh.cat(tmpNt).toEnd(kgTermsNt);
  }

  sh.rm('-f', tmpGraphNt, asctbTermsNt, tmpNt, tmpCsv);

  // 4. Build compact term/purl JSON index
  info('Building term/purl JSON index...');
  const index = buildTermPurlIndexFromCsvFile(kgTermsCsv);
  writeFileSync(kgTermsJson, serializeTermPurlIndex(index), 'utf8');

  // 5. Load kg-terms index into blazegraph
  info('Loading kg-terms index into blazegraph...');
  load(KG_TERMS_GRAPH, kgTermsNt, journal);

  // 6. Construct digital-objects graph
  info('Constructing digital objects graph...');
  construct(digitalObjectsRq, digitalObjectsTtl, journal);

  // 7. Frame digital-objects as JSON-LD
  info('Framing digital objects as JSON-LD...');
  throwOnError(
    `riot --output=application/ld+json --nocheck ${digitalObjectsTtl} | jsonld frame -f ${digitalObjectsFrameJsonld} > ${digitalObjectsJsonld}`,
    'Failed to convert digital objects to JSON-LD.'
  );
  const jsonld = reformatDigitalObjectsJsonld(JSON.parse(readFileSync(digitalObjectsJsonld, 'utf-8')));
  writeFileSync(digitalObjectsJsonld, JSON.stringify(jsonld, null, 2));

  // 8. Export ASCT+B terms CSV
  info('Exporting ASCT+B terms CSV...');
  await select(asctbTermsExportRq, asctbTermsCsv, journal);

  // 9. Export ASCT+B terms JSON (minified)
  info('Converting ASCT+B terms CSV to minified JSON...');
  const asctbTermsParsed = Papa.parse(readFileSync(asctbTermsCsv, 'utf8'), {
    header: true,
    skipEmptyLines: true,
  });
  writeFileSync(asctbTermsJson, JSON.stringify(asctbTermsParsed.data), 'utf8');

  // 10. Cleanup intermediates
  info('Cleaning up...');
  sh.rm('-f', journal, kgTermsNt, kgTermsCsv, digitalObjectsTtl, asctbTermsCsv);
  if (temporaryHraGraphTtl) {
    sh.rm('-f', temporaryHraGraphTtl);
  }
}
