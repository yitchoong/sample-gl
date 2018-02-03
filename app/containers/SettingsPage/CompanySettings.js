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



const Form = t.form.Form

const modelFac = (self) => {
  const Company = t.struct({
      companyNo: t.Number,
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
          fields: {
              companyNo: {factory: w.Decimal, hasLabel:false},
              abbreviation: {factory: w.Textbox, hasLabel:false},
              companyName: {factory: w.Textbox, hasLabel:false}
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
            <CompanyRow>
              <CompanyNo>{"Company No"}</CompanyNo>
              <Abbreviation>{"Abbreviation"}</Abbreviation>
              <CompanyName>{"Company Name"}</CompanyName>
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
      this.state = {value: {companyList: [] } };
      this.onFormChange = this.onFormChange.bind(this)
  }
  onFormChange(raw,path){
      console.log("onFormChange", path, raw);
      this.setState({value:raw});
  }
  render() {
      return (
          <Form type={modelFac(this)} options={optionsFac(this)} 
                value={this.state.value} onChange={this.onFormChange} />
      )
  }
}



// const Content = (props) => {
//   return (
//     <div>Company Settings</div>
//   )


// }

// export default Content;
