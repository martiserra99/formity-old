import { createContext } from 'react';

import { Components } from '../types';

interface FormityContextValue {
  components: Components;
}

const FormityContext = createContext<FormityContextValue | null>(null);

export default FormityContext;

export { FormityContextValue };
