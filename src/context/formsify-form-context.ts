import { createContext } from 'react';

import { FormsifyFormContextValue } from '../types/context';

const FormsifyFormContext = createContext<FormsifyFormContextValue | null>(
  null
);

export default FormsifyFormContext;
