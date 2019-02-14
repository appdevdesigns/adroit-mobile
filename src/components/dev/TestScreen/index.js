import React from 'react';
import { Container, Header, Title, Content, Left, Body, Right, Text } from 'native-base';
import AdroitScreen from 'src/components/common/AdroitScreen';
import BackButton from 'src/components/common/BackButton';
import baseStyles from 'src/assets/style';

export default class TestScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <AdroitScreen>
        <Container>
          <Header>
            <Left style={baseStyles.headerLeft}>
              <BackButton />
            </Left>
            <Body style={baseStyles.headerBody}>
              <Title>Test</Title>
            </Body>
            <Right style={baseStyles.headerRight} />
          </Header>
          <Content padder>
            <Text>Test page</Text>
          </Content>
        </Container>
      </AdroitScreen>
    );
  }
}
