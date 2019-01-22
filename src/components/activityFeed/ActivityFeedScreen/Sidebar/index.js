import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import codePush from 'react-native-code-push';
import { withNavigation } from 'react-navigation';
import { View, Image } from 'react-native';
import { List, ListItem, Text, Left, Body, Icon } from 'native-base';
import Copy from 'src/assets/Copy';
import { NavigationPropTypes } from 'src/util/PropTypes';
import AuthStore from 'src/store/AuthStore';
import UsersStore from 'src/store/UsersStore';
import AppScreen from 'src/components/app/AppScreen';
import Monitoring from 'src/util/Monitoring';
import { version } from 'package.json';
import styles from './style';

const logoImage = require('src/assets/img/AdroitLogo.png');

@inject('auth', 'users')
@observer
class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      metaData: {
        label: '',
        appVersion: '',
        description: '',
      },
    };
  }

  componentDidMount() {
    codePush.getUpdateMetadata().then(metaData => {
      Monitoring.debug('Code Push metadata', metaData);
      this.setState({ metaData });
    });
  }

  render() {
    const { navigation, auth, users, onStartTutorial, onClose } = this.props;
    const { metaData } = this.state;
    const navTo = screen => () => {
      navigation.navigate(screen);
      onClose();
    };
    const menuItems = [
      { label: Copy.drawerMenuHelp, icon: 'question-circle', onPress: navTo(AppScreen.Help) },
      { label: Copy.drawerMenuFeedback, icon: 'comment', onPress: navTo(AppScreen.Feedback) },
      { label: Copy.drawerMenuTutorial, icon: 'play-circle', onPress: onStartTutorial },
      { label: Copy.drawerMenuEditLocations, icon: 'map-marker', onPress: navTo(AppScreen.EditLocations) },
      { label: Copy.drawerMenuLogout, icon: 'sign-out', onPress: auth.logout },
    ];
    const versionString = `${version}${metaData && metaData.label ? `.${metaData.label}` : '.???'}`;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={logoImage} style={styles.logo} />
          {users.me.displayName ? <Text style={styles.username}>{users.me.displayName}</Text> : null}
          <Text style={styles.version}>{versionString}</Text>
        </View>
        <List>
          {menuItems.map(({ label, icon, onPress }) => (
            <ListItem key={label} icon onPress={onPress}>
              <Left>
                <Icon type="FontAwesome" name={icon} style={styles.menuIcon} />
              </Left>
              <Body>
                <Text>{label}</Text>
              </Body>
            </ListItem>
          ))}
        </List>
      </View>
    );
  }
}

Sidebar.propTypes = {
  navigation: NavigationPropTypes.isRequired,
  onStartTutorial: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

Sidebar.wrappedComponent.propTypes = {
  auth: PropTypes.instanceOf(AuthStore).isRequired,
  users: PropTypes.instanceOf(UsersStore).isRequired,
};

export default withNavigation(Sidebar);
