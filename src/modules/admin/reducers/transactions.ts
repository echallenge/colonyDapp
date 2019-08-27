import { List as ListType, Map as ImmutableMap, List, fromJS } from 'immutable';

import {
  ContractTransactionRecord,
  DataRecord,
  AdminTransactionsState,
  ContractTransactionRecordType,
} from '~immutable/index';
import { withDataRecordMap } from '~utils/reducers';
import { ActionTypes, ReducerType } from '~redux/index';

const adminTransactionsReducer: ReducerType<AdminTransactionsState> = (
  state = ImmutableMap(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.COLONY_TRANSACTIONS_FETCH_SUCCESS: {
      const {
        payload: { transactions },
        meta: { key },
      } = action;
      return state.set(
        key,
        DataRecord<ListType<ContractTransactionRecordType>>({
          record: List(
            transactions.map(tx => ContractTransactionRecord(fromJS(tx))),
          ),
        }),
      );
    }
    default:
      return state;
  }
};

export default withDataRecordMap<
  AdminTransactionsState,
  ContractTransactionRecordType
>(ActionTypes.COLONY_TRANSACTIONS_FETCH, ImmutableMap())(
  adminTransactionsReducer,
);