import { Map as ImmutableMap, fromJS } from 'immutable';

import {
  UserPermissionsRecord,
  UserPermissions,
  FetchableData,
} from '~immutable/index';
import { withFetchableDataMap } from '~utils/reducers';
import { ActionTypes, ReducerType } from '~redux/index';

import { CurrentUserPermissionsType } from '../../state/index';

const userPermissionsReducer: ReducerType<CurrentUserPermissionsType> = (
  state = ImmutableMap(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.USER_PERMISSIONS_FETCH_SUCCESS: {
      const {
        payload: { permissions, colonyAddress },
      } = action;
      return state.mergeIn(
        [colonyAddress],
        FetchableData<UserPermissionsRecord>({
          record: UserPermissions(fromJS(permissions)),
        }),
      );
    }
    default:
      return state;
  }
};

export default withFetchableDataMap<
  CurrentUserPermissionsType,
  UserPermissionsRecord
>(ActionTypes.USER_PERMISSIONS_FETCH, ImmutableMap())(userPermissionsReducer);