export function getDigitalObjectInformation(path, baseIri) {
  const doString = path.split('/').slice('-3').join('/');
  const [type, name, version] = doString.split('/');
  return {
    iri: `${baseIri}${doString}`,
    path,
    doString,
    type,
    name,
    version,
  };
}
