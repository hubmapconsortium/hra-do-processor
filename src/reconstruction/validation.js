
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { error } from '../utils/logging.js';


export function compareObjects(obj1, obj2, options = {}) {
  const errors = [];
  const path = options.rootPath || '';

  // Structural validation
  validateStructure(obj1, obj2, path, errors);
  
  // Semantic validation
  validateValues(obj1, obj2, path, errors);

  return {
    hasErrors: errors.length > 0,
    errors: errors,
    errorCount: errors.length
  };
}

/**
 * Validate structural equality (keys, types, nested structure)
 */
function validateStructure(obj1, obj2, path, errors) {
  // Check for null/undefined mismatches
  if ((obj1 == null) !== (obj2 == null)) {
    errors.push({
      type: 'structural',
      path: path,
      message: `Null/undefined mismatch: ${obj1} vs ${obj2}`
    });
    return;
  }

  if (obj1 == null && obj2 == null) {
    return;
  }

  // Check type mismatch
  const type1 = getObjectType(obj1);
  const type2 = getObjectType(obj2);

  if (type1 !== type2) {
    errors.push({
      type: 'structural',
      path: path,
      message: `Type mismatch: ${type1} vs ${type2}`
    });
    return;
  }

  // Handle arrays
  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) {
      errors.push({
        type: 'structural',
        path: path,
        message: `Array length mismatch: ${obj1.length} vs ${obj2.length}`
      });
    }
    
    // Recursively validate array elements
    const maxLength = Math.max(obj1.length, obj2.length);
    for (let i = 0; i < maxLength; i++) {
      const newPath = `${path}[${i}]`;
      if (i < obj1.length && i < obj2.length) {
        validateStructure(obj1[i], obj2[i], newPath, errors);
      }
    }
    return;
  }

  // Handle objects
  if (type1 === 'object') {
    const keys1 = Object.keys(obj1).sort();
    const keys2 = Object.keys(obj2).sort();

    // Check for missing keys
    const missingInObj2 = keys1.filter(key => !keys2.includes(key));
    const missingInObj1 = keys2.filter(key => !keys1.includes(key));

    missingInObj2.forEach(key => {
      errors.push({
        type: 'structural',
        path: `${path}.${key}`,
        message: `Key missing in second object: ${key}`
      });
    });

    missingInObj1.forEach(key => {
      errors.push({
        type: 'structural',
        path: `${path}.${key}`,
        message: `Key missing in first object: ${key}`
      });
    });

    // Recursively validate common keys
    const commonKeys = keys1.filter(key => keys2.includes(key));
    commonKeys.forEach(key => {
      const newPath = path ? `${path}.${key}` : key;
      validateStructure(obj1[key], obj2[key], newPath, errors);
    });
  }
}

/**
 * Validate semantic equality (actual values)
 */
function validateValues(obj1, obj2, path, errors) {
  // Skip if structural validation already failed
  if (obj1 == null || obj2 == null) {
    return;
  }

  const type1 = getObjectType(obj1);
  const type2 = getObjectType(obj2);

  if (type1 !== type2) {
    return; // Already caught by structural validation
  }

  // Handle primitive values
  if (type1 === 'string' || type1 === 'number' || type1 === 'boolean') {
    if (obj1 !== obj2) {
      errors.push({
        type: 'semantic',
        path: path,
        message: `Value mismatch: "${obj1}" vs "${obj2}"`
      });
    }
    return;
  }

  // Handle arrays
  if (Array.isArray(obj1)) {
    const minLength = Math.min(obj1.length, obj2.length);
    for (let i = 0; i < minLength; i++) {
      const newPath = `${path}[${i}]`;
      validateValues(obj1[i], obj2[i], newPath, errors);
    }
    return;
  }

  // Handle objects
  if (type1 === 'object') {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    const commonKeys = keys1.filter(key => keys2.includes(key));

    commonKeys.forEach(key => {
      const newPath = path ? `${path}.${key}` : key;
      validateValues(obj1[key], obj2[key], newPath, errors);
    });
  }
}

/**
 * Get consistent type string for objects
 */
function getObjectType(obj) {
  if (obj === null) return 'null';
  if (Array.isArray(obj)) return 'array';
  return typeof obj;
}


export function logValidationErrors(errors, context, file1Path = '', file2Path = '') {
  if (!errors || errors.length === 0) {
    return;
  }

  try {
    const doPath = resolve(context.selectedDigitalObject.path);
    const logPath = resolve(doPath, 'reconstructed', 'validation-error.log');

    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message: 'YAML validation failed',
      details: {
        structural_errors: errors.filter(e => e.type === 'structural'),
        semantic_errors: errors.filter(e => e.type === 'semantic'),
        file1: file1Path,
        file2: file2Path,
        total_errors: errors.length
      }
    };

    writeFileSync(logPath, JSON.stringify(logEntry, null, 2));
  } catch (err) {
    error(`Failed to write validation error log: ${err.message}`);
  }
}