// import { take, call, put, select } from 'redux-saga/effects';
import * as c from './constants';
import * as actions from './actions';
import {fromJS} from 'immutable'

// Individual exports for testing
export default function* defaultSaga() {
  // See example in containers/HomePage/saga.js
}

// function* settingsFetchWatcher() {
//     yield takeEvery(c.SETTINGS_FETCH, fetchSettingsWorker);
// }
// function* fetchSettingsWorker(action) {
//     try {
//       // for the moment, we wont do the fetch, just make up some data
//       const settings = fromJS({
//         companies: [],
//         segments:  [],
//         glPeriods: [],
//         currencies:[],
//         uiData : {
//           error: false,
//           loading: false,
//           currentTab: 1,
//         }
//       });
//       yield call({type: c.SETTINGS_FETCH_OK, settings})
//
//     } catch (errors) {
//       yield put({type: c.SETTINGS_FETCH_KO, errors})
//     }
// }
