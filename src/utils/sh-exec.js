import { writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import sh from 'shelljs';
import { error, more } from './logging.js';

export function throwOnError(command, message, errorParser=defaultParser) {
  const response = sh.exec(command);
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
    throw new Error(errorMessage);
  }
}

export function logOnError(command, message, { errorFile, errorParser=defaultParser }) {
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
    error(message);
    more(`Please review the errors at ${errorFile}`);
  }
  return success;
}

function defaultParser(message) {
  return message;
}