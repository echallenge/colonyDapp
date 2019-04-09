/* @flow */

import type { ENSName } from '~types';

import { ACTIONS } from '~redux';

// eslint-disable-next-line import/prefer-default-export
export const fetchRoles = (colonyENSName: ENSName) => ({
  type: ACTIONS.COLONY_ROLES_FETCH,
  payload: {
    ensName: colonyENSName,
  },
  meta: {
    keyPath: [colonyENSName],
  },
});