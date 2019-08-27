import nanoid from 'nanoid';

import { AllActions, ActionTypes } from '~redux/index';
import { Address, createAddress } from '~types/index';
import { TaskDraftId } from '~immutable/index';

export const userFetch = (userAddress: Address): AllActions => ({
  type: ActionTypes.USER_FETCH,
  meta: { key: createAddress(userAddress) },
  payload: { userAddress },
});

export const userTokensFetch = (): AllActions => ({
  type: ActionTypes.USER_TOKENS_FETCH,
});

export const userTokenTransfersFetch = (): AllActions => ({
  type: ActionTypes.USER_TOKEN_TRANSFERS_FETCH,
});

export const currentUserGetBalance = (): AllActions => ({
  type: ActionTypes.CURRENT_USER_GET_BALANCE,
});

export const userPermissionsFetch = (colonyAddress: Address): AllActions => ({
  type: ActionTypes.USER_PERMISSIONS_FETCH,
  meta: { key: createAddress(colonyAddress) },
  payload: { colonyAddress },
});

export const userTokensUpdate = (tokens: Address[]): AllActions => ({
  type: ActionTypes.USER_TOKENS_UPDATE,
  payload: { tokens },
});

export const subscribeToColony = (colonyAddress: Address): AllActions => ({
  type: ActionTypes.USER_COLONY_SUBSCRIBE,
  payload: { colonyAddress },
  meta: { id: nanoid() },
});

export const subscribeToTask = (
  colonyAddress: Address,
  draftId: TaskDraftId,
): AllActions => ({
  type: ActionTypes.USER_TASK_SUBSCRIBE,
  payload: { colonyAddress, draftId },
});

export const currentUserFetchTasks = (): AllActions => ({
  type: ActionTypes.USER_SUBSCRIBED_TASKS_FETCH,
});

export const fetchUserColonies = (
  walletAddress: Address,
  metadataStoreAddress: string,
): AllActions => ({
  type: ActionTypes.USER_SUBSCRIBED_COLONIES_FETCH,
  meta: { key: createAddress(walletAddress) },
  payload: { walletAddress, metadataStoreAddress },
});

export const userSubStart = (userAddress: Address): AllActions => ({
  type: ActionTypes.USER_SUB_START,
  meta: { key: createAddress(userAddress) },
  payload: { userAddress },
});

export const userSubStop = (userAddress: Address): AllActions => ({
  type: ActionTypes.USER_SUB_STOP,
  meta: { key: createAddress(userAddress) },
  payload: { userAddress },
});

export const currentUserTasksSubStart = (): AllActions => ({
  type: ActionTypes.USER_SUBSCRIBED_TASKS_SUB_START,
});

export const currentUserTasksSubStop = (): AllActions => ({
  type: ActionTypes.USER_SUBSCRIBED_TASKS_SUB_STOP,
});

export const userColoniesSubStart = (
  walletAddress: Address,
  metadataStoreAddress: string,
): AllActions => ({
  type: ActionTypes.USER_SUBSCRIBED_COLONIES_SUB_START,
  meta: { key: createAddress(walletAddress) },
  payload: { walletAddress, metadataStoreAddress },
});

export const userColoniesSubStop = (walletAddress: Address): AllActions => ({
  type: ActionTypes.USER_SUBSCRIBED_COLONIES_SUB_STOP,
  meta: { key: createAddress(walletAddress) },
  payload: { walletAddress },
});