import React from 'react';

import { useForm, FormProvider } from 'react-hook-form';

import { FormsifyFormProps } from '../types/components';

import FormsifyFormContext from '../context/formsify-form-context';

/**
 * It is the form component.
 */
function FormsifyForm({
  defaultValues,
  resolver,
  onSubmit,
  onBack,
  children,
  className,
}: FormsifyFormProps) {
  const form = useForm({ defaultValues, resolver });
  return (
    <FormProvider {...form}>
      <FormsifyFormContext.Provider value={{ onBack }}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={className}
          noValidate
        >
          {children}
        </form>
      </FormsifyFormContext.Provider>
    </FormProvider>
  );
}

export default FormsifyForm;
