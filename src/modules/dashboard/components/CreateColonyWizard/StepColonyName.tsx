import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import { useApolloClient } from '@apollo/client';

import { WizardProps } from '~core/Wizard';
import { Form, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import Icon from '~core/Icon';
import { Tooltip } from '~core/Popover';
import { multiLineTextEllipsis } from '~utils/strings';
import ENS from '~lib/ENS';
import {
  useLoggedInUser,
  ColonyAddressDocument,
  ColonyAddressQuery,
  ColonyAddressQueryVariables,
} from '~data/index';

import styles from './StepColonyName.css';

interface FormValues {
  displayName: string;
  colonyName: string;
  username: string;
}

type Props = WizardProps<FormValues>;

/**
 * @NOTE On the specific colony address type
 *
 * This came about as a result of hooking into the result of the colony query,
 * on the client side query, before it sends the result on to the server query,
 * and act upon that if that's in an error state (in which case, it won't actually
 * reach the server)
 */
type SuperSpecificColonyAddress = string | Error;

const MSG = defineMessages({
  heading: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.heading',
    defaultMessage: `Welcome @{username}, let's begin creating your colony.`,
  },
  descriptionOne: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.descriptionOne',
    defaultMessage: `What would you like to name your colony? Note, it is not possible to change it later.`,
  },
  label: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.label',
    defaultMessage: 'Colony Unique URL',
  },
  labelDisplay: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.labelDisplay',
    defaultMessage: 'Colony Name',
  },
  continue: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.Continue',
    defaultMessage: 'Continue',
  },
  errorDomainTaken: {
    id: 'dashboard.CreateColonyWizard.StepColonyName.errorDomainTaken',
    defaultMessage: 'This colony domain name is already taken',
  },
  statusText: {
    id: 'users.CreateColonyWizard.StepColonyName.statusText',
    defaultMessage: 'Actual Colony Name: {normalized}',
  },
  tooltip: {
    id: 'users.CreateColonyWizard.StepColonyName.tooltip',
    defaultMessage: `We use ENS to create a .joincolony.eth subdomain for your colony. You can use this to create a custom URL and invite people to join your colony.`,
  },
  tooltipColonyCreationDisabled: {
    id: 'users.CreateColonyWizard.StepColonyName.tooltipColonyCreationDisabled',
    defaultMessage: `Due to the extraordinarily high Ethereum gas prices, we’ve decided to disable colony creation to prevent new users from incurring unexpectedly high costs. A new and improved Colony V2 will be available on xDai soon!`,
  },
});

const displayName = 'dashboard.CreateColonyWizard.StepColonyName';

const validationSchema = yup.object({
  colonyName: yup.string().required().ensAddress(),
  displayName: yup.string().required(),
});

/**
 * @NOTE Colony Creation DISABLED due to high gas costs
 *
 * Please remove this and re-enable when the time comes, or when we deploy this
 * to xDai
 */
const DISABLE_COLONY_CREATION_DUE_TO_HIGH_GAS_COSTS = true;

const StepColonyName = ({
  wizardForm,
  nextStep,
  stepCompleted,
  wizardValues,
}: Props) => {
  const apolloClient = useApolloClient();

  const checkDomainTaken = useCallback(
    async (values: FormValues) => {
      try {
        const { data } = await apolloClient.query<
          ColonyAddressQuery,
          ColonyAddressQueryVariables
        >({
          query: ColonyAddressDocument,
          variables: {
            name: values.colonyName,
          },
        });
        if (data && data.colonyAddress) {
          if (
            (data.colonyAddress as SuperSpecificColonyAddress) instanceof Error
          ) {
            return false;
          }
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
    [apolloClient],
  );

  const { username } = useLoggedInUser();

  const [currentENSName, setCurrentENSName] = useState<string | undefined>();

  // @TODO debounce colony name validation
  // @BODY this is a bit harder than you'd expect. We have to make sure that validation still works and that the user can't just remove a character quickly and then move on without the validation to happen.
  const validateDomain = useCallback(
    async (values: FormValues) => {
      if (values && currentENSName === values.colonyName) {
        return {};
      }
      try {
        // Let's check whether this is even valid first
        validationSchema.validateSyncAt('colonyName', values);
      } catch (caughtError) {
        // Just return. The actual validation will be done by the
        // validationSchema
        return {};
      }
      const taken = await checkDomainTaken(values);
      if (taken) {
        const errors = {
          colonyName: MSG.errorDomainTaken,
        };
        return errors;
      }
      setCurrentENSName(values.colonyName);
      return {};
    },
    [checkDomainTaken, currentENSName, setCurrentENSName],
  );

  return (
    <Form
      onSubmit={nextStep}
      validate={validateDomain}
      validationSchema={validationSchema}
      {...wizardForm}
    >
      {({ isValid, isSubmitting, dirty, values: { colonyName } }) => {
        const normalized = ENS.normalizeAsText(colonyName);
        return (
          <section className={styles.main}>
            <Heading appearance={{ size: 'medium', weight: 'medium' }}>
              <FormattedMessage
                {...MSG.heading}
                values={{
                  /*
                   * @NOTE We need to use a JS string truncate here, rather then CSS,
                   * since we're dealing with a string that needs to be truncated,
                   * inside a sentence that does not
                   */
                  username: (
                    <span
                      /*
                       * @NOTE Needed so the user can get the full username on hover
                       * (But still, if it's too long, the browser will trucate it)
                       */
                      title={ENS.normalizeAsText(
                        username || wizardValues.username,
                      )}
                    >
                      {multiLineTextEllipsis(
                        ENS.normalizeAsText(username || wizardValues.username),
                        38,
                      )}
                    </span>
                  ),
                }}
              />
            </Heading>
            <p className={styles.paragraph}>
              <FormattedMessage {...MSG.descriptionOne} />
            </p>
            <div className={styles.nameForm}>
              <Input
                appearance={{ theme: 'fat' }}
                name="displayName"
                data-test="claimColonyDisplayNameInput"
                label={MSG.labelDisplay}
              />
              <Input
                appearance={{ theme: 'fat' }}
                name="colonyName"
                data-test="claimColonyNameInput"
                extensionString=".colony.joincolony.eth"
                label={MSG.label}
                status={normalized !== colonyName ? MSG.statusText : undefined}
                formattingOptions={{ lowercase: true }}
                statusValues={{ normalized }}
                extra={
                  <Tooltip
                    placement="right"
                    content={
                      <div className={styles.tooltipContent}>
                        <FormattedMessage {...MSG.tooltip} />
                      </div>
                    }
                  >
                    <div className={styles.iconContainer}>
                      <Icon
                        name="question-mark"
                        title="helper"
                        appearance={{ size: 'small' }}
                      />
                    </div>
                  </Tooltip>
                }
              />
              <div className={styles.buttons}>
                <Tooltip
                  content={
                    <div className={styles.tooltipContent}>
                      <FormattedMessage
                        {...MSG.tooltipColonyCreationDisabled}
                      />
                    </div>
                  }
                >
                  <div>
                    <Button
                      appearance={{ theme: 'primary', size: 'large' }}
                      type="submit"
                      data-test="claimColonyNameConfirm"
                      disabled={
                        DISABLE_COLONY_CREATION_DUE_TO_HIGH_GAS_COSTS ||
                        !isValid ||
                        (!dirty && !stepCompleted)
                      }
                      loading={isSubmitting}
                      text={MSG.continue}
                    />
                  </div>
                </Tooltip>
              </div>
            </div>
          </section>
        );
      }}
    </Form>
  );
};

StepColonyName.displayName = displayName;

export default StepColonyName;
