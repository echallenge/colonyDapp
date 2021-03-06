import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import Heading from '~core/Heading';
import { useLoggedInUser, Colony } from '~data/index';
import { useTransformer } from '~utils/hooks';

import { getUserRolesForDomain } from '../../../transformers';
import { canAdminister } from '../../../users/checks';

import OrganizationAddDomains from '../Domains/OrganizationAddDomains';
import DomainList from './DomainList';

import styles from './Domains.css';

interface Props {
  colony: Colony;
}

const MSG = defineMessages({
  title: {
    id: 'admin.Domains.title',
    defaultMessage: 'Domains',
  },
  noCurrentDomains: {
    id: 'admin.Domains.noCurrentDomains',
    defaultMessage: `
      It looks like no domains are currently added to this colony.
      You can add one by adding through the input field above.
    `,
  },
});

const displayName = 'admin.Domains';

const Domains = ({ colony: { colonyAddress, domains }, colony }: Props) => {
  const { walletAddress } = useLoggedInUser();

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
      <OrganizationAddDomains colonyAddress={colonyAddress} />
      <section className={styles.list}>
        {/*
         * DomainList follows the design principles from TaskList in dashboard,
         * but if it turns out we're going to use this in multiple places,
         * we should consider moving it to core
         */}
        {domains && domains.length > 0 ? (
          <DomainList
            colonyAddress={colonyAddress}
            domains={domains}
            label={MSG.title}
            viewOnly={!canAdminister(rootRoles)}
          />
        ) : (
          <>
            <Heading
              appearance={{
                size: 'small',
                weight: 'bold',
                margin: 'small',
              }}
              text={MSG.title}
            />
            <p>
              <FormattedMessage {...MSG.noCurrentDomains} />
            </p>
          </>
        )}
      </section>
    </div>
  );
};

Domains.displayName = displayName;

export default Domains;
