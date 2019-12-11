import { Address } from '~types/index';
import { FetchableDataRecord, TaskMetadataRecord } from '~immutable/index';

import { RootStateRecord } from '../../state';
import {
  DASHBOARD_NAMESPACE as ns,
  DASHBOARD_TASK_METADATA,
} from '../constants';

/*
 * Input selectors
 */
export const colonyTaskMetadataSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
): FetchableDataRecord<TaskMetadataRecord> | undefined =>
  state.getIn([ns, DASHBOARD_TASK_METADATA, colonyAddress]);
