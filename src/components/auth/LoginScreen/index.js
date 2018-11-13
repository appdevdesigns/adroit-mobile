import React from 'react';
import PropTypes from 'prop-types';
import { when } from 'mobx';
import { inject, observer } from 'mobx-react';
import { View, Image, KeyboardAvoidingView, AsyncStorage, ImageBackground, Keyboard } from 'react-native';
import { Button, Text, Form, Item, Input, Spinner } from 'native-base';
import Copy from 'src/assets/Copy';
import AppScreen from 'src/components/app/AppScreen';
import AuthStore, { AuthStatus } from 'src/store/AuthStore';
import PermissionsStore from 'src/store/PermissionsStore';
import { NavigationPropTypes } from 'src/util/PropTypes';
import styles from './style';

const logoImage = require('src/assets/img/AdroitLogo.png');
const bgImage = require('src/assets/img/collage.jpg');

@inject('auth', 'permissions')
@observer
class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preCheck: true,
      username: '',
      password: '',
    };
    this.inputs = {};
    this.focusNextField = this.focusNextField.bind(this);
  }

  async componentDidMount() {
    this.cancelLoginListener = when(() => this.props.auth.isLoggedIn, this.onAuthenticated);
    await this.checkLogin();
    await this.props.permissions.init();
  }

  componentDidUpdate(nextProps) {
    if (this.state.preCheck && (nextProps.auth.isLoggedIn || nextProps.auth.loginFailed)) {
      this.setState({ preCheck: false });
    }
  }

  componentWillUnmount() {
    this.cancelLoginListener();
  }

  onAuthenticated = () => {
    this.props.navigation.navigate(AppScreen.ActivityFeed);
  };

  checkLogin = async () => {
    console.log('checkLogin');
    const sessionIsOpen = await this.props.auth.checkSession();
    if (sessionIsOpen) {
      this.props.auth.onLoggedIn();
      this.onAuthenticated();
      return;
    }
    const username = await AsyncStorage.getItem('adroit_username');
    const password = await AsyncStorage.getItem('adroit_password');
    if (username && password) {
      this.props.auth.login(username, password);
    } else {
      this.setState({
        preCheck: false,
        username: username || '',
      });
    }
  };

  focusNextField = id => {
    this.inputs[id].wrappedInstance.focus();
  };

  update = label => value => {
    this.setState({ [label]: value });
  };

  login = () => {
    const { username, password } = this.state;
    Keyboard.dismiss();
    this.props.auth.login(username, password);
  };

  render() {
    const { auth } = this.props;
    const { username, password, preCheck } = this.state;
    return (
      <ImageBackground style={styles.bgImage} source={bgImage}>
        <View style={styles.container}>
          <KeyboardAvoidingView enabled behavior="position" keyboardVerticalOffset={-60}>
            <Image source={logoImage} style={styles.logo} />
            {preCheck ? (
              <Spinner style={styles.spinner} color="#fff" />
            ) : (
              <Form>
                <Item style={styles.item}>
                  <Input
                    blurOnSubmit={false}
                    onSubmitEditing={() => {
                      this.focusNextField('password');
                    }}
                    returnKeyType="next"
                    ref={input => {
                      this.inputs.username = input;
                    }}
                    value={username}
                    onChangeText={this.update('username')}
                    style={styles.input}
                    placeholder={Copy.usernameLabel}
                    placeholderTextColor="#aaa"
                  />
                </Item>
                <Item style={styles.item}>
                  <Input
                    blurOnSubmit
                    returnKeyType="done"
                    ref={input => {
                      this.inputs.password = input;
                    }}
                    value={password}
                    onChangeText={this.update('password')}
                    secureTextEntry
                    style={styles.input}
                    placeholder={Copy.passwordLabel}
                    onSubmitEditing={this.login}
                    placeholderTextColor="#aaa"
                  />
                </Item>
                <Button style={[styles.item, styles.loginButton]} bordered block light onPress={this.login}>
                  {auth.status === AuthStatus.LoggingIn ? (
                    <Spinner size="small" color="#fff" />
                  ) : (
                    <Text>{Copy.login}</Text>
                  )}
                </Button>
              </Form>
            )}
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    );
  }
}

LoginScreen.propTypes = {
  navigation: NavigationPropTypes.isRequired,
};

LoginScreen.wrappedComponent.propTypes = {
  auth: PropTypes.instanceOf(AuthStore).isRequired,
  permissions: PropTypes.instanceOf(PermissionsStore).isRequired,
};

export default LoginScreen;
