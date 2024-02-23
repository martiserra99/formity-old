import { Value } from 'mongu';

/**
 * It represents the union of list, condition, loop, form, return and variables.
 */
type Json = JsonFlow | JsonItem;

/**
 * It represents the union of list, condition and loop.
 */
type JsonFlow = JsonList | JsonCond | JsonLoop;

/**
 * It represents a list.
 */
type JsonList = (JsonCond | JsonLoop | JsonItem)[];

/**
 * It represents a condition.
 */
type JsonCond = { cond: { if: Value; then: JsonList; else: JsonList } };

/**
 * It represents a loop.
 */
type JsonLoop = { loop: { while: Value; do: JsonList } };

/**
 * It represents the union of form, return and variables.
 */
type JsonItem = JsonForm | JsonReturn | JsonVariables;

/**
 * It represents a form.
 */
type JsonForm = { form: Value };

/**
 * It represents what is returned.
 */
type JsonReturn = { return: Value };

/**
 * It represents variables.
 */
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
