import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { createSelector } from 'reselect';

import { Address } from '~types/index';
import { RootStateRecord, TaskDraftId } from '~immutable/index';

import {
  DASHBOARD_NAMESPACE as ns,
  DASHBOARD_TASK_FEED_ITEMS,
  DASHBOARD_TASK_METADATA,
  DASHBOARD_TASK_REQUESTS,
  DASHBOARD_TASKS,
} from '../constants';

/*
 * Input selectors
 */
export const colonyTaskMetadataSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
) => state.getIn([ns, DASHBOARD_TASK_METADATA, colonyAddress]);

export const taskMetadataSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
  draftId: TaskDraftId,
) =>
  state.getIn([ns, DASHBOARD_TASK_METADATA, colonyAddress, 'record', draftId]);

export const taskSelector = (state: RootStateRecord, draftId: TaskDraftId) =>
  state.getIn([ns, DASHBOARD_TASKS, draftId]);

export const tasksByIdsSelector = (
  state: RootStateRecord,
  draftIds: [Address, TaskDraftId][],
) =>
  state
    // @ts-ignore
    .getIn([ns, DASHBOARD_TASKS], ImmutableMap())
    .filter((task, draftId) => draftIds.find(entry => entry[1] === draftId));

export const taskFeedItemsSelector = (
  state: RootStateRecord,
  draftId: TaskDraftId,
) => state.getIn([ns, DASHBOARD_TASK_FEED_ITEMS, draftId]);

export const taskRequestsSelector = createSelector(
  taskSelector,
  task =>
    task
      ? task.getIn(['record', DASHBOARD_TASK_REQUESTS], ImmutableSet())
      : ImmutableSet(),
);