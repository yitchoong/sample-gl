/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */
import { fromJS } from 'immutable';

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

  HOME_DATA_KO,
  HOME_PAGE_DATA
  
} from './constants';

// The initial state of the App
// const initialState = fromJS({
//   recentVouchers : [{id:1, date:new Date(2017,12,23), amount: 200.34, description:"Pay myself", status:"posted"}],
//   recurringJvs: [{id:1, description:"Pay rent", amount: "950.00", previousDate: new Date(2017,12,28), nextDate: new Date(2018,1,28)}],
//   commonJvs: [{id:1, description:"Pay salary", debit: "Salary expense", credit: "Bank"}]
// });

const initialState = fromJS({
  recentVouchers : [],
  recurringVouchers: [],
  commonVouchers: [],
  uidata : {
    error: false,
    loading: false,
    currentUser: 'Joe Demo'
  }  
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case RECENT_VOUCHERS:
    case RECURRING_VOUCHERS:
    case COMMON_VOUCHERS:
      return state.setIn(['uidata','loading'], true);
    case RECENT_VOUCHERS_OK:
      return state.set('recentVouchers', action.vouchers);
    case COMMON_VOUCHERS_OK:
      return state.set('commonVouchers', action.vouchers);
    case RECURRING_VOUCHERS_OK:
      return state.set('recurringVouchers', action.vouchers);
    case RECENT_VOUCHERS_KO:
      return state.setIn(['uidata','error'], 'Fetch recent vouchers : ' + action.error);
    case COMMON_VOUCHERS_KO:
      return state.setIn(['uidata','error'], 'Fetch common vouchers : ' + action.error);
    case RECURRING_VOUCHERS_KO:
      return state.setIn(['uidata','error'], 'Fetch recurring vouchers : ' + action.error);
    case HOME_DATA_KO:
      return state.setIn(['uidata','error'], 'Fetch home data error : ' + action.error);
    default:
      return state;
  }
}

export default homeReducer;
