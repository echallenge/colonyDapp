import { FormikBag } from 'formik';
import * as yup from 'yup';
import { connect } from 'react-redux';
import React, { useCallback, useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { BigNumber } from 'ethers/utils';

import { WizardProps } from '~core/Wizard';
import { Address } from '~types/index';
import { WalletKind, WalletMethod } from '~immutable/index';
import { ActionTypes } from '~redux/index';
import { mergePayload } from '~utils/actions';
import { SpinnerLoader } from '~core/Preloaders';
import Icon from '~core/Icon';
import { ActionForm, Input, InputLabel, FormStatus } from '~core/Fields';
import Button from '~core/Button';
import Heading from '~core/Heading';
import WalletInteraction from '~users/GasStation/WalletInteraction';
import AddressItem from './AddressItem';
import { walletSelector } from '../../../selectors';
import { fetchAccounts as fetchAccountsAction } from '../../../actionCreators';
import styles from './StepHardware.css';

const MSG = defineMessages({
  heading: {
    id: 'users.ConnectWalletWizard.StepHardware.heading',
    defaultMessage:
      'We found a hardware wallet! Which address would you like to use?',
  },
  walletSelectionLabel: {
    id: 'users.ConnectWalletWizard.StepHardware.walletSelectionLabel',
    defaultMessage: 'Select an address',
  },
  walletIconTitle: {
    id: 'users.ConnectWalletWizard.StepHardware.walletIconTitle',
    defaultMessage: 'Hardware wallet',
  },
  searchInputPlacholder: {
    id: 'users.ConnectWalletWizard.StepHardware.searchInputPlaceholder',
    defaultMessage: 'Search...',
  },
  balanceText: {
    id: 'users.ConnectWalletWizard.StepHardware.balanceText',
    defaultMessage: 'Balance',
  },
  emptySearchResultsText: {
    id: 'users.ConnectWalletWizard.StepHardware.emptySearchResultsText',
    defaultMessage: `Your search didn't return any connected wallets.`,
  },
  errorHeading: {
    id: 'users.ConnectWalletWizard.StepHardware.errorHeading',
    defaultMessage: `Oops, we couldn't find your hardware wallet`,
  },
  errorDescription: {
    id: 'users.ConnectWalletWizard.StepHardware.errorDescription',
    defaultMessage:
      'Please check that your hardware wallet is connected and try again.',
  },
  errorPickAddress: {
    id: 'users.ConnectWalletWizard.StepHardware.errorPickAddress',
    defaultMessage: 'Something went wrong. That is probably not your fault!',
  },
  walletChoiceRequired: {
    id: 'users.ConnectWalletWizard.StepHardware.walletChoiceRequired',
    defaultMessage: 'Please select one of the wallets below.',
  },
  buttonAdvance: {
    id: 'users.ConnectWalletWizard.StepHardware.buttonAdvance',
    defaultMessage: 'Continue',
  },
  buttonBack: {
    id: 'users.ConnectWalletWizard.StepHardware.buttonBack',
    defaultMessage: 'Choose a different wallet',
  },
  buttonRetry: {
    id: 'users.ConnectWalletWizard.StepHardware.buttonRetry',
    defaultMessage: 'Try Again',
  },
  loadingAddresses: {
    id: 'users.ConnectWalletWizard.StepHardware.loadingAddresses',
    defaultMessage: 'Loading available addresses...',
  },
});

const validationSchema = yup.object({
  hardwareWalletChoice: yup
    .string()
    .address()
    .required(() => MSG.walletChoiceRequired),
});

interface FormValues {
  method: WalletMethod;
  hardwareWalletChoice: string;
  hardwareWalletFilter: string;
}

interface Props extends WizardProps<FormValues> {
  fetchAccounts: typeof fetchAccountsAction;
  isLoading: boolean;
  availableAddresses: { address: Address; balance: BigNumber }[];
}

const displayName = 'users.ConnectWalletWizard.StepHardware';

const StepHardware = ({
  nextStep,
  availableAddresses,
  fetchAccounts,
  isLoading,
  resetWizard,
  stepCompleted,
  wizardForm,
  wizardValues: { method },
  wizardValues,
}: Props) => {
  useEffect(() => {
    fetchAccounts(method);
  }, [fetchAccounts, method]);

  const renderContent = useCallback(
    (formValues: FormValues) => {
      const {
        hardwareWalletChoice = '',
        hardwareWalletFilter = '',
      } = formValues;

      if (isLoading) {
        return (
          <SpinnerLoader
            loadingText={MSG.loadingAddresses}
            appearance={{ size: 'massive' }}
          />
        );
      }

      if (availableAddresses.length) {
        const filteredWalletChoices = availableAddresses.filter(({ address }) =>
          address
            .toLocaleLowerCase()
            .includes(hardwareWalletFilter.toLowerCase()),
        );

        const iconClassName = hardwareWalletFilter
          ? styles.searchBoxIconContainerActive
          : styles.searchBoxIconContainer;

        return (
          <>
            <Heading
              text={MSG.heading}
              appearance={{ size: 'medium', weight: 'thin' }}
            />
            <InputLabel label={MSG.walletSelectionLabel} />
            <div className={styles.choiceHeadingRow}>
              <div className={styles.searchBox}>
                <div className={iconClassName}>
                  <Icon name="wallet" title={MSG.walletIconTitle} />
                </div>
                <Input
                  appearance={{ theme: 'minimal' }}
                  name="hardwareWalletFilter"
                  label={MSG.walletSelectionLabel}
                  placeholder={MSG.searchInputPlacholder}
                  elementOnly
                />
              </div>
              <div className={styles.balanceHeading}>
                <Heading
                  text={MSG.balanceText}
                  appearance={{ size: 'normal' }}
                />
              </div>
            </div>
            <div className={styles.walletChoicesContainer}>
              {filteredWalletChoices.length === 0 &&
                hardwareWalletFilter.length > 0 && (
                  <Heading
                    text={MSG.emptySearchResultsText}
                    appearance={{ size: 'normal' }}
                  />
                )}
              {filteredWalletChoices.map(({ address, balance }) => (
                <div className={styles.choiceRow} key={address}>
                  <AddressItem
                    address={address}
                    checked={hardwareWalletChoice === address}
                    balance={balance}
                  />
                </div>
              ))}
            </div>
          </>
        );
      }

      return (
        <>
          <Icon name="wallet" title={MSG.walletIconTitle} />
          <Heading text={MSG.errorHeading} appearance={{ size: 'large' }} />
          <Heading
            text={MSG.errorDescription}
            appearance={{ size: 'normal' }}
          />
        </>
      );
    },
    [availableAddresses, isLoading],
  );

  return (
    <ActionForm
      submit={ActionTypes.WALLET_CREATE}
      success={ActionTypes.USER_CONTEXT_SETUP_SUCCESS}
      error={ActionTypes.WALLET_CREATE_ERROR}
      onError={(
        _: Record<string, any>,
        { setStatus }: FormikBag<Record<string, any>, FormValues>,
      ) => setStatus({ error: MSG.errorPickAddress })}
      onSuccess={(values) => nextStep({ ...values })}
      validationSchema={validationSchema}
      transform={mergePayload(wizardValues)}
      {...wizardForm}
    >
      {({ dirty, isSubmitting, isValid, status, values }) => (
        <div>
          <section className={styles.content}>{renderContent(values)}</section>
          <FormStatus status={status} />
          {isValid && values.hardwareWalletChoice && (
            <div className={styles.interactionPrompt}>
              <WalletInteraction walletKind={WalletKind.Hardware} />
            </div>
          )}
          <div className={styles.actions}>
            <Button
              text={MSG.buttonBack}
              appearance={{ theme: 'secondary', size: 'large' }}
              onClick={resetWizard}
            />
            <Button
              text={
                availableAddresses.length > 0
                  ? MSG.buttonAdvance
                  : MSG.buttonRetry
              }
              appearance={{ theme: 'primary', size: 'large' }}
              type="submit"
              disabled={!isValid || (!dirty && !stepCompleted)}
              loading={isSubmitting}
            />
          </div>
        </div>
      )}
    </ActionForm>
  );
};

StepHardware.defaultProps = {
  availableAddresses: [],
  wizardValues: {
    method: WalletMethod.Ledger,
    hardwareWalletChoice: '0x0',
    hardwareWalletFilter: '0x0',
  },
};

StepHardware.displayName = displayName;

const enhance = connect(
  (state: any) => {
    const { isLoading, availableAddresses } = walletSelector(state);
    return {
      isLoading,
      availableAddresses,
    };
  },
  { fetchAccounts: fetchAccountsAction },
);

export default enhance(StepHardware) as any;
