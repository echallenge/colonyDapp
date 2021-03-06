import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import { useSelector, useTransformer } from '~utils/hooks';
import { ActionTypes } from '~redux/index';
import { DialogActionButton } from '~core/Button';
import Heading from '~core/Heading';
import ExternalLink from '~core/ExternalLink';
import UpgradeContractDialog from '~admin/UpgradeContractDialog';
import RecoveryModeDialog from '~admin/RecoveryModeDialog';
import { Colony, useLoggedInUser, useSystemInfoQuery } from '~data/index';

import { getUserRolesForDomain } from '../../../transformers';
import { networkVersionSelector } from '../../../core/selectors';
import { canEnterRecoveryMode } from '../../../users/checks';
import { canBeUpgraded } from '../../../dashboard/checks';
import UnlockTokenDialog from './UnlockTokenDialog';

import styles from './ProfileAdvanced.css';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version: dappVersion } = require('../../../../../package.json');

const TOKEN_LOCKED_URL =
  // eslint-disable-next-line max-len
  'https://help.colony.io/hc/en-us/articles/360025429094-How-to-unlock-your-colony-s-native-token';

const MSG = defineMessages({
  labelVersion: {
    id: 'admin.Profile.ProfileAdvanced.labelVersion',
    defaultMessage: 'Colony Version',
  },
  labelDappVersion: {
    id: 'admin.Profile.ProfileAdvanced.labelDappVersion',
    defaultMessage: 'Dapp Version',
  },
  labelServerVersion: {
    id: 'admin.Profile.ProfileAdvanced.labelServerVersion',
    defaultMessage: 'Server Version',
  },
  labelId: {
    id: 'admin.Profile.ProfileAdvanced.labelId',
    defaultMessage: 'Colony ID',
  },
  buttonUpdate: {
    id: 'admin.Profile.ProfileAdvanced.buttonUpdate',
    defaultMessage: 'Upgrade',
  },
  buttonRecoveryMode: {
    id: 'admin.Profile.ProfileAdvanced.buttonRecoveryMode',
    defaultMessage: 'Turn on Recovery mode',
  },
  headingRecoveryMode: {
    id: 'admin.Profile.ProfileAdvanced.headingRecoveryMode',
    defaultMessage: 'Recovery mode',
  },
  inRecoveryMode: {
    id: 'admin.Profile.ProfileAdvanced.inRecoveryMode',
    defaultMessage: `{inRecoveryMode, select,
      true {Colony is in Recovery mode}
      false {Colony is not in Recovery mode}
    }`,
  },
  tokenLockedHeading: {
    id: 'admin.Profile.ProfileAdvanced.tokenLockedHeading',
    defaultMessage: 'Make your token transferable',
  },
  tokenLockedInfo: {
    id: 'admin.Profile.ProfileAdvanced.tokenLockedInfo',
    defaultMessage:
      // eslint-disable-next-line max-len
      'Your token is locked. It will not be transferable between accounts unless it is first unlocked. It is still usable within your colony to fund tasks. {link}.',
  },
  tokenLockedLearnMore: {
    id: 'admin.Profile.ProfileAdvanced.tokenLockedLearnMore',
    defaultMessage: 'Learn more',
  },
  buttonUnlockToken: {
    id: 'admin.Profile.ProfileAdvanced.buttonUnlockToken',
    defaultMessage: 'Unlock token',
  },
  title: {
    id: 'admin.Profile.ProfileAdvanced.title',
    defaultMessage: 'Colony Advanced Settings',
  },
});

const displayName = 'admin.Profile.ProfileAdvanced';

interface Props {
  colony: Colony;
}

