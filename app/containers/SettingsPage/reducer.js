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
    message: '',
    currentTab: 1,
    filter: {},
    filter2: {}
  }
});

function settingsPageReducer(state = initialState, action) {
  let index, year, company, row,rows;
  switch (action.type) {
    case c.SETTINGS_FETCH_OK:
      return fromJS(action.settings)
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
      // if action.segments is empty use existing state, else filter out same company from state
      rows = action.segments.length === 0 ? state.get("segments").toJS() :
            state.get("segments").filter(s => s.get("companyNo") !== state.getIn(["uiData","filter2","company"]) ).toJS()
      action.segments.forEach(itm => rows.push(itm))  
      return state.setIn(["segments"], fromJS(rows))

    case c.SETTINGS_CCY_SET:
      return state.setIn(["currencies"], fromJS(action.ccy))
    case c.SETTINGS_PRD_SET:
      row = action.prds.find(p => p.periodNo.endsWith('01')) // expects this to be found
      rows = action.prds.length === 0 || !row  ? state.get("glPeriods").toJS() :
              state.get("glPeriods").
              filter(p => p.get("periodNo").substring(0,4) !== row.periodNo.substring(0,4) || p.get("companyNo") !== row.companyNo).toJS()
      action.prds.forEach( itm => rows.push(itm))
      return state.setIn(["glPeriods"],fromJS(rows))
    case c.SETTINGS_SAVE_RQST:
      console.log("reducer save request...")
      return state.setIn(["uiData","message"],c.SETTINGS_SAVE_RQST_MSG)
    case c.SETTINGS_SAVE_OK:
      console.log("reducer save ok...")
      return state.setIn(["uiData","message"], c.SETTINGS_SAVE_OK_MSG)
    case c.SETTINGS_SAVE_KO:
      return state.setIn(["uiData","message"], action.errors)
    case c.SETTINGS_SAVE_CLEAR:
      console.log("reducer clearing...")
      return state.setIn(["uiData","message"], '')    
    case c.SETTINGS_MSG_SET:
      return state.setIn(["uiData","message"], action.msg)
    case c.SETTINGS_MSG_CLEAR:
      return state.setIn(["uiData","message"], '')    
    default:
      return state;
  }
}

export default settingsPageReducer;
