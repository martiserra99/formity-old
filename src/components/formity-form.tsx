import React from 'react';

import { useForm, FormProvider } from 'react-hook-form';

import { FormityFormProps } from '../types/components';

import FormityFormContext from '../context/formity-form-context';

/**
 * It is the form component.
 */
function FormityForm({
  defaultValues,
  resolver,
  onSubmit,
  onBack,
  children,
  ...props
}: FormityFormProps) {
  const form = useForm({ defaultValues, resolver });
  return (
    <FormProvider {...form}>
      <FormityFormContext.Provider value={{ onBack }}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate {...props}>
          {children}
        </form>
      </FormityFormContext.Provider>
    </FormProvider>
  );
}

export default FormityForm;
