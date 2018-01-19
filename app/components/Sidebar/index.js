/**
*
* Sidebar
*
*/

import React from 'react';

import styled from 'styled-components';
// import NormalImg from 'components/Img';

import { withRR4, Nav, NavIcon, NavText } from 'react-sidenav';
import Icon from 'react-icons-kit';
import { ic_toc } from 'react-icons-kit/md/ic_toc';
import { ic_settings_applications } from 'react-icons-kit/md/ic_settings_applications';
import { ic_picture_as_pdf } from 'react-icons-kit/md/ic_picture_as_pdf';
import { ic_format_list_bulleted } from 'react-icons-kit/md/ic_format_list_bulleted';
import { ic_business } from 'react-icons-kit/md/ic_business';
import { ic_settings } from 'react-icons-kit/md/ic_settings';

const SideNav = withRR4();
const Icon20 = props => <Icon size={props.size || 20} icon={props.icon} style={{marginTop:"0px"}} />;

const BaseContainer = props =>
    <div
        style={{
            display: 'inline-block',
            paddingTop: 2,
            paddingBottom: 2,
            fontFamily: 'Roboto',
            ...props.style
        }}
    >
        {props.children}
    </div>;

const Title = styled.div`
    padding: 2px;
`;

const InnerText = styled.span`
        position: relative;
        left: -20px;
        padding: 0px;
        margin: 0px;
`;
const Separator = styled.div`
    padding-right: 5px;
`;
const SeparatorTitleContainer = styled.div`
    font-size: 16px;
    color: #ABC;
    margin-left: 5px ;
    padding-top: 0px;
    margin-top: 10px;
    margin-bottom: 0px;
`;
const ContainerText = styled.span`
      display: inline;
      position: relative;
      padding: 3px;
      top: -5px;
`;

const SeparatorTitle = props => {
    return (
        <SeparatorTitleContainer>
            {props.children}
            <hr style={{ marginTop:0, marginBottom: 0, padding:0, border: 0, borderTop: '1px solid #E5E5E5' }} />
        </SeparatorTitleContainer>
    );
};

const NavCategories = {
  transactions: {title: 'Transactions', icon: ic_toc, data:[["jv","Journal Vouchers"],["eoy","Year End Closing"]] },
  setups: { title: 'Setups', icon: ic_business, data:[["recurring","Recurring JV"],["common","Common JV"],["accounts","Natural Accounts"]] },
  configurations: { title: 'Configurations', icon: ic_settings,data:[["settings","Settings"],["open-gl-period","Open GL Period"],["close-gl-period","Close GL Period"]]  },
  reports: { title: 'Reports', icon: ic_picture_as_pdf,data:[["tb","Trial Balance"],["bs","Balance Sheet"],["pl","Profit & Loss"],["coa-list","COA Listing"]] }
};

const BasicSideNav = () =>
  <div style={{backgroundColor:"#FAFAFA"}}>
  <SideNav
      highlightBgColor="#eee"
      defaultSelected="products"
      highlightColor="#E91E63"
  >
      <SeparatorTitle><div>
        <Icon20 icon={NavCategories["transactions"].icon} />
        <ContainerText>{NavCategories["transactions"].title}</ContainerText>
      </div></SeparatorTitle>
      {NavCategories["transactions"].data.map( item => {
          //dynamically created the navs
          return (
              <Nav  key={item[0]} id={item[0]}>
                  <NavText> <InnerText> {item[1]} </InnerText></NavText>
              </Nav>
          );
      })}
      <SeparatorTitle>
        <div>
            <Icon20 icon={NavCategories["setups"].icon} /> 
            <ContainerText>{NavCategories["setups"].title}</ContainerText>
        </div>
      </SeparatorTitle>
      {NavCategories["setups"].data.map( item => {
        //dynamically created the navs
        return (
            <Nav key={item[0]} id={item[0]}>
                <NavText> <InnerText>{item[1]} </InnerText></NavText>
            </Nav>
        );
      })}        

      <SeparatorTitle>
        <div>
            <Icon20 icon={NavCategories["reports"].icon} /> 
            <ContainerText>{NavCategories["reports"].title}</ContainerText>
        </div>
      </SeparatorTitle>
      {NavCategories["reports"].data.map( item => {
        //dynamically created the navs
        return (
            <Nav key={item[0]} id={item[0]}>
                <NavText> <InnerText> {item[1]}</InnerText> </NavText>
            </Nav>
        );
      })}        

      <SeparatorTitle>
        <div>
            <Icon20 icon={NavCategories["configurations"].icon} /> 
            <ContainerText>{NavCategories["configurations"].title}</ContainerText>
        </div>
      </SeparatorTitle>
      {NavCategories["configurations"].data.map( item => {
        //dynamically created the navs
        return (
            <Nav key={item[0]} id={item[0]}>
                <NavText> <InnerText>{item[1]}</InnerText> </NavText>
            </Nav>
        );
      })}        

  </SideNav></div>;



class Sidebar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props)
  }


  render() {
      const {visible = true} = this.props 
        if (visible) {
          return (
              <div style={{ display: 'flex' }}>
                  <BaseContainer
                  style={{
                      paddingTop: "0px",
                      fontSize: "13px",
                      background: '#FAFAFA',
                      color: '#444',
                      boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
                  }}
                  >
                    <BasicSideNav />
                  </BaseContainer>
              </div>
          );
      } else { return null }
  }
}

// const Wrapper = styled.div`
//   display: flex;
//   justify-content: space-between;
//   padding: 0.5em 0;
//   background-color: red;
//   width:100%;
// `;

// const Image = styled(NormalImg)`
//   flex: 1;
//   margin: 0 auto;
//   width: 5em;
// `;

// const TitleLeft = styled.div`
//   flex: 1;
//   color: white;
// `

// const TitleMid = styled.div`
//   flex: 1;
//   color: white;
//   text-align: center;
//   font-size: 2em;
// `

// const TitleRight = styled.div`
//   flex: 1;
//   text-align: right;
//   margin-right: 1em;
//   color: white;
// `


export default Sidebar;
