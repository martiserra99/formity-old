import { Object as Obj, Value } from 'mongu';

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
  public variables: Obj<Value>;

  constructor(positions: Position[], variables: Obj<Value>) {
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
    variables: Obj<Value> = {}
  ): Point {
    const element = elementFlow.get(positions);
    if (element instanceof ElementList)
      return PointList.new(element, positions, variables);
    if (element instanceof ElementCond)
      return PointCond.new(element, positions, variables);
    if (element instanceof ElementLoop)
      return PointLoop.new(element, positions, variables);
    if (element instanceof ElementForm)
      return PointForm.new(element, positions, variables);
    if (element instanceof ElementReturn)
      return PointReturn.new(element, positions, variables);
    if (element instanceof ElementVariables)
      return PointVariables.new(element, positions, variables);
    throw new Error('Invalid element');
  }

  abstract add(variables: Obj<Value>): Point;
}

/**
 * It is a point that represents a flow.
 */
export abstract class PointFlow extends Point {}

/**
 * It is a point that represents a list.
 */
export class PointList extends PointFlow {
  static new(
    _: ElementList,
    positions: Position[],
    variables: Obj<Value>
  ): PointList {
    return new PointList(positions, variables);
  }

  add(variables: Obj<Value>): PointList {
    return new PointList(this.positions, {
      ...this.variables,
      ...variables,
    });
  }
}

/**
 * It is a point that represents a conditional.
 */
export class PointCond extends PointFlow {
  static new(
    _: ElementCond,
    positions: Position[],
    variables: Obj<Value>
  ): PointCond {
    return new PointCond(positions, variables);
  }

  add(variables: Obj<Value>): PointCond {
    return new PointCond(this.positions, {
      ...this.variables,
      ...variables,
    });
  }
}

/**
 * It is a point that represents a loop.
 */
export class PointLoop extends PointFlow {
  static new(
    _: ElementLoop,
    positions: Position[],
    variables: Obj<Value>
  ): PointLoop {
    return new PointLoop(positions, variables);
  }

  add(variables: Obj<Value>): PointLoop {
    return new PointLoop(this.positions, {
      ...this.variables,
      ...variables,
    });
  }
}

/**
 * It is a point that represents an item.
 */
export abstract class PointItem<T> extends Point {
  constructor(public value: T, positions: Position[], variables: Obj<Value>) {
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
    variables: Obj<Value>
  ): PointForm {
    return new PointForm(
      mongu(element.value, variables) as ValueForm,
      positions,
      variables
    );
  }

  add(variables: Obj<Value>): PointForm {
    return new PointForm(this.value, this.positions, {
      ...this.variables,
      ...variables,
    });
  }

  defaultValues(values: Obj<Value>) {
    const value = { ...this.value, defaultValues: values };
    return new PointForm(value, this.positions, this.variables);
  }
}

/**
 * It is a point that represents a return.
 */
export class PointReturn extends PointItem<ValueReturn> {
  static new(
    element: ElementReturn,
    positions: Position[],
    variables: Obj<Value>
  ): PointReturn {
    return new PointReturn(
      mongu(element.value, variables) as ValueReturn,
      positions,
      variables
    );
  }

  add(variables: Obj<Value>): PointReturn {
    return new PointReturn(this.value, this.positions, {
      ...this.variables,
      ...variables,
    });
  }
}

/**
 * It is a point that represents variables.
 */
export class PointVariables extends PointItem<ValueVariables> {
  static new(
    element: ElementVariables,
    positions: Position[],
    variables: Obj<Value>
  ): PointVariables {
    return new PointVariables(
      mongu(element.value, variables) as ValueVariables,
      positions,
      variables
    );
  }

  add(variables: Obj<Value>): PointVariables {
    return new PointVariables(this.value, this.positions, {
      ...this.variables,
      ...variables,
    });
  }
}
