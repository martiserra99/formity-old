import { Value } from 'mongu';

export type ValueForm = {
  defaultValues: { [key: string]: Value };
  resolver: { [key: string]: [Value, string][] };
  render: Value;
};

export type ValueReturn = Value;

export type ValueVariables = { [key: string]: Value };
