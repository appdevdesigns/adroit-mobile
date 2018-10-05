import React from 'react';
import PropTypes from 'prop-types';
import { when } from 'mobx';
import { inject, observer } from 'mobx-react';
import { View, Image, KeyboardAvoidingView, AsyncStorage, ImageBackground } from 'react-native';
import { Button, Text, Form, Item, Input, Spinner } from 'native-base';
import AppScreen from 'src/components/App/AppScreen';
import AuthStore, { AuthStatus } from 'src/store/AuthStore';
import { NavigationPropTypes } from 'src/util/PropTypes';
import styles from './style';

const logoImage = require('src/assets/img/fcf-logo.png');
const bgImage = require('src/assets/img/collage.jpg');

@inject(stores => ({ auth: stores.auth }))
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
    // this.props.checkPermission('ReadPhotos');
    // this.props.getTeamsForUser();
    this.props.navigation.navigate(AppScreen.ActivityFeed);
  };

  checkLogin = async () => {
    console.log('checkLogin');
    const csrfToken = await AsyncStorage.getItem('adroit_csrf');
    if (csrfToken) {
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

  updateUsername = username => {
    this.setState({ username });
  };

  updatePassword = password => {
    this.setState({ password });
  };

  login = () => {
    const { username, password } = this.state;
    this.props.auth.login(username, password);
  };

  render() {
    const { auth } = this.props;
    const { username, password, preCheck } = this.state;
    return (
      <ImageBackground style={styles.bgImage} source={bgImage}>
        <View style={styles.container}>
          <KeyboardAvoidingView enabled behavior="position">
            <Image source={logoImage} style={styles.logo} />
            <Text style={styles.title}>ADROIT</Text>
            {preCheck ? (
              <Spinner style={styles.spinner} />
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
                    onChangeText={this.updateUsername}
                    style={styles.input}
                    placeholder="Username"
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
                    onChangeText={this.updatePassword}
                    secureTextEntry
                    style={styles.input}
                    placeholder="Password"
                    onSubmitEditing={this.login}
                    placeholderTextColor="#aaa"
                  />
                </Item>
                <Button style={[styles.item, styles.loginButton]} bordered block light onPress={this.login}>
                  {auth.status === AuthStatus.LoggingIn ? <Spinner size="small" /> : <Text>Login</Text>}
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
};

// const mapStateToProps = state => ({
//   isLoading: state.auth.loading,
//   error: state.auth.error,
//   isLoggedIn: state.auth.isLoggedIn,
// });

// const mapDispatchToProps = dispatch => {
//   return {
//     onLogin: (username, password) => {
//       dispatch(login({ username, password }));
//     },
//     checkPermission: permissionName => {
//       dispatch(checkPermissionAction(permissionName));
//     },
//     getTeamsForUser: () => {
//       dispatch(getUserTeams());
//     },
//   };
// };

export default LoginScreen;
