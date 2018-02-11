import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import H2 from 'components/H2'
import {fromJS} from 'immutable'
import t from 'tcomb-form';
import * as w from 'components/Widgets'
import _ from 'lodash'

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
  let compMap = {}
  const companies = self.props.companies
  if (companies && companies.get("companyList") && companies.get("companyList").size > 0 ) {
    self.props.companies.get("companyList").forEach(co => compMap[co.get("companyNo")] = co.get("companyName"))
  }
  // const validList = t.enums({'1':'Acme PL',  '2':'Lebih Good'})
  return  t.struct({
    company: t.enums(compMap),
  });
}

const coyOpts = {
  fields: {company: {factory: w.Select, label: __("Company")}}
}

const modelFac = (self) => {
  const Segment = t.struct({
      companyNo: t.maybe(t.String),
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
              companyNo: {factory: w.Textbox, type:'hidden', hasLabel:false},
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
            disableRemove: true,
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
          <H2 style={{marginTop:'20px'}}>{"Segment Settings"}</H2>
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
      this.onFormChange = this.onFormChange.bind(this)
      this.onFilterChange = _.debounce( this.onFilterChange.bind(this),50)
      // this.state = {filter: {company:''}}
      // this.state = {value: {segmentList: [
      //   {segmentNo: 1, segmentUsed: true, segmentAbbrev:'S1', segmentName: 'Segment 1'},
      //   {segmentNo: 2, segmentUsed: true, segmentAbbrev:'S2', segmentName: 'Segment 2'},
      //   {segmentNo: 3, segmentUsed: true, segmentAbbrev:'S3', segmentName: 'Segment 3'},
      //   {segmentNo: 4, segmentUsed: true, segmentAbbrev:'S4', segmentName: 'Segment 4'},
      // ], filter: {company: ''} } };
  }
  onFilterChange(raw,path) {
    const comp = raw.company
    let segments, segs;
    if (comp) {
      segments = this.props.segments.filter(seg => seg.get("companyNo") === raw.company )
      segs = segments.size > 0 ? segments : fromJS({segmentList: [
        {companyNo: comp, segmentNo:1, segmentUsed: false, segmentAbbrev:'S1', segmentName: ''},
        {companyNo: comp, segmentNo:2, segmentUsed: false, segmentAbbrev:'S2', segmentName: ''},
        {companyNo: comp, segmentNo:3, segmentUsed: false, segmentAbbrev:'S3', segmentName: ''},
        {companyNo: comp, segmentNo:4, segmentUsed: false, segmentAbbrev:'S4', segmentName: ''}
      ]})
    } else {
      segs = fromJS({segmentList: []})
    }
    let uiData = this.props.uiData.toJS()
    uiData.filter = raw
    this.props.actions.settingsUiDataSet(uiData)
    this.props.actions.settingsSegmentSet(segs)
    // this.setState({filter:raw});
    // console.log("OnFilterChange, uiData=",uiData  )

  }
  onFormChange(raw,path){
      // this.setState({value:raw});
      const comp = this.props.uiData.get("filter").get("company")
      raw.segmentList.forEach(s => s.companyNo = comp)
      this.props.actions.settingsSegmentSet(raw)
      // console.log("onFormChange", path, "raw", raw);
  }
  render() {
      const {segments} = this.props
      const segs = segments.toJS()
      const filter = this.props.uiData.get("filter").toJS()
      // console.log("segments", segs, "filter", filter)
      return (
          <div>
            <Form ref="cform" type={companyFac(this)} options={coyOpts}
              value={filter} onChange={this.onFilterChange} />
            <Form type={modelFac(this)} options={optionsFac(this)}
                  value={segs} onChange={this.onFormChange} />
          </div>
      )
  }
}
