import { Object, Value } from 'mongu';

export type ValueForm = {
  defaultValues: Object<Value>;
  resolver: Object<[Value, string][]>;
  render: Value;
};

export type ValueReturn = Value;

export type ValueVariables = Object<Value>;
