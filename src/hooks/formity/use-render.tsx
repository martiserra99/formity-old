import React, { ReactElement, isValidElement } from 'react';

import { Value } from 'mongu';

import { isArray, isObject } from '../../utils';
import { NotValidFormError } from '../../error';

import { Components } from '../../types';

import { ValueForm } from '../../types/value';

import useFormity from '../use-formity';

type JSX = Value | ReactElement | JSX[] | { [key: string]: JSX };

/**
 * It is a hook that returns the React element list of the form.
 * @param form The form to be rendered.
 * @returns The React element list of the form.
 */
function useRender(form: ValueForm): ReactElement[] {
  const { components } = useFormity();
  return toElementList(form.render, components);
}

/**
 * It is a function that converts a value to an element list.
 * @param value The value to be converted to an element list.
 * @param components The components to be used.
 * @returns The element list.
 */
function toElementList(value: Value, components: Components): ReactElement[] {
  const jsx = toJSX(value, components);
  if (isElementList(jsx)) return jsx;
  throw new NotValidFormError();
}

/**
 * It is a function that checks if the value is an element list.
 * @param jsx The JSX.
 * @returns A boolean indicating if the value is an element list.
 */
function isElementList(jsx: JSX): jsx is ReactElement[] {
  return Array.isArray(jsx) && jsx.every(item => isValidElement(item));
}

/**
 * It is a function that converts a value to JSX.
 * @param value The value to be converted to JSX.
 * @param components The components to be used.
 * @param i The index of the element.
 * @returns The JSX.
 */
function toJSX(value: Value, components: Components, i: number = 0): JSX {
  if (isArray(value)) return arrayToJSX(value, components);
  if (isObject(value)) return objectToJSX(value, components, i);
  return value;
}

/**
 * It is a function that converts an array to JSX.
 * @param value The value to be converted to JSX.
 * @param components The components to be used.
 * @returns The JSX.
 */
function arrayToJSX(value: Value[], components: Components): JSX[] {
  return value.map((item, index) => toJSX(item, components, index));
}

/**
 * It is a function that converts an object to JSX.
 * @param value The value to be converted to JSX.
 * @param components The components to be used.
 * @param i The index of the element.
 * @returns The JSX.
 */
function objectToJSX(
  value: { [key: string]: Value },
  components: Components,
  i: number = 0
): ReactElement | { [key: string]: JSX } {
  if (isComponent(value)) return componentToJSX(value, components, i);
  return Object.fromEntries(
    Object.entries(value).map(([key, value]) => [key, toJSX(value, components)])
  );
}

/**
 * It returns a boolean indicating if the value is a component.
 * @param value The value to be checked.
 * @returns A boolean indicating if the value is a component.
 */
function isComponent(value: { [key: string]: Value }): boolean {
  const key = Object.keys(value)[0];
  return key[0] === key[0].toUpperCase();
}

/**
 * It is a function that converts a component to JSX.
 * @param value The value to be converted to JSX.
 * @param components The components to be used.
 * @param key The index of the element.
 * @returns The JSX.
 */
function componentToJSX(
  value: { [key: string]: Value },
  components: Components,
  i: number = 0
): ReactElement {
  const key = Object.keys(value)[0];
  if (key in components) {
    const Component = components[key];
    const object = value[key];
    if (isObject(object)) {
      const props = objectToJSX(object, components);
      if (!isValidElement(props)) {
        return <Component {...props} key={i} />;
      }
    }
    throw new Error(`The component ${key} is not well formatted.`);
  }
  throw new Error(`The component "${key}" doesn't exist.`);
}

export default useRender;
