/* @flow */

import type { FormikBag } from 'formik';

// $FlowFixMe upgrade flow
import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import type { WizardProps } from '~core/Wizard';

import { mergePayload } from '~utils/actions';
import { ActionForm, Textarea, FormStatus } from '~core/Fields';
import Button from '~core/Button';
import Heading from '~core/Heading';
import { ACTIONS } from '~redux';
import styles from './StepMnemonic.css';

const MSG = defineMessages({
  heading: {
    id: 'users.ConnectWalletWizard.StepMnemonic.heading',
    defaultMessage: 'Access Colony with your Mnemonic Phrase',
  },
  instructionText: {
    id: 'users.ConnectWalletWizard.StepMnemonic.instructionText',
    defaultMessage: 'Your Mnemonic Phrase',
  },
  errorDescription: {
    id: 'users.ConnectWalletWizard.StepMnemonic.errorDescription',
    defaultMessage: 'Oops, there is something wrong',
  },
  errorOpenMnemonic: {
    id: 'users.ConnectWalletWizard.StepMnemonic.errorOpenMnemonic',
    defaultMessage:
      'Oops, there is something wrong. Check the format of your mnemonic',
  },
  mnemonicRequired: {
    id: 'users.ConnectWalletWizard.StepMnemonic.mnemonicRequired',
    defaultMessage: 'You must provide a mnemonic phrase.',
  },
  buttonAdvanceText: {
    id: 'users.ConnectWalletWizard.StepMnemonic.button.advance',
    defaultMessage: 'Continue',
  },
  buttonBackText: {
    id: 'users.ConnectWalletWizard.StepMnemonic.button.back',
    defaultMessage: 'Back',
  },
});

const validationSchema = yup.object({
  connectwalletmnemonic: yup.string().required(MSG.mnemonicRequired),
});

type FormValues = {
  connectwalletmnemonic: string,
};

type Props = WizardProps<FormValues>;

const displayName = 'users.ConnectWalletWizard.StepMnemonic';

const StepMnemonic = ({
  nextStep,
  resetWizard,
  wizardForm,
  wizardValues,
}: Props) => {
  const transform = useCallback(mergePayload(wizardValues), [wizardValues]);

  return (
    <ActionForm
      submit={ACTIONS.WALLET_CREATE}
      success={ACTIONS.CURRENT_USER_CREATE}
      error={ACTIONS.WALLET_CREATE_ERROR}
      onError={(_: Object, { setStatus }: FormikBag<Object, FormValues>) => {
        setStatus({ error: MSG.errorOpenMnemonic });
      }}
      onSuccess={values => nextStep({ ...values })}
      validationSchema={validationSchema}
      transform={transform}
      {...wizardForm}
    >
      {({ isSubmitting, isValid, status }) => (
        <main>
          <div className={styles.content}>
            <Heading text={MSG.heading} appearance={{ size: 'medium' }} />
            <Textarea
              label={MSG.instructionText}
              name="connectwalletmnemonic"
            />
          </div>
          <FormStatus status={status} />
          <div className={styles.actions}>
            <Button
              appearance={{ theme: 'secondary', size: 'large' }}
              text={MSG.buttonBackText}
              onClick={resetWizard}
            />
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              disabled={!isValid}
              text={MSG.buttonAdvanceText}
              type="submit"
              loading={isSubmitting}
              data-test="submitMnemonic"
            />
          </div>
        </main>
      )}
    </ActionForm>
  );
};

StepMnemonic.displayName = displayName;

export default StepMnemonic;
