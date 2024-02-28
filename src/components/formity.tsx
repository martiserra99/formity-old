import React, { useMemo, useState } from 'react';

import { Value } from 'mongu';

import { JsonList } from '../types/json';

import Form from '../classes/form';

import { PointForm } from '../classes/point';

import useResolver from '../hooks/formity/use-resolver';
import useRender from '../hooks/formity/use-render';

import FormityForm from './formity-form';

import { NotValidFormError } from '../error';

interface FormityProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: JsonList;
  onSubmit: (data: Value) => void;
}

/**
 * It is a component that represents the form that will be rendered from the JSON.
 */
function Formity({ form: json, onSubmit, ...props }: FormityProps) {
  const form = useMemo(() => new Form(json), [json]);

  const [points, setPoints] = useState(() => [form.initial()]);

  const point = points[points.length - 1];
  const value = point.value;

  const defaultValues = value.defaultValues;
  const resolver = useResolver(value);
  const render = useRender(value);

  const [error, setError] = useState(false);

  if (error) throw new NotValidFormError();

  function handleSubmit(values: { [key: string]: Value }) {
    try {
      const [currentPoint, nextPoint] = form.next(point, values);
      if (nextPoint instanceof PointForm) {
        setPoints([...points.slice(0, -1), currentPoint, nextPoint]);
        return;
      }
      return onSubmit(nextPoint.value);
    } catch {
      setError(true);
    }
  }

  function handleBack() {
    try {
      setPoints(points.slice(0, points.length - 1));
    } catch {
      setError(true);
    }
  }

  return (
    <FormityForm
      defaultValues={defaultValues}
      resolver={resolver}
      onSubmit={handleSubmit}
      onBack={handleBack}
      key={points.length}
      {...props}
    >
      {render}
    </FormityForm>
  );
}

export default Formity;

export { FormityProps };
