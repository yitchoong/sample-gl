import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import H2 from 'components/H2'

import t from 'tcomb-form';
import * as w from 'components/Widgets'

const __ = (code) => code


const Container = styled.div`
  margin: 5px;
`;

const CurrencyPane = styled.div`
  margin: 5px;
  border: solid 1px #FFF;
`;

const CurrencyRow = styled.div`
  margin: 2px;
  border: solid 1px #FFF;
  display: flex;
  flex-direction: row;
`
const CurrencyCode = styled.span`
  flex: 1;
  margin-right:10px;
`
const CurrencyName = styled.span`
  flex: 4;
`

const Form = t.form.Form

const modelFac = (self) => {
  const Currency = t.struct({
      currencyCode: t.String,
      currencyName: t.maybe(t.String),
  })
  return t.struct({
    currencyList: t.maybe(t.list(Currency)),
  });
}
const optionsFac = (self) => {

  const currencyOptions = () => {
      return {
          template: currencyTemplate(self),
          fields: {
              currencyCode: {factory: w.Textbox, hasLabel:false},
              currencyName: {factory: w.Textbox, hasLabel:false}
          }
      }
  }
  return {
      template: formTemplate(self),
      i18n : { optional : '', required : ' *', add: __('Add'), remove: __('Remove') },
      fields: {
          currencyList: {
            factory: w.SimpleList, 
            addItemHandler: (button) => { console.log("Add button clicked"); return button.click()},            
            addText: __("New Currency"), 
            item : currencyOptions() },
      }
  }
}
const currencyTemplate = (self) => {
  return (locals) => {
      const inputs = locals.inputs;
      return (
        <CurrencyRow>
            <CurrencyCode>
              {inputs.currencyCode}
            </CurrencyCode>

            <CurrencyName>
              {inputs.currencyName}
            </CurrencyName>
        </CurrencyRow>
      )
  };
}
const formTemplate = (self) => {
  return (locals) => {
      let inputs = locals.inputs;
      return (
        <Container>
          <H2>{"Currency Settings"}</H2>
          <CurrencyPane>
            <CurrencyRow>
              <CurrencyCode>{__("Currency Code")}</CurrencyCode>
              <CurrencyName>{__("Currency Name")}</CurrencyName>
              <span style={{width:'20px'}}>&nbsp;</span>
            </CurrencyRow>
              {inputs.currencyList}
          </CurrencyPane>
        </Container>
      );
  }
}

export default class CurrencyTab extends React.Component {
  constructor(props) {
      super(props);
      this.state = {value: {currencyList: [] } };
      this.onFormChange = this.onFormChange.bind(this)
  }
  onFormChange(raw,path){
      this.setState({value:raw});
  }
  render() {
      return (
          <Form type={modelFac(this)} options={optionsFac(this)} 
                value={this.state.value} onChange={this.onFormChange} />
      )
  }
}
