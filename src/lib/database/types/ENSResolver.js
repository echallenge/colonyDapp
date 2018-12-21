/* @flow */

import type ColonyNetworkClient from '@colony/colony-js-client';

export interface ENSResolverType {
  type: string;

  _networkClient: ColonyNetworkClient;

  getDomain(identifier: string): string;

  lookupDomainNameFromAddress(ensAddress: string): Promise<string>;

  getENSAddressForENSName(name: string): Promise<string>;

  resolve(identifier: string): Promise<string>;
}
