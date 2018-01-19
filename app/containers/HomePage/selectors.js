/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import {fromJS} from 'immutable'

// const selectHome = (state) => state.get('home');

// const makeSelectUsername = () => createSelector(
//   selectHome,
//   (homeState) => homeState.get('username')
// );
  const empty = fromJS([])
  const recentVouchers = (state) => { return state ? state.getIn(["home","recentVouchers"]) : empty };
  const commonVouchers = (state) => state ? state.getIn(["home","commonVouchers"]) : empty ;
  const recurringVouchers = (state) => state ? state.getIn(["home","recurringVouchers"]) : empty ;


export {
  recentVouchers,
  commonVouchers,
  recurringVouchers
  // selectHome,
  // makeSelectUsername,
};
