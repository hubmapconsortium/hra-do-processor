export function getDigitalObjectInformation(path, purlIri) {
  const doString = path.split('/').slice('-3').join('/');
  const [type, name, version] = doString.split('/');
  return {
    iri: `${purlIri}${type}/${name}`,
    path,
    doString,
    type,
    name,
    version,
  };
}
