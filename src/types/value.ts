import { Object as Obj, Value } from 'mongu';

export type ValueForm = {
  defaultValues: Obj<Value>;
  resolver: Obj<[Value, string][]>;
  render: Value;
};

export type ValueReturn = Value;

export type ValueVariables = Obj<Value>;
