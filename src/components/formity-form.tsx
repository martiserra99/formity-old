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
  className,
}: FormityFormProps) {
  const form = useForm({ defaultValues, resolver });
  return (
    <FormProvider {...form}>
      <FormityFormContext.Provider value={{ onBack }}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={className}
          noValidate
        >
          {children}
        </form>
      </FormityFormContext.Provider>
    </FormProvider>
  );
}

export default FormityForm;
