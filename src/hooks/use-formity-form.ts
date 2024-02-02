import { useContext } from 'react';

import FormityFormContext from '../context/formity-form-context';

/**
 * It is the hook to get the formity form context.
 * @returns The formity form context.
 */
function useFormityForm() {
  const context = useContext(FormityFormContext);
  if (!context) {
    throw new Error('useFormityForm must be used within a FormityForm');
  }
  return context;
}

export default useFormityForm;
