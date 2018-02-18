import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import H2 from 'components/H2'
import _ from 'lodash'
import {fromJS} from 'immutable'
import {Alert} from 'react-bootstrap'

// import formatDate from 'date-fns/format'
// import isValid from 'date-fns/is_valid'
import parse from 'date-fns/parse'
import getYear from 'date-fns/get_year'
import endOfMonth from 'date-fns/end_of_month'

import t from 'tcomb-form';
import * as w from 'components/Widgets'

const __ = (code) => code


const Container = styled.div`
  margin: 5px;
`;
const Pane = styled.div`
  margin: 5px;
  border: solid 1px #FFF;
`;

const Row = styled.div`
  border: solid 0px #FFF;
  display: flex;
  flex-direction: row;
`
const Column = styled.span`
  flex: ${props => props.flex}  
`
const Bold = styled.span`
  font-weight: bold;
`
const Col = styled.span.attrs({
  flex: props => props.flex || '1',
  // marginRight: props => props.marginRight || '0px',
  // marginLeft: props => props.marginLeft || '0px'
})`
  flex: ${props => props.flex};
  margin-left: ${props => props.marginLeft};
  margin-right: ${props => props.marginRight};
`
const ErrorMsg = styled.div`
  color: red;
`


const Form = t.form.Form
const Positive = t.refinement(t.Number, (n) => n >= 0 && year > 2000 );

const filterFac = (self) => {
  let compMap = {}
  const companies = self.props.companies
  if (companies && companies.get("companyList") && companies.get("companyList").size > 0 ) {
    self.props.companies.get("companyList").forEach(co => compMap[co.get("companyNo")] = co.get("companyName"))
  }
  return  t.struct({
    company: t.enums(compMap),
    year: t.maybe(Positive)
  });
}
const filterOpts = (self) => {
  return {
    // template: filterTemplate(),
    template: w.ListTemplate(self,2,[0.3,0.1]),
    fields: {
      company: {factory: w.Select, label: __("Company")},
      year: {factory:w.Textbox, label:__("Year")}
    }
  }
}
// const filterTemplate = (self) => {
//   return (locals) => {
//       const inputs = locals.inputs;
//       return (
//         <Row>
//             <Col flex={3} marginRight={"50px"}>
//               {inputs.company}
//             </Col>
//             <Col flex={1}>
//               {inputs.year}
//             </Col>
//             <Column flex={3}>&nbsp;</Column>
//         </Row>
//       )
//   };
// }

