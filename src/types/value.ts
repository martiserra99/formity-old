import { Value } from 'mongu';

type ValueForm = {
  defaultValues: { [key: string]: Value };
  resolver: { [key: string]: [Value, string][] };
  render: Value;
};
type ValueReturn = Value;
type ValueVariables = { [key: string]: Value };

export { ValueForm, ValueReturn, ValueVariables };
