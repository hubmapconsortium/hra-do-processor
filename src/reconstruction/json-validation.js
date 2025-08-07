
import { logValidationErrors as logErrors } from './validation-logging.js';


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

// Validate structural equality (keys, types, nested structure)
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

// Validate semantic equality (actual values)
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

  // Handle arrays (order-independent)
  if (Array.isArray(obj1)) {
    validateArrayValues(obj1, obj2, path, errors);
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

// Check using set comparison to see if the arrays have the same elements.
function validateArrayValues(arr1, arr2, path, errors) {
  // Skip if arrays have different lengths (already caught by structural validation)
  if (arr1.length !== arr2.length) {
    return;
  }

  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  // Find elements missing in each array
  const missingInArr2 = [...set1].filter(item => !set2.has(item));
  const missingInArr1 = [...set2].filter(item => !set1.has(item));

  missingInArr2.forEach(item => {
    errors.push({
      type: 'semantic',
      path: path,
      message: `Array element missing in second array: "${item}"`
    });
  });

  missingInArr1.forEach(item => {
    errors.push({
      type: 'semantic', 
      path: path,
      message: `Array element missing in first array: "${item}"`
    });
  });
}

function getObjectType(obj) {
  if (obj === null) return 'null';
  if (Array.isArray(obj)) return 'array';
  return typeof obj;
}

export function logValidationErrors(errors, context, file1Path = '', file2Path = '') {
  logErrors(errors, context, file1Path, file2Path);
}