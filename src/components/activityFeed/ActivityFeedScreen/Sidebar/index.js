import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import { View, Image } from 'react-native';
import { List, ListItem, Text, Left, Body, Icon } from 'native-base';
import { NavigationPropTypes } from '../../../../util/PropTypes';
import AuthStore from '../../../../store/AuthStore';
import UsersStore from '../../../../store/UsersStore';
import AppScreen from '../../../App/AppScreen';
import { version } from '../../../../../package.json';
import styles from './style';

const logoImage = require('../../../../assets/img/fcf-logo.png');

const Sidebar = inject(stores => ({ auth: stores.auth, users: stores.users }))(
  observer(({ navigation, auth, users }) => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImage} style={styles.logo} />
        <Text style={styles.title}>ADROIT</Text>
        {users.me.displayName ? <Text style={styles.username}>{users.me.displayName}</Text> : null}
        <Text style={styles.version}>{`v${version}`}</Text>
      </View>
      <List>
        <ListItem
          icon
          onPress={() => {
            navigation.navigate(AppScreen.Help);
          }}
        >
          <Left>
            <Icon type="FontAwesome" name="question-circle" />
          </Left>
          <Body>
            <Text>Help</Text>
          </Body>
        </ListItem>
        <ListItem icon onPress={auth.logout}>
          <Left>
            <Icon type="FontAwesome" name="sign-out" />
          </Left>
          <Body>
            <Text>Log out</Text>
          </Body>
        </ListItem>
      </List>
    </View>
  ))
);

Sidebar.wrappedComponent.propTypes = {
  auth: PropTypes.instanceOf(AuthStore).isRequired,
  users: PropTypes.instanceOf(UsersStore).isRequired,
  navigation: NavigationPropTypes.isRequired,
};

export default withNavigation(Sidebar);
