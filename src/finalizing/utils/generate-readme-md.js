import { readFileSync, writeFileSync } from 'fs';
import { Environment } from 'nunjucks';
import { resolve } from 'path';

// TODO: Factor these properties out
const TYPE_MAPPINGS = {
  cite_model_mappings: { 'asct-b': 'Data Table', '2d-ftu': '2D Data', omap: 'OMAP Tables', 'ref-organ': '3D Data' }
};

export function renderReadmeMd(templateFile, metadata) {
  const env = new Environment(undefined, { autoescape: false });

  env.addFilter('authorList', (list) => {
    return list?.map(a => a.fullName).join('; ') ?? '';
  });
  env.addFilter('orcidList', (list) => {
    return list?.map(a => `[${a.orcid}](https://orcid.org/${a.orcid})`).join('; ') ?? '';
  });
  env.addFilter('downloadLinks', (datatable) => {
    return datatable?.map((str) => {
      const ext = str !== undefined ? str.slice(str.replace('.zip', '').lastIndexOf('.') + 1).replace(')', '') : '';
      return `[${ext.toUpperCase()}](assets/${str})`
    }).join(' ');
  }) ?? '';
  const template = readFileSync(templateFile).toString();
  return env.renderString(template, { ...TYPE_MAPPINGS, ...metadata });
}

export function writeReadmeMd(context, metadata) {
  const obj = context.selectedDigitalObject;
  const templateFile = resolve(context.processorHome, 'src/finalizing/templates/readme-md.njk');
  const mdString = renderReadmeMd(templateFile, metadata);
  const mdFile = resolve(context.deploymentHome, obj.doString, 'README.md');
  writeFileSync(mdFile, mdString);
}
