import { Value } from 'mongu';

import { JsonList } from '../types/json';
import { Position } from '../types/position';

import { Point, PointForm, PointVariables, PointReturn } from './point';

import { ElementList, ElementFlow, ElementItem } from './element';

import { Navigate } from './navigate';

type StepPoint = PointForm | PointReturn | PointVariables;
type StopPoint = PointForm | PointReturn;

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
   *
   * @returns The initial form point.
   */
  initial(): PointForm {
    const positions = this._initialPositions(this.element);
    const point = Point.create(this.element, positions) as StepPoint;
    return this._nextStopPoint(point) as PointForm;
  }

  /**
   * It returns the form point with the default values changed to the values and the next form point or return point.
   *
   * @param point The form point.
   * @param values The values.
   * @returns The form point and the next form point or return point.
   */
  next(
    point: PointForm,
    values: { [key: string]: Value }
  ): [PointForm, StopPoint] {
    const currPoint = point.setDefaultValues(values);
    const nextPoint = this._nextStopPoint(
      this._nextStepPoint(currPoint.add(values))
    );
    return [currPoint, nextPoint];
  }

  _initialPositions(element: ElementFlow): Position[] {
    let position = Navigate.down(element);
    while (position !== null) {
      const positions = this._initialPositionsFromPosition(element, position);
      if (positions.length > 0) return positions;
      position = Navigate.next(element, position);
    }
    return [];
  }

  _initialPositionsFromPosition(
    element: ElementFlow,
    position: Position
  ): Position[] {
    const child = element.get([position]);
    if (child instanceof ElementItem) return [position];
    const positions = this._initialPositions(child as ElementFlow);
    if (positions.length > 0) return [position, ...positions];
    return [];
  }

  _nextStopPoint(point: StepPoint): StopPoint {
    let nextPoint = point;
    while (nextPoint instanceof PointVariables) {
      nextPoint = this._nextStepPoint(nextPoint);
    }
    return nextPoint as StopPoint;
  }

  _nextStepPoint(point: StepPoint): StepPoint {
    return this._nextPoint(this._nextPointVariables(point));
  }

  _nextPointVariables(point: StepPoint): StepPoint {
    return point instanceof PointVariables
      ? point.add(point.value as { [key: string]: Value })
      : point;
  }

  _nextPoint(point: Point): StepPoint {
    const nextPoint = this._nextPointLevel(point);
    if (nextPoint) return nextPoint;
    return this._nextPoint(this._upPoint(point));
  }

  _nextPointLevel(point: Point): StepPoint | null {
    const next = this._nextPointLevelNext(point);
    if (next) {
      const down = this._nextPointLevelDown(next);
      if (down) return down;
      return this._nextPointLevel(next);
    }
    return null;
  }

  _nextPointLevelNext(point: Point): Point | null {
    const previousPositions = point.flowPosition;
    const elementFlow = this.element.get(previousPositions) as ElementFlow;
    const currentPosition = point.itemPosition;
    const variables = point.variables;
    const position = Navigate.next(elementFlow, currentPosition, variables);
    if (position !== null) {
      const positions = [...previousPositions, position];
      return Point.create(this.element, positions, variables);
    }
    return null;
  }

  _nextPointLevelDown(point: Point): StepPoint | null {
    const element = this.element.get(point.positions);
    if (element instanceof ElementFlow) {
      const position = Navigate.down(element, point.variables);
      if (position !== null) {
        const positions = [...point.positions, position];
        const next = Point.create(this.element, positions, point.variables);
        const nextDown = this._nextPointLevelDown(next);
        if (nextDown) return nextDown;
        return this._nextPointLevel(next);
      }
      return null;
    }
    return point as StepPoint;
  }

  _upPoint(point: Point): Point {
    return Point.create(this.element, point.flowPosition, point.variables);
  }
}

export default Form;
