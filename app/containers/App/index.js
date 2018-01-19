/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Sidebar from 'components/Sidebar';

const AppWrapper = styled.div`
  // max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 5px;
  flex-direction: column;
`;

const BodyWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  min-width: 100%;
  padding: 0 0px;
  flex-direction: row;
  align-items: stretch;
`;
const Side = styled.div`
  flex: 1;
`;
const Body = styled.div`
  flex: 4;
  background-color: #FFFFFF;
`;

class Application extends Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.setUsername = this.setUsername.bind(this)
    this.state = {userName : 'Demo User'}
  }

  getChildContext() {
    return {
      userName: this.state.userName || "Demo" , 
      setUsername : this.setUsername 
    }
  }
  setUsername(userName) {
    this.setState({userName})
  }

  render() {
    return (
      <AppWrapper>
        <Helmet
          titleTemplate="%s GL Module"
          defaultTitle="GL Module"
        >
          <meta name="description" content="A simple GL application" />
        </Helmet>
        <Header />
        <BodyWrapper>
            <Sidebar visible={true} />
          <Body>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route component={NotFoundPage} />
            </Switch>
          </Body>
        </BodyWrapper>
      </AppWrapper>
    );
  
  }
}
Application.childContextTypes = {
  userName : PropTypes.string,
  setUsername: PropTypes.func
}

export default Application;
