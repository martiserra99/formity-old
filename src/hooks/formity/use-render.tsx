import React, { ReactElement, isValidElement } from 'react';

import { Value } from 'mongu';

import { isArray, isObject } from '../../utils';

import { Components } from '../../types';

import { ValueForm } from '../../types/value';

import useFormity from '../use-formity';

type Render = Value | ReactElement | Render[] | { [key: string]: Render };

/**
 * It is a hook that returns the React element of the form.
 * @param form The form to be rendered.
 * @returns The React element of the form.
 */
function useRender(form: ValueForm): ReactElement {
  const { components } = useFormity();
  return toElement(form.render, components);
}

/**
 * It is a function that converts a value to an element.
 * @param value The value to be converted to an element.
 * @param components The components to be used.
 * @returns The element.
 */
function toElement(value: Value, components: Components): ReactElement {
  const jsx = toJSX(value, components);
  if (React.isValidElement(jsx)) return jsx;
  throw new Error('The value is not a valid element');
}

/**
 * It is a function that converts a value to JSX.
 * @param value The value to be converted to JSX.
 * @param components The components to be used.
 * @param i The index of the element.
 * @returns The JSX.
 */
function toJSX(value: Value, components: Components, i: number = 0): Render {
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
function arrayToJSX(value: Value[], components: Components): Render[] {
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
): ReactElement | { [key: string]: Render } {
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
