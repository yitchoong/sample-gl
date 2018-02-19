/**
 *
 * SettingsPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { Switch, Route } from 'react-router-dom';
import {Alert} from 'react-bootstrap'
import styled from 'styled-components';
import _ from 'lodash';
import formatDate from 'date-fns/format'
import parse from 'date-fns/parse'
import isValid from 'date-fns/is_valid'

import {Tabs, Tab,Button, Nav, NavItem} from 'react-bootstrap'

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectSettingsPage from './selectors';
import reducer from './reducer';
import saga from './saga';


import Company from './CompanySettings'
import Currency from './CurrencySettings'
import Segment from './SegmentSettings'
import GlPeriod from './GlPeriodSettings'
import * as settingActions from './actions'
import {companies, segments, currencies, glPeriods, uiData} from './selectors'
import {SETTINGS_SAVE_OK_MSG,SETTINGS_SAVE_RQST_MSG} from './constants'

const __ = (m) => m

const MainContainer = styled.div`
    flex: 1;
    display:flex;
    margin-left: 10px;
    margin-top: 10px;
`;


const Row = styled.div.attrs({})`
  display: flex;
  flex-direction: row;
  margin-top: ${props => props.marginTop};
  margin-bottom: ${props => props.marginBottom};
  margin-left: ${props => props.marginLeft};
  margin-right: ${props => props.marginRight};
`

const TabContainer = styled.div`
    flex: 1;
    display:flex;
    margin-left: 10px;
    margin-top: 10px;
`;
const TabContent = styled.div`
    flex: 1;
    display:flex;
    margin-left: 10px;
    margin-top: 2px;
    padding-top: 5px;
    border-top: solid 1px #eaeaea;
`;


export class SettingsPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props){
    super(props)
    this.handleTabSelect = this.handleTabSelect.bind(this)
    let loc = props.history.location.pathname
    let tab = loc.match('\/company\/?') ? 1:
              loc.match('\/segment\/?') ? 2:
              loc.match('\/currency\/?') ? 3:
              loc.match('\/glperiod\/?') ? 4: 1

    this.state = {tabKey: tab}
    this.onSave = this.onSave.bind(this)
  }
  onSave(e) {
    // saving, have to run validation first
    const canSave = this.validateTab()
    if (canSave) {
      // trigger an action, that will call a saga
      // gather all the data together 
      let settings = {
        companies: this.props.companies.get("companyList").toJS(),
        segments: this.props.segments.toJS(),
        currencies: this.props.currencies.get("currencyList").toJS(),
        glPeriods: this.props.glPeriods.toJS()
      }
      this.props.actions.settingsSaveRequest(settings)
      
    }
  }
  validateTab(){

    const activeKey = this.refs.nav.props.activeKey
    let canChange, data, errs;
    switch (activeKey) {
      case 1:
        canChange = !this.compform.getValue() ? false : true
        break
      case 2:
        data = this.segform.getValue() // 
        canChange = !data ? false : true
        if (canChange) {
          errs = this.seg.validateForm(data) // for dependent field validations
          canChange = errs.length === 0 ? true : false          
        }
        break
      case 3:
        canChange = !this.ccyform.getValue() ? false : true
        break
    case 4:
      data = this.glform.getValue()
      canChange = !data ? false : true
      if (canChange) {
        errs = this.glp.validateForm(data)
        canChange = errs.length === 0 ? true : false
      }
      break
    default:
      canChange = false;
    }
    return canChange
  }
  handleTabSelect(key) {
    let tab = key === 1 ? 'company' :
              key === 2 ? 'segment' :
              key === 3 ? 'currency' :
              key === 4 ? 'glperiod' : ''
    const url = tab ? `/settings/${tab}/` : '/settings/'
    // validate if tab is ok  before we change?
    const activeKey = this.refs.nav.props.activeKey
    const canChange = this.validateTab()      
    if (canChange && key !== activeKey) {
      this.props.history.push(url)
      this.setState({tabKey:key})
    }  
  }
  componentDidMount(){
    // need to fetch the settings
    this.props.actions.settingsFetch()
  }
  componentWillUpdate(nextProps){
    const uiData = this.props.uiData;
    if (uiData.get("saveMessage") === SETTINGS_SAVE_OK_MSG) {
      this.props.actions.settingsSaveClear()
    }
  }

  render() {
    const {match, actions, companies,segments,currencies,glPeriods,uiData} = this.props;
    const extraProps = {match,actions,companies,segments,currencies,glPeriods,uiData}
    const message = uiData.get && uiData.get("saveMessage") ? uiData.get("saveMessage") : ''
    return (
      <div>
        <Helmet>
          <title>SettingsPage</title>
          <meta name="description" content="Description of SettingsPage" />
        </Helmet>

        <div>
            <TabContainer>
                <div style={{flex:8}}>
                  <Nav ref="nav" bsStyle="pills" activeKey={this.state.tabKey} onSelect={this.handleTabSelect} id="settingsTab">
                      <NavItem eventKey={1} > {"Companies"} </NavItem>
                      <NavItem eventKey={2} > {"Segments"} </NavItem>
                      <NavItem eventKey={3} > {"Currencies"} </NavItem>
                      <NavItem eventKey={4} > {"GL Periods"} </NavItem>
                    </Nav>
                </div>
                <div style={{flex:1, marginRight:'10px'}}>
                      <Button bsStyle={"info"} onClick={this.onSave}>Save Settings</Button>
                </div>
            </TabContainer>
            {message ? 
            <Row marginTop={"10px;"} marginLeft={"20px;"} marginRight={"20px;"} >
              <Alert style={{flex:1, margin:"0px", padding:"10px"}} bsStyle={"danger"}>{message}</Alert>
            </Row> : null }

            <TabContent>
                <Switch>
                  {/*<Route exact path={`${match.path}/`}  component={Company} /> */}
                  <Route exact path={`${match.path}/`}  render={(props) => (<Company ref={f=>this.comp=f} inputRef={f=>this.compform=f} {...props} {...extraProps}  />)} />
                  <Route  path={`${match.path}/company/`}  render={(props) => (<Company ref={f=>this.comp=f} inputRef={f=>this.compform=f} {...props} {...extraProps} />)} />
                  <Route  path={`${match.path}/segment/`}  render={(props) => (<Segment ref={f=>this.seg=f} inputRef={f=>this.segform=f} {...props} {...extraProps} />)} />
                  <Route  path={`${match.path}/currency/`} render={(props) => (<Currency ref={f=>this.ccy=f} inputRef={f=>this.ccyform=f} {...props} {...extraProps} />)} />
                  <Route  path={`${match.path}/glperiod/`} render={(props) => (<GlPeriod ref={f=>this.glp=f} inputRef={f=>this.glform=f} {...props} {...extraProps} />)} />
                </Switch>
              </TabContent>

        </div>
      </div>
    );
  }
}

SettingsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

// const mapStateToProps = createStructuredSelector({
//   settingspage: makeSelectSettingsPage(),
// });

// function mapDispatchToProps(dispatch) {
//   return {
//     dispatch,
//   };
// }

const mapStateToProps = (state,props) => {
  return {
    companies: companies(state),
    segments: segments(state),
    currencies: currencies(state),
    glPeriods: glPeriods(state),
    uiData: uiData(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    actions: bindActionCreators(settingActions, dispatch)
   };

};

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'settings', reducer });
const withSaga = injectSaga({ key: 'settings', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SettingsPage);
