import { Object, Value } from 'mongu';

import { mongu } from 'mongu';

import { Position } from '../types/position';
import { ElementFlow } from './element';
import { ValueForm, ValueReturn, ValueVariables } from '../types/value';

import { ElementForm, ElementReturn, ElementVariables } from './element';

/**
 * This class represents a point in the execution.
 */
export class Point {
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

    if (element instanceof ElementForm)
      return PointForm.new(element, positions, variables);

    if (element instanceof ElementReturn)
      return PointReturn.new(element, positions, variables);

    if (element instanceof ElementVariables)
      return PointVariables.new(element, positions, variables);

    return new Point(positions, variables);
  }

  addVariables(variables: Object<Value>): Point {
    const vars = { ...this.variables, ...variables };
    return new Point(this.positions, vars);
  }
}

/**
 * It is a point that represents a form.
 */
export class PointForm extends Point {
  constructor(
    public value: ValueForm,
    positions: Position[],
    variables: Object<Value>
  ) {
    super(positions, variables);
  }

  static new(
    element: ElementForm,
    positions: Position[],
    variables: Object<Value>
  ): PointForm {
    const value = mongu(element.value, variables) as ValueForm;
    return new PointForm(value, positions, variables);
  }

  setDefaultValues(values: Object<Value>) {
    const value = { ...this.value, defaultValues: values };
    return new PointForm(value, this.positions, this.variables);
  }

  addVariables(variables: Object<Value>): PointForm {
    const vars = { ...this.variables, ...variables };
    return new PointForm(this.value, this.positions, vars);
  }
}

/**
 * It is a point that represents a return.
 */
export class PointReturn extends Point {
  constructor(
    public value: ValueReturn,
    positions: Position[],
    variables: Object<Value>
  ) {
    super(positions, variables);
  }

  static new(
    element: ElementReturn,
    positions: Position[],
    variables: Object<Value>
  ): PointReturn {
    const value = mongu(element.value, variables) as ValueReturn;
    return new PointReturn(value, positions, variables);
  }

  addVariables(variables: Object<Value>): PointReturn {
    const vars = { ...this.variables, ...variables };
    return new PointReturn(this.value, this.positions, vars);
  }
}

/**
 * It is a point that represents variables.
 */
export class PointVariables extends Point {
  constructor(
    public value: ValueVariables,
    positions: Position[],
    variables: Object<Value>
  ) {
    super(positions, variables);
  }

  static new(
    element: ElementVariables,
    positions: Position[],
    variables: Object<Value>
  ): PointVariables {
    const value = mongu(element.value, variables) as ValueVariables;
    return new PointVariables(value, positions, variables);
  }

  addVariables(variables: Object<Value>): PointVariables {
    const vars = { ...this.variables, ...variables };
    return new PointVariables(this.value, this.positions, vars);
  }
}
