import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import H2 from 'components/H2'

import t from 'tcomb-form';
import * as w from 'components/Widgets'

const __ = (code) => code

const Container = styled.div`
  margin: 2px;
`;
const Pane = styled.div`
  margin: 2px;
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
const modelFac = (self) => {
  const Currency = t.struct({
      currencyCode: t.String,
      currencyName: t.String,
  })
  return t.struct({
    currencyList: t.maybe(t.list(Currency)),
  });
}
const optionsFac = (self) => {
  const currencyOptions = () => {
      return {
          // template: currencyTemplate(self),
          template: w.ListTemplate(self,2,[2,7]),
          auto: 'placeholders',
          i18n: {required:'', optional:''},
          fields: {
              currencyCode: {factory: w.Textbox, error: __("Required field"), attrs:{style:{width:'90%'}}},
              currencyName: {factory: w.Textbox, error: __("Required field")}
          }
      }
  }
  return {
      // template: formTemplate(self),
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
export default class CurrencyTab extends React.Component {
  constructor(props) {
      super(props);
      this.onFormChange = this.onFormChange.bind(this)
  }
  onFormChange(raw,path) {
    this.props.actions.settingsMsgClear()
    let p = path.slice(0,path.length-1)
    let res, form = this.form.getComponent(p), comp = this.form.getComponent(path) 
    if (form) form.removeErrors() 
    if (comp && _.get(raw,path)) res = comp.validate()      
    this.props.actions.settingsCcySet(raw)
  }
  render() {
      const {currencies,inputRef} = this.props;
      return (
        <div style={{width:'70%'}}>

          <Container>
              <H2>{"Currency Settings"}</H2>
              <Pane>
                <Row>
                  <Column flex={2}>{__("Currency Code")}</Column>
                  <Column flex={7}>{__("Currency Name")}</Column>
                  <Column flex={1}>&nbsp;</Column>
                </Row>
              </Pane>
          </Container>

          <Form ref={f => {this.form=f;inputRef(f); }} type={modelFac(this)} options={optionsFac(this)}
                value={currencies.toJS()} onChange={this.onFormChange} />
        </div>
      )
  }
}
