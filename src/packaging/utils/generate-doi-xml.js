import { readFileSync, writeFileSync } from 'fs';
import { Environment } from 'nunjucks';
import { resolve } from 'path';

// TODO: Factor these properties out
const TYPE_MAPPINGS = {
  model_mappings: {
    'asct-b': 'ASCT+B',
    '2d-ftu': '2D Reference FTU',
    omap: 'Organ Mapping Antibody Panels(OMAPs)',
    'ref-organ': '3D Reference Organs',
  },
  resource_mappings: { 'asct-b': 'Dataset', '2d-ftu': 'Image', omap: 'Dataset', 'ref-organ': 'Model' },
  resource_title_mappings: {
    'asct-b': 'ASCT+B Table',
    '2d-ftu': '2D reference human organ FTU object',
    omap: 'Organ Mapping Antibody Panel',
    'ref-organ': '3D reference human organ model',
  },
  cite_model_mappings: { 'asct-b': 'Data Table', '2d-ftu': '2D Data', omap: 'OMAP Tables', 'ref-organ': '3D Data' },
  cite_overall_model_mappings: {
    'asct-b': 'ASCT+B Tables',
    '2d-ftu': '2D Data',
    omap: 'OMAP Tables',
    'ref-organ': '3D Data',
  },
  extension_fixes: { ai: 'svg', xlsx: 'csv' }
};

export function renderDoiXml(templateFile, metadata) {
  const env = new Environment(undefined, { autoescape: false });
  env.addFilter('fileExtension', (str) => {
    str = Array.isArray(str) ? str[0] : str;
    const ext = str !== undefined ? str.slice(str.replace('.zip', '').lastIndexOf('.') + 1).replace(')', '') : '';
    return TYPE_MAPPINGS.extension_fixes[ext] || ext;
  });
  env.addFilter('mdLinkAsUrlOnly', (str) => str.slice(str.lastIndexOf('(') + 1, str.lastIndexOf(')') - 1));
  env.addFilter('mdLinkAsTitleOnly', (str) =>
    str.indexOf('CC BY') !== -1
      ? 'Creative Commons Attribution 4.0 International (CC BY 4.0)'
      : str.slice(str.lastIndexOf('[') + 1, str.lastIndexOf(']')).replace(/\*/g, '')
  );
  env.addFilter('year', (str) => String(str || new Date().getFullYear()).match(/\d\d\d\d/)[0])
  const template = readFileSync(templateFile).toString();
  return env.renderString(template, { ...TYPE_MAPPINGS, ...metadata });
}

export function writeDoiXml(context, metadata) {
  const obj = context.selectedDigitalObject;
  const templateFile = resolve(context.processorHome, 'src/packaging/templates/doi-xml.njk');
  const xmlString = renderDoiXml(templateFile, metadata);
  const doiXmlFile = resolve(obj.path, 'packaged/doi.xml');
  writeFileSync(doiXmlFile, xmlString);
}
