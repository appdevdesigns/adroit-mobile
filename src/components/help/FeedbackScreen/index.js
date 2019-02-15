import React from 'react';
import { Linking, View } from 'react-native';
import { Container, Content, Text, Button, Icon } from 'native-base';
import AdroitScreen from 'src/components/common/AdroitScreen';
import Copy from 'src/assets/Copy';
import Constants from 'src/util/Constants';
import AdroitHeader from 'src/components/common/AdroitHeader';
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
          <AdroitHeader title={Copy.feedbackTitle} />
          <Content>
            <View style={styles.wrapper}>
              <View style={styles.introWrapper}>
                <Text style={styles.introText}>{Copy.feedbackIntro}</Text>
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
