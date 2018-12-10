import React from 'react';
import { Container, Header, Title, Content, Left, Body, Right, Text } from 'native-base';
import BackButton from 'src/components/common/BackButton';
import Copy from 'src/assets/Copy';
import baseStyles from 'src/assets/style';

export default class HelpScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container>
        <Header>
          <Left style={baseStyles.headerLeft}>
            <BackButton />
          </Left>
          <Body style={baseStyles.headerBody}>
            <Title>{Copy.helpTitle}</Title>
          </Body>
          <Right style={baseStyles.headerRight} />
        </Header>
        <Content padder>
          <Text>Welcome to the help!</Text>
        </Content>
      </Container>
    );
  }
}

HelpScreen.default = {};
