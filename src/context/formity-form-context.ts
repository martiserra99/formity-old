import { createContext } from 'react';

interface FormityFormContextValue {
  onBack: () => void;
}

const FormityFormContext = createContext<FormityFormContextValue | null>(null);

export default FormityFormContext;

export { FormityFormContextValue };
