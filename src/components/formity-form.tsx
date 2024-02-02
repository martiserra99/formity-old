import React from 'react';
import { Value } from 'mongu';
import { useForm, UseFormProps, FormProvider } from 'react-hook-form';

import FormityFormContext from '../context/formity-form-context';

interface FormityFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  defaultValues: UseFormProps['defaultValues'];
  resolver: UseFormProps['resolver'];
  onSubmit: (values: { [key: string]: Value }) => void;
  onBack: () => void;
}

/**
 * It is a component that represents a step in the form.
 */
function FormityForm({
  defaultValues,
  resolver,
  onSubmit,
  onBack,
  ...props
}: FormityFormProps) {
  const form = useForm({ defaultValues, resolver });
  return (
    <FormProvider {...form}>
      <FormityFormContext.Provider value={{ onBack }}>
        <form onSubmit={form.handleSubmit(onSubmit)} {...props} />
      </FormityFormContext.Provider>
    </FormProvider>
  );
}

export default FormityForm;

export { FormityFormProps };
