import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { Container, Header, Title, Content, Left, Body, Right, Text } from 'native-base';
import BackButton from 'src/components/common/BackButton';
import Copy from 'src/assets/Copy';
import Theme from 'src/assets/theme';
import baseStyles from 'src/assets/style';

export default class HelpScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView style={baseStyles.safeView}>
        <StatusBar barStyle="dark-content" backgroundColor={Theme.toolbarDefaultBg} />
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
            <Text>Coming soon!</Text>
          </Content>
        </Container>
      </SafeAreaView>
    );
  }
}

HelpScreen.default = {};
