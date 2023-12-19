import { Object, Value } from 'mongu';

import { mongu } from 'mongu';

import { Position } from '../types/position';
import { ElementFlow } from './element';
import { ValueForm, ValueReturn, ValueVariables } from '../types/value';

import {
  ElementList,
  ElementCond,
  ElementLoop,
  ElementForm,
  ElementReturn,
  ElementVariables,
} from './element';

/**
 * This class represents a point in the execution.
 */
export abstract class Point {
  public positions: Position[];
  public variables: Object<Value>;

  constructor(positions: Position[], variables: Object<Value>) {
    this.positions = positions;
    this.variables = variables;
  }

  get currentPosition(): Position {
    return this.positions[this.positions.length - 1];
  }

  get previousPositions(): Position[] {
    return this.positions.slice(0, this.positions.length - 1);
  }

  static create(
    elementFlow: ElementFlow,
    positions: Position[],
    variables: Object<Value> = {}
  ): Point {
    const element = elementFlow.get(positions);

    if (element instanceof ElementList)
      return PointList.new(positions, variables);

    if (element instanceof ElementCond)
      return PointCond.new(positions, variables);

    if (element instanceof ElementLoop)
      return PointLoop.new(positions, variables);

    if (element instanceof ElementForm)
      return PointForm.new(element, positions, variables);

    if (element instanceof ElementReturn)
      return PointReturn.new(element, positions, variables);

    if (element instanceof ElementVariables)
      return PointVariables.new(element, positions, variables);

    throw new Error('Invalid element');
  }

  add(variables: Object<Value>): Point {
    return this.set({ ...this.variables, ...variables });
  }

  protected abstract set(variables: Object<Value>): Point;
}

/**
 * It is a point that represents a flow.
 */
export abstract class PointFlow extends Point {}

/**
 * It is a point that represents a list.
 */
export class PointList extends PointFlow {
  static new(positions: Position[], variables: Object<Value>): PointList {
    return new PointList(positions, variables);
  }

  protected set(variables: Object<Value>): PointList {
    return new PointList(this.positions, variables);
  }
}

/**
 * It is a point that represents a conditional.
 */
export class PointCond extends PointFlow {
  static new(positions: Position[], variables: Object<Value>): PointCond {
    return new PointCond(positions, variables);
  }

  protected set(variables: Object<Value>): PointCond {
    return new PointCond(this.positions, variables);
  }
}

/**
 * It is a point that represents a loop.
 */
export class PointLoop extends PointFlow {
  static new(positions: Position[], variables: Object<Value>): PointLoop {
    return new PointLoop(positions, variables);
  }

  protected set(variables: Object<Value>): PointLoop {
    return new PointLoop(this.positions, variables);
  }
}

/**
 * It is a point that represents an item.
 */
export abstract class PointItem<T> extends Point {
  constructor(
    public value: T,
    positions: Position[],
    variables: Object<Value>
  ) {
    super(positions, variables);
  }
}

/**
 * It is a point that represents a form.
 */
export class PointForm extends PointItem<ValueForm> {
  static new(
    element: ElementForm,
    positions: Position[],
    variables: Object<Value>
  ): PointForm {
    const value = mongu(element.value, variables) as ValueForm;
    return new PointForm(value, positions, variables);
  }

  defaultValues(values: Object<Value>) {
    const value = { ...this.value, defaultValues: values };
    return new PointForm(value, this.positions, this.variables);
  }

  protected set(variables: Object<Value>): PointForm {
    return new PointForm(this.value, this.positions, variables);
  }
}

/**
 * It is a point that represents a return.
 */
export class PointReturn extends PointItem<ValueReturn> {
  static new(
    element: ElementReturn,
    positions: Position[],
    variables: Object<Value>
  ): PointReturn {
    const value = mongu(element.value, variables) as ValueReturn;
    return new PointReturn(value, positions, variables);
  }

  protected set(variables: Object<Value>): PointReturn {
    return new PointReturn(this.value, this.positions, variables);
  }
}

/**
 * It is a point that represents variables.
 */
export class PointVariables extends PointItem<ValueVariables> {
  static new(
    element: ElementVariables,
    positions: Position[],
    variables: Object<Value>
  ): PointVariables {
    const value = mongu(element.value, variables) as ValueVariables;
    return new PointVariables(value, positions, variables);
  }

  protected set(variables: Object<Value>): PointVariables {
    return new PointVariables(this.value, this.positions, variables);
  }
}
