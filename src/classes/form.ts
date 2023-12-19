import { Object, Value } from 'mongu';

import { JsonList } from '../types/json';
import { Position } from '../types/position';
import { PointForm, PointReturn } from './point';

import { ElementList, ElementFlow, ElementItem } from './element';
import { Point, PointVariables } from './point';
import { Navigate } from './navigate';

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
   * It returns the initial point.
   * @returns The initial point.
   */
  initial(): PointForm {
    const positions = this._initialPositions(this.element);
    const point = Point.create(this.element, positions);
    return this._nextStop(point) as PointForm;
  }

  /**
   * It returns the current and the next point.
   * @param point The point.
   * @param values The values.
   * @returns The current and the next point.
   */
  next(point: PointForm, values: Object<Value>): [PointForm, PointStop] {
    const currPoint = point.setDefaultValues(values);
    const nextPoint = this._nextStop(
      this._nextStep(currPoint.addVariables(values))
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

  _nextStop(point: Point): PointStop {
    let nextPoint = point;
    while (nextPoint instanceof PointVariables) {
      nextPoint = this._nextStep(nextPoint);
    }
    return nextPoint as PointStop;
  }

  _nextStep(point: Point): Point {
    return this._nextPoint(this._nextVariables(point));
  }

  _nextVariables(point: Point): Point {
    return point instanceof PointVariables
      ? point.addVariables(point.value as Object<Value>)
      : point;
  }

  _nextPoint(point: Point): Point {
    const nextPoint = this._nextPointLevel(point);
    if (nextPoint) return nextPoint;
    return this._nextPoint(this._upPoint(point));
  }

  _nextPointLevel(point: Point): Point | null {
    const next = this._nextPointLevelNext(point);
    if (next) {
      const down = this._nextPointLevelDown(next);
      if (down) return down;
      return this._nextPointLevel(next);
    }
    return null;
  }

  _nextPointLevelNext(point: Point): Point | null {
    const flow = this.element.get(point.previousPositions) as ElementFlow;
    const position = Navigate.next(
      flow,
      point.currentPosition,
      point.variables
    );
    if (position !== null) {
      const positions = [...point.previousPositions, position];
      return Point.create(this.element, positions, point.variables);
    }
    return null;
  }

  _nextPointLevelDown(point: Point): Point | null {
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
    return point;
  }

  _upPoint(point: Point): Point {
    return Point.create(this.element, point.previousPositions, point.variables);
  }
}

export default Form;
