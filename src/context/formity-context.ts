import { createContext, ElementType } from 'react';

interface FormityContextValue {
  components: { [key: string]: ElementType };
}

const FormityContext = createContext<FormityContextValue | null>(null);

export default FormityContext;

export { FormityContextValue };
