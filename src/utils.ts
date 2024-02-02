import { Value } from 'mongu';

/**
 * It returns a boolean indicating if the value is an array.
 * @param value The value to be checked.
 * @returns A boolean indicating if the value is an array.
 */
function isArray(value: Value): value is Value[] {
  return Array.isArray(value);
}

/**
 * It returns a boolean indicating if the value is an object.
 * @param value The value to be checked.
 * @returns A boolean indicating if the value is an object.
 */
function isObject(value: Value): value is { [key: string]: Value } {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}

export { isArray, isObject };
