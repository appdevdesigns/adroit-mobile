import React from 'react';
import { Container, Header, Title, Content, Left, Right, Body } from 'native-base';
import BackButton from '../../common/BackButton';

export default class HelpScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <BackButton />
          </Left>
          <Body>
            <Title>How to use Adroit</Title>
          </Body>
          <Right />
        </Header>
        <Content />
      </Container>
    );
  }
}

HelpScreen.default = {};
