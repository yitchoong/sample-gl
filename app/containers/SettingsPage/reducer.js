/*
 *
 * SettingsPage reducer
 *
 */
import { fromJS } from 'immutable';
import * as c from './constants'

const initialState = fromJS({
  companies: [],
  segments:  [],
  glPeriods: [],
  currencies:[],
  uiData : {
    error: false,
    loading: false,
    currentTab: 1,
    filter: {}
  }
});

function settingsPageReducer(state = initialState, action) {
  let index;
  switch (action.type) {
    case c.SETTINGS_FETCH_OK:
      return action.settings.setIn(["uiData","currentTab"], fromJS(action.currentTab))
    case c.SETTINGS_FETCH_KO:
      return state.setIn(["uiData","errors"], fromJS(action.errors))
    case c.SETTINGS_COY_SET:
      return state.setIn(["companies"], fromJS(action.comp))
    case c.SETTINGS_UIDATA_SET:
      return state.set("uiData", fromJS(action.uiData))
    // case c.SETTINGS_COY_ADD:
    //   return state.setIn(["companies",state.get("companies").size], action.comp)
    // case c.SETTINGS_COY_DEL:
    //   index = state.get("companies").findIndex(x=>x.get("companyNo") === action.comp.companyNo)
    //   return index >= 0 ? state.deleteIn(["companies",index]) : state
    case c.SETTINGS_SEG_SET:
      return state.setIn(["segments"], fromJS(action.segments))
    // case c.SETTINGS_SEG_ADD:
    //   return state.setIn(["segments",state.get("segments").size], action.segment)
    // case c.SETTINGS_SEG_DEL:
    //   index = state.get("segments").findIndex(x=>x.get("segmentNo") === action.segment.segmentNo)
    //   return index >= 0 ? state.deleteIn(["segments",index]) : state
    case c.SETTINGS_CCY_SET:
      return state.setIn(["currencies"], fromJS(action.ccy))
    case c.SETTINGS_PRD_SET:
      return state.setIn(["glPeriods"], fromJS(action.prds))
    default:
      return state;
  }
}

export default settingsPageReducer;
