import React from 'react';
import { Container, Header, Title, Content, Left, Body } from 'native-base';
import BackButton from 'src/components/common/BackButton';
import Copy from 'src/assets/Copy';

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
            <Title>{Copy.helpTitle}</Title>
          </Body>
        </Header>
        <Content />
      </Container>
    );
  }
}

HelpScreen.default = {};
