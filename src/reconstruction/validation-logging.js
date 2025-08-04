import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { error } from '../utils/logging.js';

export function logValidationIssues(issues, context, file1Path = '', file2Path = '', options = {}) {
  if (!issues || issues.length === 0) {
    return;
  }

  const {
    level = 'ERROR',
    message = 'Validation failed',
    logFileName = 'validation-error.log'
  } = options;

  try {
    const doPath = resolve(context.selectedDigitalObject.path);
    const logPath = resolve(doPath, 'reconstructed', logFileName);

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      details: {
        structural_errors: issues.filter(e => e.type === 'structural'),
        semantic_errors: issues.filter(e => e.type === 'semantic'),
        parse_errors: issues.filter(e => e.type === 'parse_error'),
        file1: file1Path,
        file2: file2Path,
        total_issues: issues.length
      }
    };

    writeFileSync(logPath, JSON.stringify(logEntry, null, 2));
  } catch (err) {
    error(`Failed to write validation log: ${err.message}`);
  }
}

export function logValidationErrors(errors, context, file1Path = '', file2Path = '') {
  logValidationIssues(errors, context, file1Path, file2Path, {
    level: 'ERROR',
    message: 'Validation failed',
    logFileName: 'validation-error.log'
  });
}

export function logValidationWarnings(warnings, context, file1Path = '', file2Path = '') {
  logValidationIssues(warnings, context, file1Path, file2Path, {
    level: 'WARNING',
    message: 'Validation completed with warnings',
    logFileName: 'validation-warning.log'
  });
}