const modelFac = (self) => {
  const Period = t.struct({
      periodNo: t.String,
      periodOpen: t.maybe(t.Boolean),
      periodStart: t.Date,
      periodEnd: t.Date,
      companyNo: t.maybe(t.String),
  })
  return t.struct({
    glPeriodList: t.maybe(t.list(Period)),
  });
}
const optionsFac = (self) => {

  const glPeriodOptions = () => {
      return {
          // template: glPeriodTemplate(self),
          template: w.ListTemplate(self,4,[2,3,3,2]),
          order: ["periodNo","periodStart","periodEnd","periodOpen"],
          fields: {
              periodNo: {factory: w.Textbox, hasLabel:false, disabled:true, attrs:{style:{width:'60%'}} },
              periodOpen: {factory: w.CheckBox, hasLabel:false},
              periodStart: {factory: w.Datetime, hasLabel:false, order: ['D','M','YY']},
              periodEnd: {factory: w.Datetime, hasLabel:false, order: ['D','M','YY']},
              companyNo: {factory: w.Textbox, type:'hidden', hasLabel:false },
          }
      }
  }

  return {
      // template: formTemplate(self),
      i18n : { optional : '', required : ' *', add: __('Add'), remove: __('Remove') },
      fields: {
          glPeriodList: {
            factory: w.SimpleList,
            disableAdd: true,
            disableRemove: true,
            addItemHandler: (button) => { console.log("Add button clicked"); return button.click()},
            addText: __("New GL Period"),
            item : glPeriodOptions() },
      }
  }
}
export default class GlPeriodTab extends React.Component {
  constructor(props) {
      super(props);
      this.onFormChange = this.onFormChange.bind(this)
      this.onFilterChange = _.debounce(this.onFilterChange.bind(this),100)
      // this.errorList = []
      this.state = {errorList:[]}
  }
  onFilterChange(raw,path) {
    const {company, year} = raw;
    const {glPeriods} = this.props;
    let yy,mm,dd, start, end;
    let periods, prds;
    if (company && year && year.length === 4 ) {
      //periods = glPeriods.filter(p => getYear(p.get("periodStart")) === parseInt(year) && p.get("companyNo") === company )      
      periods = glPeriods.filter(p => p.get("periodNo").substring(0,4) === year) ; // periods should be e.g. 2018-01
      if (periods.size > 0) {
        prds = periods.toJS() // periods already exist
      } else {
        // no periods -- so initialize
        yy = parseInt(year)
        let dates = [0,1,2,3,4,5,6,7,8,9,10,11].map(m => {
            let sd = new Date(yy,m,1)
            return [sd, endOfMonth(sd)]
        })
        dates.push([dates[11][0], dates[11][1]]) // for period 13
        let rows = dates.map( (item,idx) => {
          return {companyNo: company, periodNo: year + '-' + _.padStart((idx+1)+'',2,'0'), periodOpen:false, periodStart:item[0], periodEnd:item[1]}
        })
        prds = rows
      }
    } else {
      prds = [] // empty until both comp & year specified
    }
    let uiData = this.props.uiData.toJS()
    uiData.filter = raw
    this.props.actions.settingsUiDataSet(uiData)
    this.props.actions.settingsPrdSet(prds)

  }
  onFormChange(raw,path){
      // this.errorList = []
      let p = path.slice(0,path.length-1)
      let res, component = this.form.getComponent(path)
      if (component && _.get(raw,path)) { // has component & has value
        res = component.validate()      
        if (res.errors && res.errors.length === 0 ) {
          this.validateForm(raw,path)
        } else {
          this.setState({errorList:[]})
        }
      }
      this.props.actions.settingsPrdSet(raw.glPeriodList)
  }
  validateForm(raw, path) {
    // check that the end date is more than start date, but not on current row, check path
    const p = path && path.length > 1 ? path.slice(0,2) : ["glPeriodList",-1]
    let res,name, errorList = [], data = _.get(raw,[p[0]])
    if (!data) return [] // no data, no need to validate
    data.forEach((item,idx) => {
        if ( idx !== p[1] ) {
          const row = _.get(raw,[p[0],idx]) // get the row data to check
          let sd = _.isDate(row.periodStart) ? row.periodStart : new Date(...(row.periodStart)),
              ed = _.isDate(row.periodEnd) ? row.periodEnd : new Date(...(row.periodEnd))
          if (ed < sd) {
            errorList.push( `Row ${idx+1}, start date is after end date` )            
          }
        }
    })
    this.setState({errorList:errorList})
    return errorList    
  }
  
  render() {
      const filter = this.props.uiData.get("filter").toJS()
      let glPeriods = this.props.glPeriods.filter(p => p.get("periodNo").substring(0,4) === filter.year && p.get("companyNo") === filter.company ) 
      glPeriods = {glPeriodList: glPeriods.toJS()};
      const {inputRef} = this.props;
      return (
        <div style={{width:'90%'}}>
          <Container>
            <H2>{"GL Periods"}</H2>
          </Container>
            <Pane>
                  <Form ref="cform" type={filterFac(this)} options={filterOpts}
                    value={filter} onChange={this.onFilterChange} />
              <Pane>
              {this.state.errorList.length > 0 ?
                <Alert bsStyle="warning">
                    <strong>{this.state.errorList.map((e,idx) => <div key={idx}>{e}</div>)}</strong>  
                </Alert> : ''}
                
                <Row>
                  <Column flex={2}><Bold>{"Period#"}</Bold></Column>
                  <Column flex={3}><Bold>{"Start Date"}</Bold></Column>
                  <Column flex={3}>&nbsp;<Bold>{"End Date"}</Bold></Column>
                  <Column flex={2}><Bold>{"Open?"}</Bold></Column>
                  <Column flex={1.2}>&nbsp;</Column>
                </Row>
              </Pane>

            <Form ref={f => {this.form=f;inputRef(f); }}  type={modelFac(this)} options={optionsFac(this)}
                  value={ glPeriods } onChange={this.onFormChange} />
          </Pane>
          </div>
      )
  }
}