import { mongu, Value } from 'mongu';

import { isObject } from '../utils';

import { Position } from '../types/position';
import { ValueForm, ValueReturn, ValueVariables } from '../types/value';

import {
  ElementFlow,
  ElementForm,
  ElementReturn,
  ElementVariables,
} from './element';

/**
 * This class represents a point in the form.
 */
class Point {
  public positions: Position[];
  public variables: { [key: string]: Value };

  constructor(positions: Position[], variables: { [key: string]: Value }) {
    this.positions = positions;
    this.variables = variables;
  }

  /**
   * It returns the current position.
   */
  get position(): Position {
    if (this.positions.length === 0) throw new Error("Can't get position");
    return this.positions[this.positions.length - 1];
  }

  /**
   * It returns the positions of the parent point.
   */
  get parentPositions(): Position[] {
    if (this.positions.length === 0) throw new Error("Can't get positions");
    return this.positions.slice(0, this.positions.length - 1);
  }

  /**
   * It creates a point.
   * @param elementFlow The element flow.
   * @param positions The positions.
   * @param variables The variables.
   * @returns The point.
   */
  static create(
    elementFlow: ElementFlow,
    positions: Position[],
    variables: { [key: string]: Value } = {}
  ): Point {
    const element = elementFlow.get(positions);
    if (element instanceof ElementForm) {
      return PointForm.new(element, positions, variables);
    }
    if (element instanceof ElementReturn) {
      return PointReturn.new(element, positions, variables);
    }
    if (element instanceof ElementVariables) {
      return PointVariables.new(element, positions, variables);
    }
    return new Point(positions, variables);
  }

  /**
   * It returns a new point with the new variables added.
   * @param variables The variables.
   * @returns The point with the new variables added.
   */
  withVariables(variables: { [key: string]: Value }): Point {
    return new Point(this.positions, { ...this.variables, ...variables });
  }
}

/**
 * It is a point that represents a form.
 */
class PointForm extends Point {
  constructor(
    public value: ValueForm,
    positions: Position[],
    variables: { [key: string]: Value }
  ) {
    super(positions, variables);
  }

  static new(
    element: ElementForm,
    positions: Position[],
    variables: { [key: string]: Value }
  ): PointForm {
    const value = mongu(element.value, variables);
    assertValueForm(value);
    return new PointForm(value, positions, variables);
  }

  setDefaultValues(values: { [key: string]: Value }) {
    return new PointForm(
      { ...this.value, defaultValues: values },
      this.positions,
      this.variables
    );
  }

  withVariables(variables: { [key: string]: Value }) {
    return new PointForm(this.value, this.positions, {
      ...this.variables,
      ...variables,
    });
  }
}

function assertValueForm(value: Value): asserts value is ValueForm {
  if (isObject(value)) return;
  throw new Error('The form is not valid');
}

/**
 * It is a point that represents a return.
 */
class PointReturn extends Point {
  constructor(
    public value: ValueReturn,
    positions: Position[],
    variables: { [key: string]: Value }
  ) {
    super(positions, variables);
  }

  static new(
    element: ElementReturn,
    positions: Position[],
    variables: { [key: string]: Value }
  ): PointReturn {
    return new PointReturn(
      mongu(element.value, variables),
      positions,
      variables
    );
  }

  withVariables(variables: { [key: string]: Value }) {
    return new PointReturn(this.value, this.positions, {
      ...this.variables,
      ...variables,
    });
  }
}

/**
 * It is a point that represents variables.
 */
class PointVariables extends Point {
  constructor(
    public value: ValueVariables,
    positions: Position[],
    variables: { [key: string]: Value }
  ) {
    super(positions, variables);
  }

  static new(
    element: ElementVariables,
    positions: Position[],
    variables: { [key: string]: Value }
  ): PointVariables {
    const value = mongu(element.value, variables);
    this.assertValueVariables(value);
    return new PointVariables(value, positions, variables);
  }

  private static assertValueVariables(
    value: Value
  ): asserts value is ValueVariables {
    if (isObject(value)) return;
    throw new Error('The form is not valid');
  }

  withVariables(variables: { [key: string]: Value }) {
    return new PointVariables(this.value, this.positions, {
      ...this.variables,
      ...variables,
    });
  }
}

export {
  Point,
  PointForm,
  PointReturn,
  PointVariables,
  ValueForm,
  ValueReturn,
  ValueVariables,
};
