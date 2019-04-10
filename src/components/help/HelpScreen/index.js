import React from 'react';
import { Container, Content } from 'native-base';
import { WebView } from 'react-native-webview';
import AdroitScreen from 'src/components/common/AdroitScreen';
import AdroitHeader from 'src/components/common/AdroitHeader';
import Copy from 'src/assets/Copy';
import html from 'src/../public/help.html';
import styles from './style';


export default class HelpScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <AdroitScreen>
        <Container>
          <AdroitHeader title={Copy.helpTitle} />
          <Content contentContainerStyle={styles.webViewWrapper}>
            <WebView originWhitelist={['*']} source={{ html }} />
          </Content>
        </Container>
      </AdroitScreen>
    );
  }
}
