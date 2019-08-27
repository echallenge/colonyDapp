import { Address, createAddress } from '~types/index';
import {
  ColonyManager,
  ColonyStore,
  ColonyTaskIndexStore,
  Command,
  DDB,
  Wallet,
} from '~data/types';
import { Context } from '~context/index';
import { createEvent } from '~data/utils';
import { EventTypes } from '~data/constants';
import { getColonyStore, createColonyStore } from '~data/stores';
import { diffAddresses } from '~utils/arrays';
import {
  CreateColonyProfileCommandArgsSchema,
  CreateDomainCommandArgsSchema,
  EditDomainCommandArgsSchema,
  RemoveColonyAvatarCommandArgsSchema,
  SetColonyAvatarCommandArgsSchema,
  UpdateColonyProfileCommandArgsSchema,
} from './schemas';

interface ColonyStoreMetadata {
  colonyAddress: Address;
}

const prepareColonyStoreQuery = async (
  {
    colonyManager,
    ddb,
    wallet,
  }: {
    colonyManager: ColonyManager;
    ddb: DDB;
    wallet: Wallet;
  },
  metadata: ColonyStoreMetadata,
) => {
  const { colonyAddress } = metadata;
  const colonyClient = await colonyManager.getColonyClient(colonyAddress);
  return getColonyStore(colonyClient, ddb, wallet)(metadata);
};

export const createColonyProfile: Command<
  { colonyStore: ColonyStore; colonyTaskIndexStore: ColonyTaskIndexStore },
  ColonyStoreMetadata,
  {
    colonyAddress: Address;
    colonyName: string;
    displayName: string;
    token: {
      address: Address;
      iconHash?: string | null;
      isExternal?: boolean;
      isNative?: boolean | null;
      name: string;
      symbol: string;
    };
  },
  ColonyStore
> = {
  name: 'createColonyProfile',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  async prepare(
    {
      colonyManager,
      ddb,
      wallet,
    }: {
      colonyManager: ColonyManager;
      ddb: DDB;
      wallet: Wallet;
    },
    metadata: ColonyStoreMetadata,
  ) {
    const { colonyAddress } = metadata;
    const colonyClient = await colonyManager.getColonyClient(colonyAddress);
    return createColonyStore(colonyClient, ddb, wallet)(metadata);
  },
  schema: CreateColonyProfileCommandArgsSchema,
  async execute(
    { colonyStore, colonyTaskIndexStore },
    {
      colonyAddress,
      colonyName,
      displayName,
      token: { iconHash, isNative, isExternal, ...token },
    },
  ) {
    await colonyStore.init(
      createEvent(EventTypes.TASK_INDEX_STORE_REGISTERED, {
        taskIndexStoreAddress: colonyTaskIndexStore.address.toString(),
      }),
    );

    const profileCreatedEvent = createEvent(EventTypes.COLONY_PROFILE_CREATED, {
      colonyAddress,
      colonyName,
      displayName,
    });
    const tokenInfoAddedEvent = createEvent(EventTypes.TOKEN_INFO_ADDED, {
      isExternal: !!isExternal,
      isNative: !!isNative,
      ...(iconHash ? { iconHash } : null),
      ...token,
    });
    await colonyStore.append(profileCreatedEvent);
    await colonyStore.append(tokenInfoAddedEvent);
    await colonyStore.load();
    return colonyStore;
  },
};

export const createDomain: Command<
  ColonyStore,
  ColonyStoreMetadata,
  {
    name: string;
    domainId: number;
  },
  ColonyStore
> = {
  name: 'createDomain',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareColonyStoreQuery,
  schema: CreateDomainCommandArgsSchema,
  async execute(colonyStore, args) {
    await colonyStore.append(createEvent(EventTypes.DOMAIN_CREATED, args));
    return colonyStore;
  },
};

export const editDomain: Command<
  ColonyStore,
  ColonyStoreMetadata,
  {
    name: string;
    domainId: number;
  },
  ColonyStore
> = {
  name: 'editDomain',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareColonyStoreQuery,
  schema: EditDomainCommandArgsSchema,
  async execute(colonyStore, args) {
    await colonyStore.append(createEvent(EventTypes.DOMAIN_EDITED, args));
    return colonyStore;
  },
};

export const updateColonyProfile: Command<
  ColonyStore,
  ColonyStoreMetadata,
  {
    displayName: string;
    description?: string;
    guideline?: string;
    website?: string;
  },
  ColonyStore
> = {
  name: 'updateColonyProfile',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareColonyStoreQuery,
  schema: UpdateColonyProfileCommandArgsSchema,
  async execute(colonyStore, args) {
    await colonyStore.append(
      createEvent(EventTypes.COLONY_PROFILE_UPDATED, args),
    );
    await colonyStore.load();
    return colonyStore;
  },
};

export const setColonyAvatar: Command<
  ColonyStore,
  ColonyStoreMetadata,
  {
    ipfsHash: string;
  },
  ColonyStore
> = {
  name: 'setColonyAvatar',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareColonyStoreQuery,
  schema: SetColonyAvatarCommandArgsSchema,
  async execute(colonyStore, args) {
    await colonyStore.append(
      createEvent(EventTypes.COLONY_AVATAR_UPLOADED, args),
    );
    await colonyStore.load();
    return colonyStore;
  },
};

export const removeColonyAvatar: Command<
  ColonyStore,
  ColonyStoreMetadata,
  {
    ipfsHash: string;
  },
  ColonyStore
> = {
  name: 'removeColonyAvatar',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareColonyStoreQuery,
  schema: RemoveColonyAvatarCommandArgsSchema,
  async execute(colonyStore, args) {
    await colonyStore.append(
      createEvent(EventTypes.COLONY_AVATAR_REMOVED, args),
    );
    await colonyStore.load();
    return colonyStore;
  },
};

// This is currently unused
export const addTokenInfo: Command<
  ColonyStore,
  ColonyStoreMetadata,
  {
    address: Address;
    iconHash?: string | null;
    isExternal?: boolean;
    isNative?: boolean | null;
    name: string;
    symbol: string;
  },
  ColonyStore
> = {
  name: 'addTokenInfo',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareColonyStoreQuery,
  async execute(colonyStore, { iconHash, isNative, isExternal, ...args }) {
    const tokenInfoAddedEvent = createEvent(EventTypes.TOKEN_INFO_ADDED, {
      ...(iconHash ? { iconHash } : null),
      isExternal: !!isExternal,
      isNative: !!isNative,
      ...args,
    });
    await colonyStore.append(tokenInfoAddedEvent);
    await colonyStore.load();
    return colonyStore;
  },
};

export const updateTokenInfo: Command<
  ColonyStore,
  ColonyStoreMetadata,
  {
    tokens: Address[];
    currentTokenReferences: {
      [address: string]: any;
    };
  },
  ColonyStore
> = {
  name: 'updateTokenInfo',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareColonyStoreQuery,
  async execute(colonyStore, { tokens, currentTokenReferences = {} }) {
    // diff existing and user provided tokens
    const [add, remove] = diffAddresses(
      tokens,
      Object.keys(currentTokenReferences).map(createAddress),
    );

    // add and remove tokens as required
    await Promise.all([
      ...add.map(address =>
        colonyStore.append(
          createEvent(EventTypes.TOKEN_INFO_ADDED, { address }),
        ),
      ),
      ...remove.map(address =>
        colonyStore.append(
          createEvent(EventTypes.TOKEN_INFO_REMOVED, { address }),
        ),
      ),
    ]);

    await colonyStore.load();
    return colonyStore;
  },
};