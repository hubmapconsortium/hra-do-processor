import sh from 'shelljs';
import { writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import chalk from 'chalk';

export function throwOnError(command, message) {
  const response = sh.exec(command);
  const success = response.code !== 1;
  if (!success) {
    throw new Error(message);
  }
}

export function logOnError(command, message, { errorFile, errorParser }) {
  const response = sh.exec(command, { silent: true });
  const { stdout, stderr, code } = response;
  const success = code !== 1;
  if (!success) {
    let errorMessage = message;
    if (stderr !== '') {
      if (errorParser) {
        errorMessage = errorParser(stderr);
      }
    } else if (stdout !== '') {
      if (errorParser) {
        errorMessage = errorParser(stdout);
      }
    }
    sh.rm('-f', errorFile); // Clear previous errors file
    writeFileSync(errorFile, dump(errorMessage));
    console.log(chalk.red(message));
  }
  return success;
}