import { Value } from 'mongu';

import {
  Json,
  JsonFlow,
  JsonList,
  JsonCond,
  JsonLoop,
  JsonItem,
  JsonForm,
  JsonReturn,
  JsonVariables,
} from '../types/json';

import {
  Position,
  PositionList,
  PositionCond,
  PositionLoop,
} from '../types/position';

/**
 * This class represents a json element.
 */
export abstract class Element<T extends Json = Json> {
  protected json: T;

  constructor(json: T) {
    this.json = json;
  }

  /**
   * It creates an element from a json.
   * @param json A json.
   * @returns An element.
   */
  protected static create(json: Json): Element {
    if (ElementList.is(json)) return new ElementList(json);
    if (ElementCond.is(json)) return new ElementCond(json);
    if (ElementLoop.is(json)) return new ElementLoop(json);
    if (ElementForm.is(json)) return new ElementForm(json);
    if (ElementReturn.is(json)) return new ElementReturn(json);
    if (ElementVariables.is(json)) return new ElementVariables(json);
    throw new Error('Invalid json object');
  }
}

/**
 * It is an element that contains other elements.
 */
export abstract class ElementFlow<
  T extends JsonFlow = JsonFlow,
  U extends Position = Position
> extends Element<T> {
  /**
   * It returns the element from the given positions.
   * @param positions A list of positions.
   * @returns An element.
   */
  get(positions: Position[]): Element {
    return positions.reduce((element: Element, position: Position) => {
      const elementFlow = element as ElementFlow;
      return elementFlow.getChild(position);
    }, this);
  }

  protected abstract getChild(position: U): Element;
}

/**
 * It is an element that represents a list.
 */
export class ElementList extends ElementFlow<JsonList, PositionList> {
  get length(): number {
    return this.json.length;
  }

  static is(json: Json): json is JsonList {
    return Array.isArray(json);
  }

  protected getChild(position: PositionList): Element {
    return Element.create(this.json[position]);
  }
}

/**
 * It is an element that represents a condition.
 */
export class ElementCond extends ElementFlow<JsonCond, PositionCond> {
  get cond() {
    return this.json.cond.if;
  }

  get thenLength() {
    return this.json.cond.then.length;
  }

  get elseLength() {
    return this.json.cond.else.length;
  }

  static is(json: Json): json is JsonCond {
    return 'cond' in json;
  }

  protected getChild(position: PositionCond): Element {
    return Element.create(this.json.cond[position[0]][position[1]]);
  }
}

/**
 * It is an element that represents a loop.
 */
export class ElementLoop extends ElementFlow<JsonLoop, PositionLoop> {
  get cond() {
    return this.json.loop.while;
  }

  get length() {
    return this.json.loop.do.length;
  }

  static is(json: Json): json is JsonLoop {
    return 'loop' in json;
  }

  protected getChild(position: PositionLoop): Element {
    return Element.create(this.json.loop.do[position]);
  }
}

/**
 * It is an element.
 */
export abstract class ElementItem<
  T extends JsonItem = JsonItem
> extends Element<T> {
  abstract get value(): Value;
}

/**
 * It is an element that represents a form.
 */
export class ElementForm extends ElementItem<JsonForm> {
  get value(): Value {
    return this.json.form;
  }

  static is(json: Json): json is JsonForm {
    return 'form' in json;
  }
}

/**
 * It is an element that represents a return.
 */
export class ElementReturn extends ElementItem<JsonReturn> {
  get value(): Value {
    return this.json.return;
  }

  static is(json: Json): json is JsonReturn {
    return 'return' in json;
  }
}

/**
 * It is an element that represents variables.
 */
export class ElementVariables extends ElementItem<JsonVariables> {
  get value(): Value {
    return this.json.variables;
  }

  static is(json: Json): json is JsonVariables {
    return 'variables' in json;
  }
}
