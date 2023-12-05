import { createContext } from 'react';

import { FormityFormContextValue } from '../types/context';

const FormityFormContext = createContext<FormityFormContextValue | null>(null);

export default FormityFormContext;
