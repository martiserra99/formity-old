import React from 'react';

import { FormityProviderProps } from '../types/components';

import FormityContext from '../context/formity-context';

/**
 * It is the component to provide the context.
 */
function FormityProvider({ components, children }: FormityProviderProps) {
  return (
    <FormityContext.Provider value={{ components }}>
      {children}
    </FormityContext.Provider>
  );
}

export default FormityProvider;
