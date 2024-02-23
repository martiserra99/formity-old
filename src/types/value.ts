import { Value } from 'mongu';

/**
 * It represents a form.
 */
type ValueForm = {
  defaultValues: { [key: string]: Value }; // Default values
  resolver: { [key: string]: [Value, string][] }; // Validation rules (expressions that evaluate to booleans, and error messages)
  render: Value[]; // What is rendered (we can only reference the available components)
};

/**
 * It represents what is returned.
 */
type ValueReturn = Value;

/**
 * It represents variables. Each property corresponds to a variable.
 */
type ValueVariables = { [key: string]: Value };

export { ValueForm, ValueReturn, ValueVariables };
