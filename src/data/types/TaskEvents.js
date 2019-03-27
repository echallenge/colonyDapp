/* @flow */

import { TASK_EVENT_TYPES, TASK_STATUS } from '../constants';

import type { EventDefinition } from './events';

const {
  COMMENT_POSTED,
  COMMENT_STORE_CREATED,
  DOMAIN_SET,
  DUE_DATE_SET,
  PAYOUT_SET,
  SKILL_SET,
  TASK_CANCELLED,
  TASK_CLOSED,
  TASK_CREATED,
  TASK_DESCRIPTION_SET,
  TASK_FINALIZED,
  TASK_TITLE_SET,
  WORK_INVITE_SENT,
  WORK_REQUEST_CREATED,
  WORKER_ASSIGNED,
  WORKER_UNASSIGNED,
} = TASK_EVENT_TYPES;

export type TaskEvents = {|
  COMMENT_POSTED: EventDefinition<
    typeof COMMENT_POSTED,
    {|
      signature: string,
      content: {|
        id: string,
        author: string,
        body: string,
        timestamp: number,
        metadata?: {|
          mentions: string[],
        |},
      |},
    |},
  >,
  COMMENT_STORE_CREATED: EventDefinition<
    typeof COMMENT_STORE_CREATED,
    {|
      commentsStoreAddress: string,
    |},
  >,
  DOMAIN_SET: EventDefinition<
    typeof DOMAIN_SET,
    {|
      domainId: number,
    |},
  >,
  DUE_DATE_SET: EventDefinition<
    typeof DUE_DATE_SET,
    {|
      dueDate: number,
    |},
  >,
  PAYOUT_SET: EventDefinition<
    typeof PAYOUT_SET,
    {|
      amount: string,
      token: string,
    |},
  >,
  SKILL_SET: EventDefinition<
    typeof SKILL_SET,
    {|
      skillId: number,
    |},
  >,
  TASK_CANCELLED: EventDefinition<
    typeof TASK_CANCELLED,
    {|
      status: typeof TASK_STATUS.CANCELLED,
    |},
  >,
  TASK_CLOSED: EventDefinition<
    typeof TASK_CLOSED,
    {|
      status: typeof TASK_STATUS.CLOSED,
    |},
  >,
  TASK_CREATED: EventDefinition<
    typeof TASK_CREATED,
    {|
      creator: string,
      draftId: string,
    |},
  >,
  TASK_DESCRIPTION_SET: EventDefinition<
    typeof TASK_DESCRIPTION_SET,
    {|
      description: string,
    |},
  >,
  TASK_FINALIZED: EventDefinition<
    typeof TASK_FINALIZED,
    {|
      status: typeof TASK_STATUS.FINALIZED,
      worker: string,
      amountPaid: string,
      token?: string,
      paymentId?: number,
    |},
  >,
  TASK_TITLE_SET: EventDefinition<
    typeof TASK_TITLE_SET,
    {|
      title: string,
    |},
  >,
  WORK_INVITE_SENT: EventDefinition<
    typeof WORK_INVITE_SENT,
    {|
      worker: string,
    |},
  >,
  WORK_REQUEST_CREATED: EventDefinition<
    typeof WORK_REQUEST_CREATED,
    {|
      worker: string,
    |},
  >,
  WORKER_ASSIGNED: EventDefinition<
    typeof WORKER_ASSIGNED,
    {|
      worker: string,
    |},
  >,
  WORKER_UNASSIGNED: EventDefinition<
    typeof WORKER_UNASSIGNED,
    {|
      worker: string,
    |},
  >,
|};