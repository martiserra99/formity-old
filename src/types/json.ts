import { Value } from 'mongu';

export type Json = JsonFlow | JsonItem;
export type JsonFlow = JsonList | JsonCond | JsonLoop;
export type JsonList = (JsonCond | JsonLoop | JsonItem)[];
export type JsonCond = { cond: { if: Value; then: JsonList; else: JsonList } };
export type JsonLoop = { loop: { while: Value; do: JsonList } };
export type JsonItem = JsonForm | JsonReturn | JsonVariables;
export type JsonForm = { form: Value };
export type JsonReturn = { return: Value };
export type JsonVariables = { variables: Value };
