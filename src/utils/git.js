import sh from 'shelljs';

export function getVersionTag(location=".") {
  const response = sh.exec(`cd ${location} && git describe --tags --abbrev=0`);
  const { stdout, code } = response;
  return (code === 1) ? null : stdout.trim();
}

export function getCodeRepository(location=".") {
  const response = sh.exec(`cd ${location} && git ls-remote --get-url origin`);
  const { stdout, code } = response;
  return (code === 1) ? null : stdout.replace(".git", "").trim();  
}

export function getCommitUrl(location=".") {
  const response = sh.exec(`cd ${location} && git rev-parse HEAD`);
  const { stdout, code } = response;
  if (code === 1) {
  	return null;
  } else {
  	const codeRepository = getCodeRepository(location);
  	return (codeRepository === null) ? null : `${codeRepository}/commit/${stdout}`.trim();
  }
}