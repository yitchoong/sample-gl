/*
 *
 * SettingsPage actions
 *
 */
import {
  SETTINGS_INIT,
  SETTINGS_FETCH,
  SETTINGS_FETCH_OK,
  SETTINGS_FETCH_KO,
  SETTINGS_COY_SET,
  SETTINGS_COY_ADD,
  SETTINGS_COY_DEL,
  SETTINGS_SEG_SET,
  SETTINGS_SEG_ADD,
  SETTINGS_SEG_DEL,
  SETTINGS_UIDATA_SET,
  SETTINGS_CCY_SET,
  SETTINGS_PRD_SET,
} from './constants';

// export function defaultAction() {
//   return {
//     type: DEFAULT_ACTION,
//   };
// }
export const settingsInit = () => ({ type: SETTINGS_INIT})
export const settingsFetch = (params={}) => ({type:SETTINGS_FETCH, params})
export const settingsFetchOk = (data) => ({type:SETTINGS_FETCH_OK, data})
export const settingsFetchKo = (errors) => ({type:SETTINGS_FETCH_KO, errors})
export const settingsCompSet = (comp) => ({type:SETTINGS_COY_SET, comp})
export const settingsCompAdd = (comp) => ({type:SETTINGS_COY_ADD, comp})
export const settingsCompDel = (comp) => ({type:SETTINGS_COY_DEL, comp})
export const settingsUiDataSet = (uiData) => ({type:SETTINGS_UIDATA_SET, uiData})


export const settingsSegmentSet = (segments) => ({type:SETTINGS_SEG_SET,segments})
export const settingsSegmentAdd = (segment) => ({type:SETTINGS_SEG_ADD,segment})
export const settingsSegmentDel = (segment) => ({type:SETTINGS_SEG_DEL,segment})

export const settingsCcySet = (ccy) => ({type:SETTINGS_CCY_SET, ccy})
export const settingsPrdSet = (prds) => ({type:SETTINGS_PRD_SET, prds})
