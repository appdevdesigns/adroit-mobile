import React from 'react';
import PropTypes from 'prop-types';
import { when } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Container, Header, Title, Content, Button, Left, Right, Body, Icon, Drawer } from 'native-base';
import AuthStore from '../../../store/AuthStore';
import { NavigationPropTypes } from '../../../util/PropTypes';
import AppScreen from '../../App/AppScreen';
import Sidebar from './Sidebar';
import styles from './style';

@inject('auth')
@observer
class ActivityFeedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.disposeLogoutWatcher = when(() => this.props.auth.isLoggedOut, this.onLoggedOut);
  }

  componentWillUnmount() {
    this.disposeLogoutWatcher();
  }

  onLoggedOut = () => {
    this.props.navigation.navigate(AppScreen.Login);
  };

  closeDrawer = () => {
    this.drawer._root.close();
  };

  openDrawer = () => {
    this.drawer._root.open();
  };

  render() {
    const {} = this.props;
    return (
      <Drawer
        ref={ref => {
          this.drawer = ref;
        }}
        content={<Sidebar />}
        onClose={this.closeDrawer}
      >
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={this.openDrawer}>
                <Icon type="FontAwesome" name="bars" />
              </Button>
            </Left>
            <Body>
              <Title>My Photos</Title>
            </Body>
            <Right />
          </Header>
          <Content />
        </Container>
      </Drawer>
    );
  }
}

ActivityFeedScreen.propTypes = {
  navigation: NavigationPropTypes.isRequired,
};

ActivityFeedScreen.wrappedComponent.propTypes = {
  auth: PropTypes.instanceOf(AuthStore).isRequired,
};

export default ActivityFeedScreen;
