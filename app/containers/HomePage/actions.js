/*
 * Home Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */
import {fromJS} from 'immutable';
import {
  RECENT_VOUCHERS,
  COMMON_VOUCHERS,
  RECURRING_VOUCHERS,
  RECENT_VOUCHERS_OK,
  COMMON_VOUCHERS_OK,
  RECURRING_VOUCHERS_OK,
  RECENT_VOUCHERS_KO,
  COMMON_VOUCHERS_KO,
  RECURRING_VOUCHERS_KO,
  HOME_PAGE_DATA
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */
export function fetchRecentVouchers() {
  return {
    type: RECENT_VOUCHERS,
  };
}
export function recentVouchersOk(vouchers) {
  return {
    type: RECENT_VOUCHERS_OK,
    vouchers: fromJS(vouchers)
  };
}
export function recentVouchersKo(err) {
  return {
    type: RECENT_VOUCHERS_KO,
    error: err
  };
}


export function fetchRecurringVouchers() {
  return {
    type: RECURRING_VOUCHERS,
  };
}

export function recurringVouchersOk(vouchers) {
  return {
    type: RECURRING_VOUCHERS_OK,
    vouchers: fromJS(vouchers)
  };
}
export function recurringVouchersKo(err) {
  return {
    type: RECURRING_VOUCHERS_KO,
    error: err
  };
}


export function fetchCommonVouchers() {
  return {
    type: COMMON_VOUCHERS,
  };
}
export function commonVouchersOk(vouchers) {
  return {
    type: COMMON_VOUCHERS_OK,
    vouchers: fromJS(vouchers)
  };
}
export function commonVouchersKo(err) {
  return {
    type: COMMON_VOUCHERS_KO,
    error: err
  };
}

export function homeDataKo(err) {
  return {
    type: HOME_DATA_KO,
    error: err
  };
}

export function fetchHomePageData() {
  return {
    type: HOME_PAGE_DATA,
  };
}
