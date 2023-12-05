import React, { ReactNode } from 'react';

import { ValueForm } from '../../types/value';
import { FormityContextValue } from '../../types/context';

import useFormity from '../use-formity';

type Components = FormityContextValue['components'];

function useRender(form: ValueForm): ReactNode {
  const { components } = useFormity();
  return toJSX(form.render, components) as ReactNode;
}

function toJSX(
  value: unknown,
  components: Components,
  index: number = 0
): unknown {
  if (isArray(value)) return arrayToJSX(value, components);
  if (isObject(value)) return objectToJSX(value, components, index);
  return value as unknown;
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function arrayToJSX(value: unknown[], components: Components): unknown[] {
  return value.map((item, index) => toJSX(item, components, index));
}

function isObject(value: unknown): value is { [key: string]: unknown } {
  return typeof value === 'object' && value !== null;
}

function objectToJSX(
  value: { [key: string]: unknown },
  components: Components,
  index: number = 0
): ReactNode | { [key: string]: unknown } {
  if (isComponent(value)) return componentToJSX(value, components, index);
  return propertiesToJSX(value, components);
}

function isComponent(value: { [key: string]: unknown }): boolean {
  const key = Object.keys(value)[0];
  return key[0] === key[0].toUpperCase();
}

function componentToJSX(
  value: { [key: string]: unknown },
  components: Components,
  index: number = 0
): ReactNode {
  const key = Object.keys(value)[0];
  const Component = components[key];
  const object = value[key] as { [key: string]: unknown };
  const props = objectToJSX(object, components) as { [key: string]: unknown };
  return <Component key={index} {...props} />;
}

function propertiesToJSX(
  value: { [key: string]: unknown },
  components: Components
): { [key: string]: unknown } {
  return Object.fromEntries(
    Object.entries(value).map(([key, value]) => [key, toJSX(value, components)])
  );
}

export default useRender;
