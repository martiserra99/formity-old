import React from 'react';

import { FormsifyProviderProps } from '../types/components';

import FormsifyContext from '../context/formsify-context';

/**
 * It is the component to provide the context.
 */
function FormsifyProvider({ components, children }: FormsifyProviderProps) {
  return (
    <FormsifyContext.Provider value={{ components }}>
      {children}
    </FormsifyContext.Provider>
  );
}

export default FormsifyProvider;
