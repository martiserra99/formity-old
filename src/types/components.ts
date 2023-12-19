import { Object, Value } from 'mongu';
import { ReactNode } from 'react';
import { UseFormProps } from 'react-hook-form';

import { JsonList } from './json';
import { FormityContextValue } from './context';

export type Components = FormityContextValue['components'];

export interface FormityProviderProps {
  components: Components;
  children: ReactNode;
}

export type Json = JsonList;
export type Result = Value;

export interface FormityProps {
  form: Json;
  onSubmit: (result: Result) => void;
  className?: string;
}

export interface FormityFormProps {
  defaultValues: UseFormProps['defaultValues'];
  resolver: UseFormProps['resolver'];
  onSubmit: (values: Object<Value>) => void;
  onBack: () => void;
  children: ReactNode;
  className?: string;
}
