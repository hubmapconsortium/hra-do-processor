import sh from 'shelljs';

export function throwOnError(command, message) {
  const response = sh.exec(command);
  const success = response.code !== 1;
  if (!success) {
    throw new Error(message);
  }
}