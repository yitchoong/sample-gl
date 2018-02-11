import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import H2 from 'components/H2'
import _ from 'lodash'
import {fromJS} from 'immutable'

import formatDate from 'date-fns/format'
import parse from 'date-fns/parse'
import isValid from 'date-fns/is_valid'
import getYear from 'date-fns/get_year'
import endOfMonth from 'date-fns/end_of_month'

import t from 'tcomb-form';
import * as w from 'components/Widgets'

const __ = (code) => code

const Container = styled.div`
  margin: 5px;
`;

const GlPeriodPane = styled.div`
  margin: 5px;
  border: solid 1px #FFF;
`;

const GlPeriodRow = styled.div`
  margin: 2px;
  border: solid 0px #FFF;
  display: flex;
  flex-direction: row;
`

const GlPeriodNo = styled.span`
  flex: 1;
  margin-right:20px;
`
const GlPeriodStart = styled.span`
  flex: 5;
  margin-right:20px;
`
const GlPeriodStartLabel = styled.span`
  flex: 5;
  margin-right:0px;
`

const GlPeriodEnd = styled.span`
  flex:5;
  margin-right:20px;
`
const GlPeriodEndLabel = styled.span`
  flex: 6;
  margin-right:0px;
`

const GlPeriodOpen = styled.span`
  flex: 1;
  margin-right: 20px;
`
const GlPeriodOpenText = styled.span`
  flex: 3.6;
`

const LastColumn = styled.span`
  width: 30px;
`
const Row = styled.div`
  margin: 2px;
  border: solid 1px #EFF;
  display: flex;
  flex-direction: row;
`
const FilterCompany = styled.span`
  flex: 1;
  margin-right:10px;
`
const FilterYear = styled.span`
  flex: 1;
`


const Form = t.form.Form
const Positive = t.refinement(t.Number, (n) => n >= 0);

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
    template: filterTemplate(),
    fields: {
      company: {factory: w.Select, label: __("Company")},
      year: {factory:w.Textbox, label:__("Year")}
    }
  }
}
const filterTemplate = (self) => {
  return (locals) => {
      const inputs = locals.inputs;
      return (
        <Row>
            <FilterCompany>
              {inputs.company}
            </FilterCompany>
            <FilterYear>
              {inputs.year}
            </FilterYear>
        </Row>
      )
  };
}

const modelFac = (self) => {
  const Period = t.struct({
      companyNo: t.maybe(t.String),
      periodNo: Positive,
      periodOpen: t.maybe(t.Boolean),
      periodStart: t.Date,
      periodEnd: t.Date,
  })
  return t.struct({
    glPeriodList: t.maybe(t.list(Period)),
  });
}
const optionsFac = (self) => {

  const glPeriodOptions = () => {
      return {
          template: glPeriodTemplate(self),
          fields: {
              companyNo: {factory: w.Textbox, type:'hidden', hasLabel:false },
              periodNo: {factory: w.Decimal, hasLabel:false, dp:0 },
              periodOpen: {factory: w.CheckBox, hasLabel:false},
              periodStart: {factory: w.Datetime, hasLabel:false, order: ['D','M','YY']},
              periodEnd: {factory: w.Datetime, hasLabel:false, order: ['D','M','YY']}
          }
      }
  }

  return {
      template: formTemplate(self),
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
const glPeriodTemplate = (self) => {
  return (locals) => {
      const inputs = locals.inputs;
      return (
        <GlPeriodRow>
            <GlPeriodNo>
              {inputs.periodNo}
            </GlPeriodNo>

            <GlPeriodStart>
              {inputs.periodStart}
            </GlPeriodStart>

            <GlPeriodEnd>
              {inputs.periodEnd}
            </GlPeriodEnd>

            <span style={{width:'60px'}}>&nbsp;</span>
            <GlPeriodOpen>
              {inputs.periodOpen}
            </GlPeriodOpen>
        </GlPeriodRow>
      )
  };
}
const formTemplate = (self) => {
  return (locals) => {
      let inputs = locals.inputs;
      return (
        <Container>
          <H2>{"GL Periods"}</H2>
          <GlPeriodPane>
            <GlPeriodRow>
              <GlPeriodNo>{"Period#"}</GlPeriodNo>
              <GlPeriodStartLabel>{"Start Date"}</GlPeriodStartLabel>
              <GlPeriodEndLabel>{"End Date"}</GlPeriodEndLabel>
              <GlPeriodOpenText>&nbsp;{"Open?"}</GlPeriodOpenText>
              <LastColumn />
            </GlPeriodRow>
              {inputs.glPeriodList}
          </GlPeriodPane>
        </Container>
      );
  }
}

export default class GlPeriodTab extends React.Component {
  constructor(props) {
      super(props);
      // this.state = {value: {glPeriodList: []} ,
      //   filter: {company: '', year: formatDate(new Date(), 'YYYY') } };
      this.onFormChange = this.onFormChange.bind(this)
      this.onFilterChange = _.debounce(this.onFilterChange.bind(this),100)
  }
  onFilterChange(raw,path) {
    const {company, year} = raw;
    const {glPeriods} = this.props;
    let yy,mm,dd, start, end;
    let periods, prds;
    if (company && year && year.length > 3) {
      periods = glPeriods.filter(p => getYear(p.get("periodStart")) === parseInt(year) && p.get("companyNo") === company )
      if (periods.size > 0) {
        prds = periods // periods already exist
      } else {
        // no periods -- so initialize
        yy = parseInt(year)
        let dates = [0,1,2,3,4,5,6,7,8,9,10,11].map(m => {
            let sd = new Date(yy,m,1)
            return [sd, endOfMonth(sd)]
        })
        dates.push([dates[11][0], dates[11][1]]) // for period 13
        let rows = dates.map( (item,idx) => {
          return {companyNo: company, periodNo: idx+1, periodOpen:false, periodStart:item[0], periodEnd:item[1]}
        })
        prds= fromJS({glPeriodList: rows})
      }
    } else {
      prds = fromJS({glPeriodList:[]}) // empty until both comp & year specified
    }
    let uiData = this.props.uiData.toJS()
    uiData.filter = raw
    this.props.actions.settingsUiDataSet(uiData)
    this.props.actions.settingsPrdSet(prds)

  }
  onFormChange(raw,path){
      // console.log("onFormChange", path, "raw", raw);
      this.props.actions.settingsPrdSet(raw)
  }
  render() {
      const glPeriods = this.props.glPeriods.toJS();
      const filter = this.props.uiData.get("filter").toJS()
      return (
          <div>
            <Form ref="cform" type={filterFac(this)} options={filterOpts}
            value={filter} onChange={this.onFilterChange} />
            <Form type={modelFac(this)} options={optionsFac(this)}
                  value={glPeriods} onChange={this.onFormChange} />
          </div>
      )
  }
}
