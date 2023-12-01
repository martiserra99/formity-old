import { Object as Obj, Value } from 'mongu';

import { mongu } from 'mongu';

import { ElementFlow } from './element';
import {
  Position,
  PositionList,
  PositionCond,
  PositionLoop,
} from '../types/position';

import { ElementList, ElementCond, ElementLoop } from './element';

/**
 * This class contains methods to navigate through the elements.
 */
export abstract class Navigate<
  T extends ElementFlow = ElementFlow,
  U extends Position = Position
> {
  protected element: T;

  constructor(element: T) {
    this.element = element;
  }

  private static create(element: ElementFlow): Navigate {
    if (element instanceof ElementList) return new NavigateList(element);
    if (element instanceof ElementCond) return new NavigateCond(element);
    if (element instanceof ElementLoop) return new NavigateLoop(element);
    throw new Error('Invalid element');
  }

  /**
   * It returns the first position.
   * @param element The element.
   * @param variables The variables.
   * @returns The first position.
   */
  static down(
    element: ElementFlow,
    variables: Obj<Value> = {}
  ): Position | null {
    return Navigate.create(element).down(variables);
  }

  /**
   * It returns the next position.
   * @param element The element.
   * @param position The position.
   * @param variables The variables.
   * @returns The next position.
   */
  static next(
    element: ElementFlow,
    position: Position,
    variables: Obj<Value> = {}
  ): Position | null {
    return Navigate.create(element).next(position, variables);
  }

  protected abstract down(variables: Obj<Value>): U | null;

  protected abstract next(position: U, variables: Obj<Value>): U | null;
}

/**
 * It defines logic to navigate through a list.
 */
export class NavigateList extends Navigate<ElementList, PositionList> {
  protected down(): PositionList | null {
    if (this.element.length > 0) return 0;
    return null;
  }

  protected next(position: PositionList): PositionList | null {
    if (position < this.element.length - 1) return position + 1;
    return null;
  }
}

/**
 * It defines logic to navigate through a conditional.
 */
export class NavigateCond extends Navigate<ElementCond, PositionCond> {
  protected down(variables: Obj<Value>): PositionCond | null {
    if (mongu(this.element.cond, variables)) {
      if (this.element.thenLength > 0) return ['then', 0];
    } else {
      if (this.element.elseLength > 0) return ['else', 0];
    }
    return null;
  }

  protected next(position: PositionCond): PositionCond | null {
    if (position[0] === 'then') {
      if (position[1] < this.element.thenLength - 1)
        return ['then', position[1] + 1];
    } else {
      if (position[1] < this.element.elseLength - 1)
        return ['else', position[1] + 1];
    }
    return null;
  }
}

/**
 * It defines logic to navigate through a loop.
 */
export class NavigateLoop extends Navigate<ElementLoop, PositionLoop> {
  protected down(variables: Obj<Value>): PositionLoop | null {
    if (mongu(this.element.cond, variables)) {
      if (this.element.length > 0) return 0;
    }
    return null;
  }

  protected next(
    position: PositionLoop,
    variables: Obj<Value>
  ): PositionLoop | null {
    if (position < this.element.length - 1) return position + 1;
    if (mongu(this.element.cond, variables)) return 0;
    return null;
  }
}
