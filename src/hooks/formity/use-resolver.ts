import { Object, Value } from 'mongu';

import { mongu } from 'mongu';

import { ValueForm } from '../../types/value';

function useResolver(form: ValueForm) {
  return (values: Object<Value>) => {
    const errors: Object<{ type: string; message: string }> = {};
    for (const [key, validations] of Object.entries(form.resolver)) {
      const result = validations.find(
        ([validation]) => mongu(validation, values) === false
      );
      if (result) errors[key] = { type: 'validation', message: result[1] };
    }
    return { values, errors };
  };
}

export default useResolver;
