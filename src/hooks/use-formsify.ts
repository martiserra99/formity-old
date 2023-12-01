import { useContext } from 'react';

import { FormsifyContextValue } from '../types/context';

import FormsifyContext from '../context/formsify-context';

/**
 * It is the hook to get the context.
 */
function useFormsify(): FormsifyContextValue {
  const value = useContext(FormsifyContext);
  if (value === null) {
    throw new Error(
      'useFormsifyContext must be used within a FormsifyProvider'
    );
  }
  return value;
}

export default useFormsify;
