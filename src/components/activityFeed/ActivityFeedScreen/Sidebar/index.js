import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import { View, Image } from 'react-native';
import { List, ListItem, Text, Left, Body, Icon } from 'native-base';
import Copy from 'src/assets/Copy';
import { NavigationPropTypes } from 'src/util/PropTypes';
import AuthStore from 'src/store/AuthStore';
import UsersStore from 'src/store/UsersStore';
import AppScreen from 'src/components/app/AppScreen';
import { version } from 'package.json';
import styles from './style';

const logoImage = require('src/assets/img/AdroitLogo.png');

@inject('auth', 'users')
@observer
class Sidebar extends React.Component {
  render() {
    const { navigation, auth, users, onStartTutorial, onClose } = this.props;
    const navTo = screen => () => {
      navigation.navigate(screen);
      onClose();
    };
    const menuItems = [
      { label: Copy.drawerMenuHelp, icon: 'question-circle', onPress: navTo(AppScreen.Help) },
      { label: Copy.drawerMenuTutorial, icon: 'play-circle', onPress: onStartTutorial },
      { label: Copy.drawerMenuEditLocations, icon: 'map-marker', onPress: navTo(AppScreen.EditLocations) },
      { label: Copy.drawerMenuLogout, icon: 'sign-out', onPress: auth.logout },
    ];
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={logoImage} style={styles.logo} />
          {users.me.displayName ? <Text style={styles.username}>{users.me.displayName}</Text> : null}
          <Text style={styles.version}>{`v${version}`}</Text>
        </View>
        <List>
          {menuItems.map(({ label, icon, onPress }) => (
            <ListItem key={label} icon onPress={onPress}>
              <Left>
                <Icon type="FontAwesome" name={icon} />
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
