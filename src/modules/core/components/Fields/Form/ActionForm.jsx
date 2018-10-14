/* @flow */

import type { FormikConfig, FormikBag } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';
import MakeAsyncFunction from 'react-redux-promise-listener';

import promiseListener from '../../../../../createPromiseListener';

import Form from './Form.jsx';

const MSG = defineMessages({
  defaultError: {
    id: 'ActionForm.defaultError',
    defaultMessage:
      // eslint-disable-next-line max-len
      "Something went wrong with the thing you just wanted to do. It's not your fault. Promise!",
  },
});

const displayName = 'Form.ActionForm';

type Props = FormikConfig<Object> & {
  submit: string,
  success: string,
  error: string,
  onSuccess?: (any, FormikBag<Object, Object>) => void,
  onError?: (any, FormikBag<Object, Object>) => void,
};

const defaultOnErrror = (err, { setStatus }) =>
  setStatus({ error: MSG.defaultError });

const ActionForm = ({
  submit,
  success,
  error,
  onSuccess,
  onError = defaultOnErrror,
  ...props
}: Props) => (
  <MakeAsyncFunction
    listener={promiseListener}
    start={submit}
    resolve={success}
    reject={error}
  >
    {asyncFunc => {
      const handleSubmit = (values, formikBag) =>
        asyncFunc(values, formikBag).then(
          res => {
            formikBag.setSubmitting(false);
            if (typeof onSuccess == 'function') {
              onSuccess(res, formikBag);
            }
          },
          err => {
            formikBag.setSubmitting(false);
            if (typeof onError == 'function') {
              onError(err, formikBag);
            }
          },
        );
      return <Form {...props} onSubmit={handleSubmit} />;
    }}
  </MakeAsyncFunction>
);

Form.displayName = displayName;

export default ActionForm;