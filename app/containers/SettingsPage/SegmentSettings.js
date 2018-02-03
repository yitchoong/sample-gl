import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import H2 from 'components/H2'

import t from 'tcomb-form';
import * as w from 'components/Widgets'

//import '../../css/bootstrap.css'

const __ = (code) => code


const Container = styled.div`
  margin: 5px;
`;
const SegmentPane = styled.div`
  margin: 5px;
  border: solid 1px #FFF;
`;

const CompanyRow = styled.div`
  margin: 2px;
  border: solid 0px #FFF;
  display: flex;
  flex-direction: row;
`

const SegmentRow = styled.div`
  margin: 2px;
  border: solid 1px #FFF;
  display: flex;
  flex-direction: row;
`
const SegmentNo = styled.span`
  flex: 1;
  margin-right:20px;
`
const SegmentNoText = styled.span`
  flex: 1;
  margin-right:10px;
`

const SegmentUsed = styled.span`
  flex: 1;
  margin-right:10px;
`
const SegmentAbbrev = styled.span`
  flex: 2;
  margin-right:10px;
`
const SegmentAbbrevText = styled.span`
  flex: 2;
  border: solid 1px;
`

const SegmentName = styled.span`
  flex: 6;
`
const LastColumn = styled.span`
  flex: 1.8;
`


const Spacer = styled.span`
  margin-right: 60px;
  background-color: #CECECE;
  
`

const Form = t.form.Form

const Positive = t.refinement(t.Number, (n) => n >= 0);

const companyFac = (self) => {
  const validList = t.enums({'1':'Acme PL',  '2':'Lebih Good'})
  return  t.struct({
    company: validList,
  });
}

const coyOpts = {
  fields: {company: {factory: w.Select, label: __("Company")}}
}

const modelFac = (self) => {
  const Segment = t.struct({
      segmentNo: Positive,
      segmentUsed: t.maybe(t.Boolean),
      segmentAbbrev: t.maybe(t.String),
      segmentName: t.String,
  })
  return t.struct({
    segmentList: t.maybe(t.list(Segment)),
  });
}
const optionsFac = (self) => {

  const segmentOptions = () => {
      return {
          template: segmentTemplate(self),
          fields: {
              segmentNo: {factory: w.Decimal, hasLabel:false, dp:0, disabled:true },
              segmentUsed: {factory: w.CheckBox, hasLabel:false},
              segmentAbbrev: {factory: w.Textbox, hasLabel:false},
              segmentName: {factory: w.Textbox, hasLabel:false}
          }
      }
  }

  return {
      template: formTemplate(self),
      i18n : { optional : '', required : ' *', add: __('Add'), remove: __('Remove') },
      fields: {
          segmentList: {
            factory: w.SimpleList, 
            disableAdd: true,
            addItemHandler: (button) => { console.log("Add button clicked"); return button.click()},            
            addText: __("New Segment"), 
            item : segmentOptions() },
      }
  }
}
const segmentTemplate = (self) => {
  return (locals) => {
      const inputs = locals.inputs;
      return (
        <SegmentRow>
            <SegmentNo>
              {inputs.segmentNo}
            </SegmentNo>

            <SegmentUsed>
              {inputs.segmentUsed}
            </SegmentUsed>

            <SegmentAbbrev>
              {inputs.segmentAbbrev}
            </SegmentAbbrev>

            <SegmentName>
              {inputs.segmentName}
            </SegmentName>
        </SegmentRow>
      )
  };
}
const formTemplate = (self) => {
  return (locals) => {
      let inputs = locals.inputs;
      return (
        <Container>
          <H2>{"Segment Settings"}</H2>
          <SegmentPane>
            <SegmentRow>
              <SegmentNoText>{"Seg#"}</SegmentNoText>
              <SegmentUsed>{"Used?"}</SegmentUsed>
              <SegmentAbbrev>&nbsp;{"Abbrev"}</SegmentAbbrev>
              <SegmentName>{"Segment Name"}</SegmentName>
              <LastColumn />
            </SegmentRow>
              {inputs.segmentList}
          </SegmentPane>
        </Container>
      );
  }
}

export default class SegmentTab extends React.Component {
  constructor(props) {
      super(props);
      this.state = {value: {segmentList: [
        {segmentNo: 1, segmentUsed: true, segmentAbbrev:'S1', segmentName: 'Segment 1'},
        {segmentNo: 2, segmentUsed: true, segmentAbbrev:'S2', segmentName: 'Segment 2'},
        {segmentNo: 3, segmentUsed: true, segmentAbbrev:'S3', segmentName: 'Segment 3'},
        {segmentNo: 4, segmentUsed: true, segmentAbbrev:'S4', segmentName: 'Segment 4'},
      ], companyList: [
        {companyNo: 1, companyName: 'Acme Pty Ltd', abbreviation: 'Acme'},
        {companyNo: 2, companyName: 'Lebih Good SB', abbreviation: 'lbg'}
      ] }, filter: {company: ''} };
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
      return (
          <div>
            <Form ref="cform" type={companyFac(this)} options={coyOpts} value={this.state.filter}
              onChange={this.onFilterChange} />
            <Form type={modelFac(this)} options={optionsFac(this)} 
                  value={this.state.value} onChange={this.onFormChange} />
          </div>
      )
  }
}
