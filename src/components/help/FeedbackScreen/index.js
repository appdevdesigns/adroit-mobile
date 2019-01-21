import React from 'react';
import { Linking, View } from 'react-native';
import { Container, Header, Title, Content, Left, Body, Right, Text, Button, Icon } from 'native-base';
import AdroitScreen from 'src/components/common/AdroitScreen';
import BackButton from 'src/components/common/BackButton';
import Copy from 'src/assets/Copy';
import baseStyles from 'src/assets/style';
import Constants from 'src/util/Constants';
import styles from './style';

export default class FeedbackScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  gotoMail = () => {
    Linking.openURL(`mailto:${Constants.contactEmailAddress}`);
  };

  render() {
    return (
      <AdroitScreen>
        <Container>
          <Header>
            <Left style={baseStyles.headerLeft}>
              <BackButton />
            </Left>
            <Body style={baseStyles.headerBody}>
              <Title>{Copy.feedbackTitle}</Title>
            </Body>
            <Right style={baseStyles.headerRight} />
          </Header>
          <Content>
            <View style={styles.wrapper}>
              <View style={styles.introWrapper}>
                <Text style={styles.introText}>
                  {Copy.feedbackIntro}
                </Text>
              </View>
              <Text style={styles.emailText}>{Copy.feedbackEmailIntro}</Text>
              <Button iconLeft onPress={this.gotoMail} style={styles.emailButton}>
                <Icon type="FontAwesome" name="external-link" />
                <Text uppercase={false}>{Constants.contactEmailAddress}</Text>
              </Button>
            </View>
          </Content>
        </Container>
      </AdroitScreen>
    );
  }
}
