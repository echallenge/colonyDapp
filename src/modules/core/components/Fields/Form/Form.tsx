import React from 'react';
import { FormikConfig, Formik, Form as FormikForm } from 'formik';

import SaveGuard from './SaveGuard';

interface Props<V> extends FormikConfig<V> {
  className?: string;
  saveGuard?: boolean;
}

const displayName = 'Form';

const Form = <V extends Record<string, any>>({
  children,
  className,
  saveGuard = false,
  ...props
}: Props<V>) => (
  <Formik<V> {...props}>
    {(injectedProps) => (
      <FormikForm className={className}>
        {saveGuard && <SaveGuard />}
        {typeof children == 'function' ? children(injectedProps) : children}
      </FormikForm>
    )}
  </Formik>
);

Form.displayName = displayName;

export default Form;
