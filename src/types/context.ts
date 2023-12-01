import { ElementType } from 'react';

export interface FormsifyContextValue {
  components: { [key: string]: ElementType };
}

export interface FormsifyFormContextValue {
  onBack: () => void;
}
