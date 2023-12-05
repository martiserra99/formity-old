import { createContext } from 'react';

import { FormityContextValue } from '../types/context';

const FormityContext = createContext<FormityContextValue | null>(null);

export default FormityContext;
