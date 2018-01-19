/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import formatDate from 'date-fns/format'
import parse from 'date-fns/parse'
import isValid from 'date-fns/is_valid'
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { fromJS } from 'immutable';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import {recentVouchers, commonVouchers, recurringVouchers} from './selectors'
import reducer from './reducer';
import saga from './saga';
import * as actions from './actions';


var {ButtonGroup, Button, Alert, Grid, Row, Col } = require('react-bootstrap')
import '../../css/bootstrap.css'
import {Textbox} from 'components/Widgets'
const formatNumber = (number, dp=0) => new Intl.NumberFormat('en',{style:'decimal', minimumFractionDigits: dp}).format(number) 

const Box = styled.div`
    padding: 0px;
    border: thin solid #AAA;
    display: flex;
    flex-direction: column;
`;
const Title = styled.span`
    flex: 8;
    text-align: center;
    padding-top: 5px;
    color: #FFF;
`;
const RightContainer = styled.span`
    flex: 1;
`;

const BoxHeader = styled.div`
    flex: 1;
    display:flex;
    background-color: #7C7BAD;
`;

const BoxContent = styled.div`
    flex: 1;
    padding: 5px;
    font-size: 12px;
`;
const Cols = styled.div`
    color: #009900;
    display: flex;
    flex-direction: row;
`;
const ColName = styled.span`
    color: #009900;
    flex: ${props => props.width}
`;
const ColValue = styled.span`
    color: #000000;
    flex: ${props => props.width}
`;

const columnLabels = (names,widths) => {
  return (
    <Cols>
      { names.map( (name,idx) => {
        return (<ColName key={name} width={widths[idx]}>{name}</ColName>)
      }
      )}  
    </Cols>
  )
}
const recurringColValues = (values=fromJS([]), widths) => {
  const jsx = values.map(row => {
    const vals = ["description","amount", "previousDate","nextDate"].map((key) => {
      return    _.isNumber( row.get(key) ) ?  formatNumber(row.get(key),2) :
                isValid( parse(row.get(key) )) ? formatDate( parse( row.get(key) ),'YYYY-MM-DD') :
                row.get(key)
    })    
    return (
      <Cols key={"recurring" + row.id}>
        { vals.map( (value,idx) => {
          return (<ColValue key={idx} width={widths[idx]}>{value}</ColValue>)
        }
        )}  
      </Cols>
    )
  })
  return jsx

}
const recentVoucherColValues = (values=fromJS([]),widths) => {
  
  const jsx = values.map(row => {

    const vals = ["date","amount","description","status"].map((key) => {
      return    _.isNumber(row.get(key) ) ?  formatNumber(row.get(key),2) :
                isValid( parse(row.get(key))) ? formatDate( parse( row.get(key) ),'YYYY-MM-DD') :
                row.get(key)
    })    
    return (
      <Cols key={"recent" + row.get("id")}>
        { vals.map( (value,idx) => {
          return (<ColValue key={idx} width={widths[idx]}>{value}</ColValue>)
        }
        )}  
      </Cols>
    )
  })
  return jsx
}
const commonColValues = (values=fromJS([]),widths) => {
  const jsx = values.map(row => {

    const vals = ["description","debit","credit"].map((key) => {
      return    _.isNumber(row.get(key) ) ?  formatNumber(row.get(key),2) :                
                isValid( parse(row.get(key))) ? formatDate( parse( row.get(key) ),'YYYY-MM-DD') :
                row.get(key)
    })    
    return (
      <Cols key={"common" + row.get("id")}>
        { vals.map( (value,idx) => {
          return (<ColValue key={idx} width={widths[idx]}>{value}</ColValue>)
        }
        )}  
      </Cols>
    )
  })
  return jsx
}

// ***********************************************************************************************
// ***********************************************************************************************
// ***********************************************************************************************


class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props){
    super(props);
    this.state = {
      // recentVouchers : [{id:1, date:new Date(2017,12,23), amount: 200.34, description:"Pay myself", status:"posted"}],
      // recurringVouchers: [{id:1, description:"Pay rent", amount: "950.00", previousDate: new Date(2017,12,28), nextDate: new Date(2018,1,28)}],
      // commonVouchers: [{id:1, description:"Pay salary", debit: "Salary expense", credit: "Bank"}]
    };
    this.colNames = {
      recentVouchers: ["Date","Amount","Description","Status"],
      recurring: ["Description","Amount", "Previous Date","Next Date"],
      common: ["Description", "Debit","Credit"]
    }
    this.colWidths = {
      recentVouchers: [1,1,4,1],
      recurring: [4,1,1,1],
      common: [3,1,1]
    }
    this.recentVouchersColumns = columnLabels(this.colNames['recentVouchers'], this.colWidths['recentVouchers'])
    this.recurringColumns = columnLabels(this.colNames['recurring'], this.colWidths['recurring'])
    this.commonColumns = columnLabels(this.colNames['common'], this.colWidths['common'])    
  }

  componentDidMount(){
      setTimeout( () => {
        this.props.homeActions.fetchHomePageData()
      },1000)

  }

  render() {
    // <FormattedMessage {...messages.header} />

    const {recentVouchers,commonVouchers ,recurringVouchers} = this.props;

    const recent = recentVouchers && recentVouchers.size === 0 ? <div> No recent vouchers </div> :
        recentVoucherColValues(recentVouchers, this.colWidths['recentVouchers']) 

    const recurring = recurringVouchers && recurringVouchers.size === 0 ? <div> No recurring vouchers </div> :
        recurringColValues(recurringVouchers, this.colWidths['recurring']) 
    
    const common = commonVouchers && commonVouchers.size === 0 ? <div>No common vouchers</div> :
        commonColValues(commonVouchers, this.colWidths['common']) 

    return (
      <div>
        <Box>
          <BoxHeader>
            <Title>Recent Journal Vouchers</Title>
            <RightContainer><Button style={{width:"100%"}} bsStyle="info">New JV</Button></RightContainer>
          </BoxHeader>
          <BoxContent>
            {this.recentVouchersColumns}
            {recent}
          </BoxContent>
        </Box>
        <div style={{marginTop:"30px"}}>
          <Box>
            <BoxHeader>
              <Title>Recurring JVs</Title>
              <RightContainer><Button style={{width:"100%"}} bsStyle="info">New Recurring JV</Button></RightContainer>
            </BoxHeader>
            <BoxContent>
              {this.recurringColumns}
              {recurring}
            </BoxContent>
          </Box>      
        </div>
        
        <div style={{marginTop:"30px"}}>
          <Box>
            <BoxHeader>
              <Title>Common JVs</Title>
              <RightContainer><Button style={{width:"100%"}} bsStyle="info">New Common JV</Button></RightContainer>
            </BoxHeader>
            <BoxContent>
              {this.commonColumns}
              {common }
            </BoxContent>
          </Box>      
        </div>
        
      </div>
    
    );
  }
}

/*const mapStateToProps = createStructuredSelector({
  recentVouchers: recentVouchers(),
  commonJvs: commonJvs(),
  recurringJvs: recurringJvs()
  // username: makeSelectUsername(),
  // loading: makeSelectLoading(),
  // error: makeSelectError(),
}); */

const mapStateToProps = (state,props) => {
  return {
    recentVouchers: recentVouchers(state),
    recurringVouchers: recurringVouchers(state),
    commonVouchers: commonVouchers(state)
  }
}
export function mapDispatchToProps(dispatch, props) {
  return {
    homeActions: bindActionCreators(actions, dispatch)
  };
}



const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose( withReducer, withSaga, withConnect)(HomePage);
// export default HomePage;