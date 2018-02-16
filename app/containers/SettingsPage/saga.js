// import { take, call, put, select } from 'redux-saga/effects';
import {SETTINGS_FETCH, SETTINGS_FETCH_OK, SETTINGS_FETCH_KO} from './constants';
const actions = require( './actions' ) ;
import {fromJS} from 'immutable'
import { take, call, put, select, fork, takeLatest, takeEvery, all } from 'redux-saga/effects';
import request from 'utils/request';

const requestUrl = `http://localhost:8080/settgs.json`

function* fetchSettingsWorker(action) {
    try {
      // console.log("Saga, actions=", action)
      // for the moment, we wont do the fetch, just make up some data
      // const settings = {
      //   companies: {companyList:[{companyNo:"1", abbreviation:'zz', companyName:'zztop corp'}]},
      //   segments:  [],
      //   glPeriods: [],
      //   currencies:[],
      //   uiData : {
      //     error: false,
      //     loading: false,
      //     currentTab: 1,
      //     filter: {}
      //   }
      // };
      const settings = yield call(request, requestUrl);
      // console.log("settings from ajax", settings)
      // placeholder: we should be calling backend to get the settings document
      yield put({type: SETTINGS_FETCH_OK, settings})

    } catch (errs) {
      console.log("*** saga errors", errs)
      yield put({type: SETTINGS_FETCH_KO, errs})
      
    }
}
function* settingsFetchWatcher() {
  // while (true) {
  //   const {params} = yield take(SETTINGS_FETCH)
  //   yield call(fetchSettingsWorker, params)
  // }
  const action = yield takeLatest(SETTINGS_FETCH, fetchSettingsWorker)
}
export default function* defaultSaga() {
  // See example in containers/HomePage/saga.js
  const [settings] = yield all([
    call(settingsFetchWatcher),
  ])
}

