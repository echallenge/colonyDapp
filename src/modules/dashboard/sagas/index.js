/* @flow */
import { all } from 'redux-saga/effects';

import colonySagas from './colony';

export default function* dashboardSagas(): any {
  yield all([colonySagas()]);
}