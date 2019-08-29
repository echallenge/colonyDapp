import {
  Map as ImmutableMap,
  Set as ImmutableSet,
  List,
  fromJS,
} from 'immutable';

import { ReducerType, ActionTypes } from '~redux/index';
import {
  TaskRecordType,
  TasksMap,
  DataRecord,
  TaskPayoutRecord,
  TaskRecord,
} from '~immutable/index';
import { withDataRecordMap } from '~utils/reducers';
import { EventTypes, TaskState } from '~data/constants';
import { AllEvents, createAddress } from '~types/index';

const taskEventReducer = (
  task: TaskRecordType,
  event: AllEvents,
): TaskRecordType => {
  switch (event.type) {
    case EventTypes.TASK_CREATED: {
      const {
        payload: { creatorAddress, draftId },
        meta: { timestamp },
      } = event;
      return task.merge(
        fromJS({
          createdAt: new Date(timestamp),
          creatorAddress,
          currentState: TaskState.ACTIVE,
          draftId,
          managerAddress: creatorAddress,
          domainId: 1,
        }),
      );
    }

    case EventTypes.DUE_DATE_SET: {
      const { dueDate } = event.payload;
      return task.set('dueDate', dueDate ? new Date(dueDate) : undefined);
    }

    case EventTypes.DOMAIN_SET: {
      const { domainId } = event.payload;
      return task.set('domainId', domainId);
    }

    case EventTypes.SKILL_SET: {
      const { skillId } = event.payload;
      return task.set('skillId', skillId);
    }

    case EventTypes.TASK_TITLE_SET: {
      const { title } = event.payload;
      return task.set('title', title);
    }

    case EventTypes.TASK_DESCRIPTION_SET: {
      const { description } = event.payload;
      return task.set('description', description);
    }

    case EventTypes.TASK_FINALIZED:
      return task.set('currentState', TaskState.FINALIZED);

    case EventTypes.TASK_CANCELLED:
      return task.set('currentState', TaskState.CANCELLED);

    case EventTypes.WORK_INVITE_SENT: {
      const { workerAddress } = event.payload;
      return task.update('invites', invites => invites.add(workerAddress));
    }

    case EventTypes.WORK_REQUEST_CREATED: {
      const { workerAddress } = event.payload;
      return task.update('requests', requests => requests.add(workerAddress));
    }

    case EventTypes.WORKER_ASSIGNED: {
      const { workerAddress } = event.payload;
      return task.set('workerAddress', createAddress(workerAddress));
    }

    case EventTypes.WORKER_UNASSIGNED:
      return task.delete('workerAddress');

    case EventTypes.PAYOUT_SET: {
      const { amount, token } = event.payload;
      return task.set(
        'payouts',
        List([
          TaskPayoutRecord(
            fromJS({
              amount,
              token: createAddress(token),
            }),
          ),
        ]),
      );
    }

    case EventTypes.PAYOUT_REMOVED: {
      return task.set('payouts', List());
    }

    default:
      return task;
  }
};

const tasksReducer: ReducerType<TasksMap> = (
  state = ImmutableMap(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.TASK_CREATE_SUCCESS: {
      const {
        draftId,
        task: { colonyAddress, creatorAddress },
      } = action.payload;
      return state.set(
        draftId,
        DataRecord<TaskRecordType>({
          error: undefined,
          isFetching: false,
          record: TaskRecord(
            fromJS({ colonyAddress, creatorAddress, draftId }),
          ),
        }),
      );
    }

    case ActionTypes.TASK_FETCH_SUCCESS: {
      const {
        draftId,
        task: { requests = [], invites = [], payouts = [], ...task },
      } = action.payload;
      return state.set(
        draftId,
        DataRecord<TaskRecordType>({
          error: undefined,
          isFetching: false,
          record: TaskRecord(
            fromJS({
              ...task,
              requests: ImmutableSet(requests),
              invites: ImmutableSet(invites),
              payouts: List(
                payouts.map(({ amount, token }) =>
                  TaskPayoutRecord({ amount, token }),
                ),
              ),
            }),
          ),
        }),
      );
    }

    case ActionTypes.TASK_SUB_EVENTS: {
      const { colonyAddress, draftId, events } = action.payload;

      const record: TaskRecordType = events.reduce(
        taskEventReducer,
        TaskRecord(fromJS({ colonyAddress, draftId })),
      );
      return state.set(draftId, DataRecord({ record }));
    }

    default:
      return state;
  }
};

export default withDataRecordMap<TasksMap, TaskRecordType>(
  // @ts-ignore
  new Set([ActionTypes.TASK_FETCH, ActionTypes.TASK_SUB_START]),
  ImmutableMap(),
)(tasksReducer);