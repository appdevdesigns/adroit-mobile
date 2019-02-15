import React from 'react';
import { Container, Content, Text } from 'native-base';
import AdroitScreen from 'src/components/common/AdroitScreen';
import AdroitHeader from 'src/components/common/AdroitHeader';
import Copy from 'src/assets/Copy';

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
          <Content padder>
            <Text>Coming soon!</Text>
          </Content>
        </Container>
      </AdroitScreen>
    );
  }
}
