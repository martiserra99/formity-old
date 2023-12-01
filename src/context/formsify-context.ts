import { createContext } from 'react';

import { FormsifyContextValue } from '../types/context';

const FormsifyContext = createContext<FormsifyContextValue | null>(null);

export default FormsifyContext;
