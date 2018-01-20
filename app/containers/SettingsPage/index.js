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
import { compose } from 'redux';

import { Switch, Route } from 'react-router-dom';

import styled from 'styled-components';
import _ from 'lodash';
import formatDate from 'date-fns/format'
import parse from 'date-fns/parse'
import isValid from 'date-fns/is_valid'

import {Tabs, Tab, Grid, Row, Col, Button, Nav, NavItem} from 'react-bootstrap'
import '../../css/bootstrap.css'

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectSettingsPage from './selectors';
import reducer from './reducer';
import saga from './saga';

import Company from './CompanySettings'
import Currency from './CurrencySettings'
import Segment from './SegmentSettings'
import GlPeriod from './GlPeriodSettings'

const MainContainer = styled.div`
    flex: 1;
    display:flex;
    margin-left: 10px;
    margin-top: 10px;
`;

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
    this.state = {tabKey: 1}    
  }
  handleTabSelect(key) {
    console.log("Selected tab with key: ", key)
    this.setState({tabKey:key})
    let tab = key === 1 ? 'company' : 
              key === 2 ? 'segment' :
              key === 3 ? 'currency' :
              key === 4 ? 'glperiod' : ''
    const url = tab ? `/settings/${tab}/` : '/settings/'
    this.props.history.push(url)
  }
  render() {
    const {match} = this.props;
    return (
      <div>
        <Helmet>
          <title>SettingsPage</title>
          <meta name="description" content="Description of SettingsPage" />
        </Helmet>

        <div>
            <TabContainer>
                <div style={{flex:8}}>                
                  <Nav bsStyle="pills" activeKey={this.state.tabKey} onSelect={this.handleTabSelect} id="settingsTab">
                      <NavItem eventKey={1} > {"Companies"} </NavItem>
                      <NavItem eventKey={2} > {"Segments"} </NavItem>
                      <NavItem eventKey={3} > {"Currencies"} </NavItem>
                      <NavItem eventKey={4} > {"GL Periods"} </NavItem>
                    </Nav>
                </div>
                <div style={{flex:1}}>
                      <Button onClick={()=>alert('Clicked')}>Click</Button>
                </div>        
            </TabContainer>
            <TabContent>
                <Switch>
                  <Route exact path={`${match.path}/`}  component={Company} />
                  <Route  path={`${match.path}/company/`}  component={Company} />
                  <Route  path={`${match.path}/segment/`}  component={Segment} />
                  <Route  path={`${match.path}/currency/`} component={Currency} />
                  <Route  path={`${match.path}/glperiod/`} component={GlPeriod} />
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

const mapStateToProps = createStructuredSelector({
  settingspage: makeSelectSettingsPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'settingsPage', reducer });
const withSaga = injectSaga({ key: 'settingsPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SettingsPage);
