import React, { ReactNode } from 'react';

import FormityContext, {
  FormityContextValue,
} from '../context/formity-context';

export interface FormityProviderProps {
  components: FormityContextValue['components'];
  children: ReactNode;
}

/**
 * It is a component that provides the form components that will be used.
 */
function FormityProvider({ components, children }: FormityProviderProps) {
  return (
    <FormityContext.Provider value={{ components }}>
      {children}
    </FormityContext.Provider>
  );
}

export default FormityProvider;
