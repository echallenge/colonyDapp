/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
import type { WalletObjectType } from '@colony/purser-core/flowtypes';

import type { Address, ENSName, OrbitDBAddress } from '~types';
import type { TaskDraftId } from '~immutable';

import type { UserProfileStoreValues } from './storeValuesTypes';
import type { DDB } from '../lib/database';
import type {
  EventStore,
  FeedStore,
  ValidatedKVStore,
} from '../lib/database/stores';

import ENS from '../lib/ENS';

import {
  colony as colonyStoreBlueprint,
  comments as commentsStoreBlueprint,
  task as taskStoreBlueprint,
  userInbox as userInboxStoreBlueprint,
  userMetadata as userMetadataStoreBlueprint,
  userProfile as userProfileStoreBlueprint,
} from './blueprints';

export const getColonyStore = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({
  colonyAddress,
  colonyName,
}: {
  colonyAddress: string,
  colonyName: ENSName,
}) =>
  ddb.getStore<EventStore>(
    colonyStoreBlueprint,
    ENS.getFullDomain('colony', colonyName),
    {
      wallet,
      colonyAddress,
      colonyClient,
    },
  );

export const createColonyStore = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({ colonyAddress }: { colonyAddress: Address }) =>
  ddb.createStore<EventStore>(colonyStoreBlueprint, {
    wallet,
    colonyAddress,
    colonyClient,
  });

export const getTaskStore = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({
  colonyAddress,
  colonyName,
  draftId,
  taskStoreAddress,
}: {
  colonyAddress: Address,
  colonyName: ENSName,
  draftId: TaskDraftId,
  taskStoreAddress: string | OrbitDBAddress,
}) =>
  ddb.getStore<EventStore>(taskStoreBlueprint, taskStoreAddress, {
    wallet,
    colonyAddress,
    colonyClient,
    draftId,
    meta: {
      colonyName,
    },
  });

export const getCommentsStore = (ddb: DDB) => async ({
  commentsStoreAddress,
}: {
  commentsStoreAddress: string | OrbitDBAddress,
}) => ddb.getStore<EventStore>(commentsStoreBlueprint, commentsStoreAddress);

export const createTaskStore = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({
  draftId,
  colonyAddress,
  colonyName,
}: {
  draftId: string,
  colonyAddress: Address,
  colonyName: ENSName,
}) => {
  const [taskStore, commentsStore] = await Promise.all([
    ddb.createStore<EventStore>(taskStoreBlueprint, {
      wallet,
      colonyAddress,
      colonyClient,
      draftId,
      meta: {
        colonyName,
      },
    }),
    ddb.createStore<EventStore>(commentsStoreBlueprint),
  ]);
  return { taskStore, commentsStore };
};

export const getUserProfileStore = (ddb: DDB) => async ({
  walletAddress,
}: {
  walletAddress: string,
}) =>
  ddb.getStore<ValidatedKVStore<UserProfileStoreValues>>(
    userProfileStoreBlueprint,
    walletAddress,
    {
      walletAddress,
    },
  );

export const getUserInboxStore = (ddb: DDB) => async ({
  inboxStoreAddress,
  walletAddress,
}: {
  inboxStoreAddress: string | string | OrbitDBAddress,
  walletAddress: string,
}) =>
  ddb.getStore<FeedStore>(userInboxStoreBlueprint, inboxStoreAddress, {
    walletAddress,
  });

export const getUserMetadataStore = (ddb: DDB) => async ({
  userMetadataStoreAddress,
  walletAddress,
}: {
  userMetadataStoreAddress: string | OrbitDBAddress,
  walletAddress: string,
}) =>
  ddb.getStore<EventStore>(
    userMetadataStoreBlueprint,
    userMetadataStoreAddress,
    {
      walletAddress,
    },
  );

export const createUserProfileStore = (ddb: DDB) => async ({
  walletAddress,
}: {
  walletAddress: string,
}) => {
  const [profileStore, inboxStore, metadataStore] = await Promise.all([
    ddb.createStore<ValidatedKVStore<UserProfileStoreValues>>(
      userProfileStoreBlueprint,
      {
        walletAddress,
      },
    ),
    ddb.createStore<FeedStore>(userInboxStoreBlueprint, {
      walletAddress,
    }),
    ddb.createStore<EventStore>(userMetadataStoreBlueprint, {
      walletAddress,
    }),
  ]);

  await profileStore.set({
    inboxStoreAddress: inboxStore.address.toString(),
    metadataStoreAddress: metadataStore.address.toString(),
  });
  await profileStore.load();

  return { profileStore, inboxStore, metadataStore };
};