const ProfileAdvanced = ({
  colony: {
    colonyAddress,
    id,
    version,
    canUnlockNativeToken,
    isNativeTokenLocked,
  },
  colony,
}: Props) => {
  const { walletAddress } = useLoggedInUser();
  const networkVersion = useSelector(networkVersionSelector);
  const { data } = useSystemInfoQuery();

  const rootRoles = useTransformer(getUserRolesForDomain, [
    colony,
    walletAddress,
    ROOT_DOMAIN_ID,
  ]);

  return (
    <div className={styles.main}>
      <div className={styles.titleContainer}>
        <Heading
          text={MSG.title}
          appearance={{ size: 'medium', theme: 'dark' }}
        />
      </div>
      <section className={styles.section}>
        <div className={styles.withInlineButton}>
          <Heading
            appearance={{ size: 'small', margin: 'none' }}
            text={MSG.labelVersion}
          />
          <p className={styles.bigInfoText}>{version}</p>
        </div>
        <DialogActionButton
          appearance={{ theme: 'primary', size: 'large' }}
          text={MSG.buttonUpdate}
          dialog={UpgradeContractDialog}
          submit={ActionTypes.COLONY_VERSION_UPGRADE}
          success={ActionTypes.COLONY_VERSION_UPGRADE_SUCCESS}
          error={ActionTypes.COLONY_VERSION_UPGRADE_ERROR}
          values={{ colonyAddress }}
          disabled={!networkVersion || !canBeUpgraded(colony, networkVersion)}
        />
      </section>
      <section className={styles.section}>
        <div>
          <Heading
            appearance={{ size: 'small', margin: 'none' }}
            text={MSG.labelDappVersion}
          />
          <p className={styles.bigInfoText}>{dappVersion}</p>
        </div>
      </section>
      {data && data.systemInfo && (
        <section className={styles.section}>
          <div>
            <Heading
              appearance={{ size: 'small', margin: 'none' }}
              text={MSG.labelServerVersion}
            />
            <p className={styles.bigInfoText}>{data.systemInfo.version}</p>
          </div>
        </section>
      )}
      <section className={styles.section}>
        <Heading
          appearance={{ size: 'small', margin: 'none' }}
          text={MSG.labelId}
        />
        <p className={styles.bigInfoText}>{id}</p>
      </section>
      <section className={styles.section}>
        <div className={styles.withInlineButton}>
          <Heading
            appearance={{ size: 'small', margin: 'none' }}
            text={MSG.headingRecoveryMode}
          />
          <p className={styles.bigInfoText}>
            <FormattedMessage
              {...MSG.inRecoveryMode}
              values={{ inRecoveryMode: colony.isInRecoveryMode }}
            />
          </p>
        </div>
        <DialogActionButton
          appearance={{ theme: 'primary', size: 'large' }}
          text={MSG.buttonRecoveryMode}
          dialog={RecoveryModeDialog}
          submit={ActionTypes.COLONY_RECOVERY_MODE_ENTER}
          success={ActionTypes.COLONY_RECOVERY_MODE_ENTER_SUCCESS}
          error={ActionTypes.COLONY_RECOVERY_MODE_ENTER_ERROR}
          values={{ colonyAddress }}
          disabled={colony.isInRecoveryMode || !canEnterRecoveryMode(rootRoles)}
        />
      </section>
      {canUnlockNativeToken && isNativeTokenLocked && (
        <section className={styles.section}>
          <hr />
          <Heading
            appearance={{ size: 'small' }}
            text={MSG.tokenLockedHeading}
          />
          <p className={styles.bigInfoText}>
            <FormattedMessage
              {...MSG.tokenLockedInfo}
              values={{
                link: (
                  <ExternalLink
                    text={MSG.tokenLockedLearnMore}
                    href={TOKEN_LOCKED_URL}
                  />
                ),
              }}
            />
          </p>
          <div className={styles.unlockButton}>
            <DialogActionButton
              appearance={{ theme: 'blue', size: 'large' }}
              text={MSG.buttonUnlockToken}
              dialog={UnlockTokenDialog}
              submit={ActionTypes.COLONY_NATIVE_TOKEN_UNLOCK}
              success={ActionTypes.COLONY_NATIVE_TOKEN_UNLOCK_SUCCESS}
              error={ActionTypes.COLONY_NATIVE_TOKEN_UNLOCK_ERROR}
              values={{ colonyAddress }}
            />
          </div>
        </section>
      )}
    </div>
  );
};

ProfileAdvanced.displayName = displayName;

export default ProfileAdvanced;
