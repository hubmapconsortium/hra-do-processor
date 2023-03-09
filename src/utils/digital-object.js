export function getDigitalObjectInformation(path) {
  const doString = path.split('/').slice('-3').join('/');
  const [type, name, version] = doString.split('/');
  return {
    path,
    doString,
    type,
    name,
    version,
  };
}
