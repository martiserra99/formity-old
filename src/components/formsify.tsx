import React, { useMemo, useState } from 'react';

import { Object as Obj, Value } from 'mongu';

import { FormityProps } from '../types/components';

import Form from '../classes/form';
import { PointForm } from '../classes/point';

import useResolver from '../hooks/formity/use-resolver';
import useRender from '../hooks/formity/use-render';

import FormityForm from '../components/formity-form';

function Formity({ json, onSubmit, className }: FormityProps) {
  const form = useMemo(() => new Form(json), [json]);

  const [points, setPoints] = useState(() => [form.initial()]);

  const point = points[points.length - 1];
  const value = point.value;

  const defaultValues = value.defaultValues;
  const resolver = useResolver(value);
  const render = useRender(value);

  function handleSubmit(values: Obj<Value>) {
    const [currPoint, nextPoint] = form.next(point, values);
    if (nextPoint instanceof PointForm) {
      setPoints([...points.slice(0, -1), currPoint, nextPoint]);
      return;
    }
    return onSubmit(nextPoint.value);
  }

  function handleBack() {
    setPoints(points.slice(0, points.length - 1));
  }

  return (
    <FormityForm
      defaultValues={defaultValues}
      resolver={resolver}
      onSubmit={handleSubmit}
      className={className}
      onBack={handleBack}
      key={points.length}
    >
      {render}
    </FormityForm>
  );
}

export default Formity;
