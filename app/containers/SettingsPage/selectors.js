import { createSelector } from 'reselect';
import {fromJS} from 'immutable'

/**
 * Direct selector to the settingsPage state domain
 */
export const selectSettingsPageDomain = (state) => state.get('settingsPage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by SettingsPage
 */

const makeSelectSettingsPage = () => createSelector(
  selectSettingsPageDomain,
  (substate) => substate.toJS()
);

export default makeSelectSettingsPage;

//
//
// export {
//   selectSettingsPageDomain,
// };

const empty = fromJS([])
export const companies = (state) => { return state ? state.getIn(["settings","companies"]) : empty };
export const segments = (state) => state ? state.getIn(["settings","segments"]) : empty ;
export const currencies = (state) => state ? state.getIn(["settings","currencies"]) : empty ;
export const glPeriods = (state) => state ? state.getIn(["settings","glPeriods"]) : empty ;
export const uiData = (state) => state ? state.getIn(["settings","uiData"]) : fromJS({uiData:{} });
