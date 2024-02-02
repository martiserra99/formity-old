import { Value } from 'mongu';

type Json = JsonFlow | JsonItem;
type JsonFlow = JsonList | JsonCond | JsonLoop;
type JsonList = (JsonCond | JsonLoop | JsonItem)[];
type JsonCond = { cond: { if: Value; then: JsonList; else: JsonList } };
type JsonLoop = { loop: { while: Value; do: JsonList } };
type JsonItem = JsonForm | JsonReturn | JsonVariables;
type JsonForm = { form: Value };
type JsonReturn = { return: Value };
type JsonVariables = { variables: Value };

export {
  Json,
  JsonFlow,
  JsonList,
  JsonCond,
  JsonLoop,
  JsonItem,
  JsonForm,
  JsonReturn,
  JsonVariables,
};
