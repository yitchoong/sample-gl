/**
 * Gets the repositories of the user from Github
 */

import { call, put, select, fork, takeLatest, takeEvery, all } from 'redux-saga/effects';
// import { LOAD_REPOS } from 'containers/App/constants';
// import { reposLoaded, repoLoadingError } from 'containers/App/actions';
// import { makeSelectUsername } from 'containers/HomePage/selectors';

import request from 'utils/request';
import { RECENT_VOUCHERS, COMMON_VOUCHERS, RECURRING_VOUCHERS, HOME_PAGE_DATA } from './constants';
import * as actions from './actions';
/**
 * request/response handler
 */
function* getRecentVouchers() {
  // Select username from store
  // const username = yield select(makeSelectUsername());
  // const requestURL = `https://api.github.com/users/${username}/repos?type=all&sort=updated`;
  const requestUrl = `http://localhost:8080/recentVouchers.json`

  try {
    const jvs = yield call(request, requestURL);
    yield put(actions.recentVouchersOk(jvs));
  } catch (err) {
    console.log("recentVouchers error", err)
    yield put(actions.recentVouchersKo(err));
  }
}

function* recentVouchersWatcher() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeEvery(RECENT_VOUCHERS, getRecentVouchers);
}

function* getCommonVouchers() {
    const requestUrl = `http://localhost:8080/commonVouchers.json`
    try {
      const common = yield call(request, requestURL);
      yield put(actions.commonVouchersOk(common));
    } catch (err) {
      console.log("commonVouchers error", err)
      yield put(actions.commonVouchersKo(err));
    }  
}
function* commonVouchersWatcher() {
  yield takeEvery(COMMON_VOUCHERS, getCommonVouchers);
}

function* getRecurringVouchers() {
  const requestUrl = `http://localhost:8080/recurringVouchers.json`
  try {
    const recurring = yield call(request, requestURL);
    yield put(actions.recurringVouchersOk(recurring));
  } catch (err) {
    console.log("recurringVouchers error", err)
    yield put(actions.recurringVouchersKo(err));
  }  
}
function* recurringVouchersWatcher() {
yield takeEvery(RECURRING_VOUCHERS, getRecurringVouchers);
}


function* getHomePageData() {
  const recentUrl = `http://localhost:8080/recentVouchers.json`
  const commonUrl = `http://localhost:8080/commonVouchers.json`
  const recurringUrl = `http://localhost:8080/recurringVouchers.json`
  
  // const urls = [recentUrl, commonUrl, recurringUrl]
  // try {
  //   const responses = yield urls.map( u => call (request, u));

  // }
  try {
    const [recent, common, recurring] = yield all([
      call(request, recentUrl),
      call(request, commonUrl),
      call(request, recurringUrl)
    ])
    yield all([ 
      put(actions.recentVouchersOk(recent)), 
      put(actions.commonVouchersOk(common)),
      put(actions.recurringVouchersOk(recurring))
    ])
  
  } catch (err) {
    yield put(actions.homeDataKo(err))
  }
}
function* homePageWatcher() {
  yield takeEvery(HOME_PAGE_DATA, getHomePageData);
  }
  

/**
 * Root saga manages watcher lifecycle
 */

export default function* rootSaga () {
  yield [
      fork(recentVouchersWatcher), // saga1 can also yield [ fork(actionOne), fork(actionTwo) ]
      fork(commonVouchersWatcher),
      fork(recurringVouchersWatcher),
      fork(homePageWatcher),
  ];
}
