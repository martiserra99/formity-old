import React, { ReactNode } from 'react';

import FormityContext from '../context/formity-context';

import { Components } from '../types';

interface FormityProviderProps {
  components: Components;
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

export { FormityProviderProps };
