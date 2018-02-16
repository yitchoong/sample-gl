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
const CompanyPane = styled.div`
  margin: 5px;
  border: solid 1px #FFF;
`;

const CompanyRow = styled.div`
  margin: 2px;
  border: solid 1px #FFF;
  display: flex;
  flex-direction: row;
`
const CompanyNo = styled.span`
  flex: 3;
  margin-right:10px;
`
const Abbreviation = styled.span`
  flex: 4;
  margin-right:10px;
`
const CompanyName = styled.span`
  flex: 6;
`
const ErrorMsg = styled.div`
  color: red;
`
const CompanyNoLabel = styled.span`
  flex: 3;
  margin-right:0px;
`
const AbbreviationLabel = styled.span`
  flex: 4;
  margin-left:10px;
`
const CompanyNameLabel = styled.span`
  flex: 8.5;
`


const Form = t.form.Form

const ShortField = t.refinement(t.String, (s) => s.length <= 3);

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
          template: companyTemplate(self),
          auto: 'placeholders',
          i18n: {required:'', optional:''},
          fields: {
              companyNo: {factory: w.Textbox, hasLabel:true, error:'Must be < 4 chars'},
              abbreviation: {factory: w.Textbox, hasLabel:true},
              companyName: {factory: w.Textbox, hasLabel:true, error: 'Name is required'}
          }
      }
  }

  return {
      template: formTemplate(self),
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
const companyTemplate = (self) => {
  return (locals) => {
      const inputs = locals.inputs;
      return (
        <CompanyRow>
            <CompanyNo>
              {inputs.companyNo}
            </CompanyNo>

            <Abbreviation>
              {inputs.abbreviation}
            </Abbreviation>

            <CompanyName>
              {inputs.companyName}
            </CompanyName>
        </CompanyRow>
      )
  };
}
const formTemplate = (self) => {
  return (locals) => {
      let inputs = locals.inputs;
      return (
        <Container>
          <H2>{"Company Settings"}</H2>
          <CompanyPane>

            <ErrorMsg>{self.getErrorMsg()}</ErrorMsg>

            <CompanyRow>
              <CompanyNoLabel>{"Company No"}</CompanyNoLabel>
              <AbbreviationLabel>{"Abbreviation"}</AbbreviationLabel>
              <CompanyNameLabel>{"Company Name"}</CompanyNameLabel>
            </CompanyRow>

              {inputs.companyList}
          </CompanyPane>
        </Container>
      );
  }
}

export default class CompanyTab extends React.Component {
  constructor(props) {
      super(props);
      // this.state = {value: {companyList: [] } };
      this.onFormChange = this.onFormChange.bind(this)
  }
  onFormChange(raw,path){
      // console.log("onFormChange, raw", raw, " path=", path);
      // this.setState({value:raw});
      let p = path.slice(0,path.length-1)
      // let comp = this.refs.form.getComponent(path)
      let comp = this.form.getComponent(path)
      if (comp && _.get(raw,path)) {
        comp.validate()
        // console.log("form.getValue=", this.form.getValue() )
      }
      this.props.actions.settingsCompSet(raw)
  }
  getErrorMsg(){
    return '' //placeholder now, can be use for errors later on
  }

  render() {

      const {inputRef, companies} = this.props;
      return (
        <div style={{width:'80%'}}>

          <Form ref={f => {this.form=f;inputRef(f); }} type={modelFac(this)} options={optionsFac(this)}
                value={companies.toJS()} onChange={this.onFormChange} />
        </div>
      )
  }
}
