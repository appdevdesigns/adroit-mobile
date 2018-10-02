import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { View, Image } from 'react-native';
import { List, ListItem, Text, Left, Body, Icon } from 'native-base';
import AuthStore from '../../../../store/AuthStore';
import styles from './style';

const logoImage = require('../../../../assets/img/fcf-logo.png');

const Sidebar = inject(stores => ({ auth: stores.auth }))(
  observer(({ auth }) => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImage} style={styles.logo} />
      </View>
      <List>
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
};

export default Sidebar;
