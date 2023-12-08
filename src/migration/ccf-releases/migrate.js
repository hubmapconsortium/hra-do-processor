import { existsSync, writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { resolve } from 'path';
import sh from 'shelljs';
import { HraMarkdownParser } from './md-parser.js';
import { split2dFtuCrosswalk } from './split-2d-ftu-crosswalk.js';
import { splitRefOrganCrosswalk } from './split-ref-organ-crosswalk.js';

function writeDigitalObject(context, md) {
  const data = md.toJson();
  // Write out metadata.yaml
  const yamlDir = resolve(context.doHome, md.getDoType(), md.getName(), md.getVersion(), 'raw');
  sh.mkdir('-p', yamlDir);

  const dataPaths = data.dataTable
    .match(/\(https\:\/\/.*?\)/g)
    .map((u) => u.slice(1, -1).split('/').slice(-3).join('/'));

  Object.assign(data, {
    type: undefined,
    name: undefined,
    version: undefined,
    creation_year: undefined,
    accessed_date: undefined,
    dataTable: undefined,
    datatable: [],
  });

  for (const inputSrcPath of dataPaths) {
    let srcName = inputSrcPath.split('/').slice(-1)[0];
    const srcPath = resolve(context.ccfReleasesPath, inputSrcPath);
    let destPath = resolve(yamlDir, srcName);

    sh.cp(srcPath, destPath);

    if (srcPath.endsWith('.zip')) {
      srcName = srcName.replace('.zip', '');
      destPath = destPath.replace('.zip', '');
      sh.exec(`unzip -o ${srcPath} -d ${yamlDir} ${srcName}`);
    } else if (srcPath.endsWith('.bz2')) {
      srcName = srcName.replace('.bz2', '');
      destPath = destPath.replace('.bz2', '');
      sh.exec(`bunzip2 -c ${srcPath} > ${destPath}`);
    }
    if (srcPath.endsWith('.7z')) {
      srcName = srcName.replace('.7z', '');
      destPath = destPath.replace('.7z', '');
      sh.exec(`7z e -aoa ${srcPath} -o${yamlDir} ${srcName}`);
    }

    data.datatable.push(srcName);
    if (!existsSync(srcPath) || !existsSync(destPath)) {
      console.log(md.inputFile, md.getDoType(), srcPath, destPath);
    }
  }

  if (!md.getName().includes('crosswalk') && (md.getDoType() === 'ref-organ' || md.getDoType() === '2d-ftu')) {
    data.datatable.push('crosswalk.csv');
  }

  writeFileSync(yamlDir + '/metadata.yaml', dump(data));
}

export function migrateCcfReleases(context) {
  const inputDir = context.ccfReleasesPath;
  const srcDir = resolve(context.processorHome, 'src/migration/ccf-releases');

  const allMd = sh
    .ls(resolve(inputDir, 'v2.*/markdown/*/*.md'))
    .map((s) => s.split('/').slice(-5))
    .map((s) => [s[1], s[3], s[4].replace('.md', '')]);

  const collections = {};
  for (const [collectionVersion, type, name] of allMd) {
    const mdFile = resolve(inputDir, `${collectionVersion}/markdown/${type}/${name}.md`);
    const parser = new HraMarkdownParser(mdFile);
    writeDigitalObject(context, parser);

    collections[collectionVersion] = collections[collectionVersion] || [];
    collections[collectionVersion].push(parser.getDoString());
  }

  for (const [version, digitalObjects] of Object.entries(collections)) {
    const yamlDir = resolve(context.doHome, `collection/hra/${version}/raw`);
    sh.mkdir('-p', yamlDir);

    writeFileSync(yamlDir + '/digital-objects.yaml', dump({ 'digital-objects': digitalObjects }));

    sh.cp(resolve(srcDir, 'hra-metadata.yaml'), yamlDir + '/metadata.yaml');

    const crosswalk = digitalObjects.find((str) => str.startsWith('2d-ftu/') && str.includes('crosswalk'));
    const ftuIllustrations = digitalObjects.filter((str) => str.startsWith('2d-ftu/') && !str.includes('crosswalk'));
    for (const doString of ftuIllustrations) {
      split2dFtuCrosswalk(context, crosswalk, doString);
    }

    const refOrganCrosswalk = digitalObjects.find((str) => str.startsWith('ref-organ/') && str.includes('crosswalk'));
    const refOrgans = digitalObjects.filter((str) => str.startsWith('ref-organ/') && !str.includes('crosswalk'));
    for (const doString of refOrgans) {
      splitRefOrganCrosswalk(context, refOrganCrosswalk, doString);
    }
  }
}
