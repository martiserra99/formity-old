import { ElementType } from 'react';

export interface FormityContextValue {
  components: { [key: string]: ElementType };
}

export interface FormityFormContextValue {
  onBack: () => void;
}
