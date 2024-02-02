import { Value } from 'mongu';

import { JsonList } from '../types/json';
import { Position } from '../types/position';

import { Point, PointForm, PointVariables, PointReturn } from './point';

import { ElementList, ElementFlow, ElementItem } from './element';

import { Navigate } from './navigate';

type PointStep = PointForm | PointReturn | PointVariables;
type PointStop = PointForm | PointReturn;

/**
 * This class contains all the logic to get access to the initial and next points.
 */
class Form {
  private readonly element: ElementList;

  constructor(json: JsonList) {
    this.element = new ElementList(json);
  }

  /**
   * It returns the initial form point.
   * @returns The initial form point.
   */
  initial(): PointForm {
    const positions = this.initialPositionsOrThrow(this.element);
    const point = Point.create(this.element, positions) as PointStep;
    return this.toPointForm(point);
  }

  /**
   * It returns the form point with the default values changed and the next form point or return point.
   * @param point The form point.
   * @param values The values.
   * @returns The form point and the next form point or return point.
   */
  next(
    point: PointForm,
    values: { [key: string]: Value }
  ): [PointForm, PointStop] {
    const currentPoint = point.setDefaultValues(values);
    const nextPoint = this.toPointStop(
      this.nextPointStep(currentPoint.withVariables(values))
    );
    return [currentPoint, nextPoint];
  }

  /**
   * It returns the initial positions or throws an error if there are no initial positions.
   * @param element The element flow.
   * @returns The initial positions.
   */
  private initialPositionsOrThrow(element: ElementFlow): Position[] {
    const positions = this.initialPositions(element);
    if (positions.length === 0) throw new Error('The form is not valid');
    return positions;
  }

  /**
   * It returns the initial positions or an empty list if there are no initial positions.
   * @param element The element flow.
   * @returns The initial positions or an empty list if there are no initial positions.
   */
  private initialPositions(element: ElementFlow): Position[] {
    let position = Navigate.down(element);
    while (position !== null) {
      const positions = this.initialPositionsFromPosition(element, position);
      if (positions.length > 0) return positions;
      position = Navigate.next(element, position);
    }
    return [];
  }

  /**
   * It returns the initial positions from the given position or an empty list if there are no initial positions.
   * @param element The element flow.
   * @param position The position.
   * @returns The initial positions from the given position or an empty list if there are no initial positions.
   */
  private initialPositionsFromPosition(
    element: ElementFlow,
    position: Position
  ): Position[] {
    const child = element.get([position]);
    if (child instanceof ElementItem) return [position];
    const positions = this.initialPositions(child as ElementFlow);
    if (positions.length > 0) return [position, ...positions];
    return [];
  }

  /**
   * It returns the current or next form point or throws an error if there is no form point.
   * @param point The step point.
   * @returns The current or next form point.
   */
  private toPointForm(point: PointStep): PointForm {
    const nextPoint = this.toPointStop(point);
    if (nextPoint instanceof PointForm) return nextPoint;
    throw new Error('The form is not valid');
  }

  /**
   * It returns the current or next stop point from the given step point.
   * @param point The step point.
   * @returns The stop point.
   */
  private toPointStop(point: PointStep): PointStop {
    let nextPoint = point;
    while (nextPoint instanceof PointVariables) {
      nextPoint = this.nextPointStep(nextPoint);
    }
    return nextPoint as PointStop;
  }

  /**
   * It returns the next step point from the given step point.
   * @param point The step point.
   * @returns The next step point.
   */
  private nextPointStep(point: PointStep): PointStep {
    return this.nextPoint(this.nextPointVariables(point));
  }

  /**
   * It returns the step point with the new variables if the given point is a variables point. Otherwise, it returns the given point.
   * @param point The step point.
   * @returns The step point with the new variables or the given point.
   */
  private nextPointVariables(point: PointStep): PointStep {
    return point instanceof PointVariables
      ? point.withVariables(point.value)
      : point;
  }

  /**
   * It returns the next step point.
   * @param point The point.
   * @returns The next step point.
   */
  private nextPoint(point: Point): PointStep {
    const nextPoint = this.nextPointFlow(point);
    if (nextPoint) return nextPoint;
    return this.nextPoint(this.parentPoint(point));
  }

  /**
   * It returns the next step point inside the current flow or null if there is no next step point.
   * @param point The point.
   * @returns The next step point inside the current flow or null if there is no next step point.
   */
  private nextPointFlow(point: Point): PointStep | null {
    const next = this.nextPointFlowNext(point);
    if (next) {
      const down = this.nextPointFlowDown(next);
      if (down) return down;
      return this.nextPointFlow(next);
    }
    return null;
  }

  /**
   * It returns the next point inside the current flow (without going down) or null if there is no next point.
   * @param point The point.
   * @returns The next point inside the current flow (without going down) or null if there is no next point.
   */
  private nextPointFlowNext(point: Point): Point | null {
    const flow = this.element.get(point.parentPositions) as ElementFlow;
    const position = Navigate.next(flow, point.position, point.variables);
    if (position !== null) {
      const positions = [...point.parentPositions, position];
      return Point.create(this.element, positions, point.variables);
    }
    return null;
  }

  /**
   * It returns the next point inside the current flow (going down) or null if there is no next point.
   * @param point The point.
   * @returns The next point inside the current flow (going down) or null if there is no next point.
   */
  private nextPointFlowDown(point: Point): PointStep | null {
    const element = this.element.get(point.positions);
    if (element instanceof ElementFlow) {
      const position = Navigate.down(element, point.variables);
      if (position !== null) {
        const positions = [...point.positions, position];
        const next = Point.create(this.element, positions, point.variables);
        const nextDown = this.nextPointFlowDown(next);
        if (nextDown) return nextDown;
        return this.nextPointFlow(next);
      }
      return null;
    }
    return point as PointStep;
  }

  /**
   * It returns the parent point.
   * @param point The point.
   * @returns The parent point.
   */
  private parentPoint(point: Point): Point {
    try {
      return Point.create(this.element, point.parentPositions, point.variables);
    } catch {
      throw new Error('The form is not valid');
    }
  }
}

export default Form;
