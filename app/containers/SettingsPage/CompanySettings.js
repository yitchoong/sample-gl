import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import H2 from 'components/H2'
import _ from 'lodash'

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
  margin-left: 2px;
  margin-right: 2px;
  flex: ${props => props.flex}  
`
const ErrorMsg = styled.div`
  color: red;
`
const Form = t.form.Form

const ShortField = t.refinement(t.String, (s,t,o) => {return s.length <= 3});

const modelFac = (self) => {
  const Company = t.struct({
      companyNo: ShortField,
      abbreviation: t.maybe(t.String),
      companyName: t.String,
  })
  return t.struct({
    companyList: t.maybe(t.list(Company)),
  });
}
const optionsFac = (self) => {

  const companyOptions = () => {
      return {
          template: w.ListTemplate(self,3,[2,2,6]),
          auto: 'placeholders',
          i18n: {required:'', optional:''},
          fields: {
              companyNo: {factory: w.Textbox, error:'Must be < 4 chars'},
              abbreviation: {factory: w.Textbox},
              companyName: {factory: w.Textbox, error: 'Name is required'}
          }
      }
  }

  return {
      // template: formTemplate(self),
      i18n : { optional : '', required : ' *', add: __('Add'), remove: __('Remove') },
      fields: {
          companyList: {
            factory: w.SimpleList,
            addItemHandler: (button) => { console.log("Add button clicked"); return button.click()},
            addText: __("New Company"),
            item : companyOptions() },
      }
  }
}

export default class CompanyTab extends React.Component {
  constructor(props) {
      super(props);
      // this.state = {value: {companyList: [] } };
      this.onFormChange = this.onFormChange.bind(this)
      // this.formError = ''
  }
  onFormChange(raw,path){
      this.props.actions.settingsMsgClear()
      // this.formError = ''      
      let p = path.slice(0,path.length-1)
      let res, form = this.form.getComponent(p), comp = this.form.getComponent(path) 
      if (form) form.removeErrors() 
      if (comp && _.get(raw,path)) res = comp.validate()      
      this.props.actions.settingsCompSet(raw)
  }
  validateForm(raw, path) {
    // call validateForm for cross field validations, in this case, not required
    return []
  }

  render() {

      const {inputRef, companies} = this.props;
      return (
        <div style={{width:'90%'}}>

          <Container>
              <H2>{"Company Settings"}</H2>
              <Pane>
                <Row>
                  <Column flex={2}>{"Company No"}</Column>
                  <Column flex={2}>{"Abbreviation"}</Column>
                  <Column flex={6}>{"Company Name"}</Column>
                  <Column flex={1}>&nbsp;</Column>
                </Row>
              </Pane>
          </Container>

          <Form ref={f => {this.form=f;inputRef(f); }} type={modelFac(this)} options={optionsFac(this)}
                value={companies.toJS()} onChange={this.onFormChange} />
        </div>
      )
  }
}
