import { Object as Obj, Value } from 'mongu';
import { ReactNode } from 'react';
import { UseFormProps } from 'react-hook-form';

import { JsonList } from './json';
import { FormsifyContextValue } from './context';

export type Components = FormsifyContextValue['components'];

export interface FormsifyProviderProps {
  components: Components;
  children: ReactNode;
}

export type Json = JsonList;
export type Result = Value;

export interface FormsifyProps {
  json: Json;
  onSubmit: (result: Result) => void;
  className?: string;
}

export interface FormsifyFormProps {
  defaultValues: UseFormProps['defaultValues'];
  resolver: UseFormProps['resolver'];
  onSubmit: (values: Obj<Value>) => void;
  onBack: () => void;
  children: ReactNode;
  className?: string;
}
