import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import NormalImg from 'components/Img';

//import Logo from './logo.png';
import messages from './messages';
import {withRouter} from 'react-router-dom';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    // console.log("Header props", this.props)

    return (
      <div>
        <Wrapper>
          <TitleLeft>
            {/*<Image src={Logo} alt="Logo"></Image>*/}
          </TitleLeft>
          <TitleMid>GL Application</TitleMid>
          <TitleRight>{this.context.userName}</TitleRight>
        </Wrapper>
      </div>
    )
  }
}
Header.contextTypes = {
  userName: PropTypes.string,
  // setUsername: PropTypes.func
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5em 0;
  background-color: red;
  width:100%;
`;

const Image = styled(NormalImg)`
  flex: 1;
  margin: 0 auto;
  width: 5em;
`;

const TitleLeft = styled.div`
  flex: 1;
  color: white;
`

const TitleMid = styled.div`
  flex: 1;
  color: white;
  text-align: center;
  font-size: 2em;
`

const TitleRight = styled.div`
  flex: 1;
  text-align: right;
  margin-right: 1em;
  color: white;
`


export default withRouter(Header);
