import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import H2 from 'components/H2'
import {fromJS} from 'immutable'
import t from 'tcomb-form';
import * as w from 'components/Widgets'
import _ from 'lodash'
import {Alert} from 'react-bootstrap'

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
  margin-right: 2px;
  flex: ${props => props.flex}  

`
const ErrorMsg = styled.div`
  color: red;
`

const Form = t.form.Form

const Positive = t.refinement(t.Number, (n) => n >= 0);

const companyFac = (self) => {
  let compMap = {}
  const companies = self.props.companies
  if (companies && companies.get("companyList") && companies.get("companyList").size > 0 ) {
    self.props.companies.get("companyList").forEach(co => compMap[co.get("companyNo")] = co.get("companyName"))
  }
  return  t.struct({
    company: t.enums(compMap),
  });
}

const coyOpts = {
  fields: {company: {factory: w.Select, label: __("Company")}}
}
const MinText = t.refinement(t.String, (s) => s.length > 3);

const modelFac = (self) => {
  const Segment = t.struct({
      segmentNo: Positive,
      segmentUsed: t.maybe(t.Boolean),
      segmentAbbrev: t.maybe(t.String),
      segmentName: t.maybe(t.String),
      companyNo: t.maybe(t.String),
  })
  return t.struct({
    segmentList: t.maybe(t.list(Segment)),
  });
}
const optionsFac = (self) => {

  const segmentOptions = () => {
      return {
          template: w.ListTemplate(self,4,[1,1,1,6]),
          order: ["segmentNo","segmentAbbrev","segmentUsed","segmentName"],
          fields: {
              segmentNo: {factory: w.Decimal, hasLabel:false, dp:0, disabled:true, attrs:{style:{width:'50px'}} },
              segmentUsed: {factory: w.CheckBox, hasLabel:false},
              segmentAbbrev: {factory: w.Textbox, hasLabel:false,attrs:{style:{width:'50px'}}},
              segmentName: {factory: w.Textbox, hasLabel:false, error: __("Required field")},
              companyNo: {factory: w.Textbox, type:'hidden', hasLabel:false}
          }
      }
  }
  return {
      // template: formTemplate(self),
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

export default class SegmentTab extends React.Component {
  constructor(props) {
      super(props);
      this.onFormChange = this.onFormChange.bind(this)
      this.onFilterChange = _.debounce( this.onFilterChange.bind(this),50)
      this.state = {errorList:[]}
  }
  onFilterChange(raw,path) {
    const comp = raw.company
    let segments, segs;
    if (comp) {
      segments = this.props.segments.filter(seg => seg.get("companyNo") === raw.company )
      segs = segments.size > 0 ? segments.toJS() :  [
        {companyNo: comp, segmentNo:1, segmentUsed: false, segmentAbbrev:'S1', segmentName: ''},
        {companyNo: comp, segmentNo:2, segmentUsed: false, segmentAbbrev:'S2', segmentName: ''},
        {companyNo: comp, segmentNo:3, segmentUsed: false, segmentAbbrev:'S3', segmentName: ''},
        {companyNo: comp, segmentNo:4, segmentUsed: false, segmentAbbrev:'S4', segmentName: ''}
      ]
    } else {
      segs = []
    }

    let uiData = this.props.uiData.toJS()
    uiData.filter2 = raw    
    this.props.actions.settingsUiDataSet(uiData)
    this.props.actions.settingsSegmentSet(segs)
  }
  onFormChange(raw,path){
    this.props.actions.settingsMsgClear()
    let p = path.slice(0,path.length-1)
    let component = this.form.getComponent(path)
    let res;
    if (component && _.get(raw,path)) {
      res = component.validate()      
      if (res.errors && res.errors.length === 0 ) {
        this.validateForm(raw,path)
      } 
    }
    this.props.actions.settingsSegmentSet(raw.segmentList)    
  }
  validateForm(raw,path){
    const segno = path && path.length > 1 ? path[1] : -1
    let errorList = [], name, data = _.get(raw,["segmentList"])
    if (!data) return [] // no data, no need to validate
    data.forEach((row,idx) => {
        if (idx !== segno) {
          const pth = ["segmentList",idx]
          let itm = _.get(raw,pth)
          name = itm.segmentName || ''
          if (itm.segmentUsed && name.trim().length === 0 ){
            errorList.push( `Row ${idx+1}, segment name is required` )
          }
        } 
    })
    const errmsg = errorList.length > 0 ?errorList.map((e,idx) => <div key={idx}>{e}</div>) :null
    this.props.actions.settingsMsgSet(errmsg)
    return errorList
  }
  render() {
      const filter = this.props.uiData.get("filter2") ? this.props.uiData.get("filter2").toJS() : ''
      const segs = this.props.segments.filter(s => s.get("companyNo") === filter.company )
      const segList = {segmentList: segs.toJS()}
      const {inputRef} = this.props;
      
      return (
        <div style={{width:'95%'}}>
            <Container>
              <H2 style={{marginTop:'20px'}}>{"Segment Settings"}</H2>
            </Container>

            <Pane>
              <Row>
                <Column flex={1}>
                  <Form ref="cform" type={companyFac(this)} options={coyOpts}
                    value={filter} onChange={this.onFilterChange} />
                </Column>
                <Column flex={2}>&nbsp;</Column>
              </Row>

              <Pane>
                  <Row>
                    <Column flex={1}>{"Seg#"}</Column>
                    <Column flex={1}>&nbsp;{"Abbrev"}</Column>
                    <Column flex={1}>{"Used?"}</Column>
                    <Column flex={6}>{"Segment Name"}</Column>
                    <Column flex={1}>&nbsp;</Column>
                  </Row>
              </Pane>
                <Form ref={f => {this.form=f;inputRef(f); }} type={modelFac(this)} options={optionsFac(this)}
                  value={segList} onChange={this.onFormChange} />
          </Pane>
          </div>  
      )
  }
}
