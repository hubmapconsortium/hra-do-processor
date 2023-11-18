import sh from 'shelljs';

export function getVersionTag() {
  const response = sh.exec("git describe --tags --abbrev=0");
  const { stdout, code } = response;
  return (code === 1) ? null : stdout.trim();
}

export function getCodeRepository() {
  const response = sh.exec("git ls-remote --get-url origin");
  const { stdout, code } = response;
  return (code === 1) ? null : stdout.replace(".git", "").trim();  
}

export function getCommitUrl() {
  const response = sh.exec("git rev-parse HEAD");
  const { stdout, code } = response;
  if (code === 1) {
  	return null;
  } else {
  	const codeRepository = getCodeRepository();
  	return (codeRepository === null) ? null : `${codeRepository}/commit/${stdout}`.trim();
  }
}