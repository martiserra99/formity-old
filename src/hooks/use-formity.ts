import { useContext } from 'react';

import FormityContext, {
  FormityContextValue,
} from '../context/formity-context';

/**
 * It is the hook to get the context.
 */
function useFormity(): FormityContextValue {
  const value = useContext(FormityContext);
  if (value === null) {
    throw new Error('useFormityContext must be used within a FormityProvider');
  }
  return value;
}

export default useFormity;
