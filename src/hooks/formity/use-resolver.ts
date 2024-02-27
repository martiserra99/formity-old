import { mongu, Value } from 'mongu';

import { ValueForm } from '../../types/value';

/**
 * It returns a resolver for the form.
 * @param form The form.
 * @returns The resolver.
 */
function useResolver(
  form: ValueForm
):
  | ((values: {
      [key: string]: Value;
    }) => {
      values: { [key: string]: Value };
      errors: { [key: string]: { type: string; message: string } };
    })
  | null {
  try {
    return (values: { [key: string]: Value }) => {
      const errors: { [key: string]: { type: string; message: string } } = {};
      for (const [key, validations] of Object.entries(form.resolver)) {
        const result = validations.find(([expr]) => !mongu(expr, values));
        if (result) errors[key] = { type: 'validation', message: result[1] };
      }
      return { values, errors };
    };
  } catch {
    return null;
  }
}

export default useResolver;
