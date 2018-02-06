import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import H2 from 'components/H2'

import formatDate from 'date-fns/format'
import parse from 'date-fns/parse'
import isValid from 'date-fns/is_valid'


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
  flex: 4;
  margin-right:20px;

`
const GlPeriodStartLabel = styled.span`
  flex: 3.8;
  margin-right:0px;
`

const GlPeriodEnd = styled.span`
  flex:4;
  margin-right:20px;
`
const GlPeriodEndLabel = styled.span`
  flex: 4;
  margin-right:20px;
`

const GlPeriodOpen = styled.span`
  flex: 1;
  margin-right: 20px;
`
const GlPeriodOpenText = styled.span`
  flex: 3;
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
  const validCompanies = {'1': 'Acme PL',  '2': 'Lebih Good'};
  return  t.struct({
    company: t.enums(validCompanies),
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
            disableAdd: false,
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
            <span style={{width:'50px'}}>&nbsp;</span>
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
              <GlPeriodOpenText>&nbsp;&nbsp;&nbsp;&nbsp;{"Open?"}</GlPeriodOpenText>
              <LastColumn />
            </GlPeriodRow>
              {inputs.glPeriodList}
          </GlPeriodPane>
        </Container>
      );
  }
}

export default class SegmentTab extends React.Component {
  constructor(props) {
      super(props);
      this.state = {value: {glPeriodList: []} ,
        filter: {company: '', year: formatDate(new Date(), 'YYYY') } };
      this.onFormChange = this.onFormChange.bind(this)
      this.onFilterChange = this.onFilterChange.bind(this)
  }
  onFilterChange(raw,path) {
    console.log("OnFilterChange", "path", path, "raw", raw )
  }
  onFormChange(raw,path){
      console.log("onFormChange", path, "raw", raw);

      this.setState({value:raw});
  }
  render() {
      console.log("State filter", this.state.filter)
      return (
          <div>
            <Form ref="cform" type={filterFac(this)} options={filterOpts} value={this.state.filter}
              onChange={this.onFilterChange} />
            <Form type={modelFac(this)} options={optionsFac(this)}
                  value={this.state.value} onChange={this.onFormChange} />
          </div>
      )
  }
}
