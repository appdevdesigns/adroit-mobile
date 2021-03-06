import React from 'react';
import PropTypes from 'prop-types';
import { when } from 'mobx';
import { inject, observer } from 'mobx-react';
import SplashScreen from 'react-native-splash-screen';
import { Animated, View, ImageBackground, Keyboard, StatusBar } from 'react-native';
import { Button, Text, Form, Item, Input, Spinner, Icon } from 'native-base';
import Copy from 'src/assets/Copy';
import Theme, { Color } from 'src/assets/theme';
import { logoDim } from 'src/assets/style';
import AppScreen from 'src/components/app/AppScreen';
import AdroitScreen from 'src/components/common/AdroitScreen';
import AuthStore, { AuthStatus } from 'src/store/AuthStore';
import PermissionsStore from 'src/store/PermissionsStore';
import DeviceInfoStore from 'src/store/DeviceInfoStore';
import { NavigationPropTypes } from 'src/util/PropTypes';
import Toast from 'src/util/Toast';
import styles from './style';

const logoImage = require('src/assets/img/AdroitLogoNew.png');
const bgImage = require('src/assets/img/collage.jpg');

const defaultLogoHeight = logoDim.height / 2;
const defaultLogoWidth = logoDim.width / 2;

@inject('auth', 'permissions', 'deviceInfo')
@observer
class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preCheck: true,
      username: '',
      password: '',
      logoHeight: new Animated.Value(defaultLogoHeight),
      logoWidth: new Animated.Value(defaultLogoWidth),
    };
    this.inputs = {};
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }

  async componentDidMount() {
    SplashScreen.hide();
    this.cancelLoginListener = when(() => this.props.auth.isLoggedIn, this.onAuthenticated);
    await this.checkLogin();
    await this.props.permissions.init();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.preCheck && (nextProps.auth.isLoggedIn || nextProps.auth.loginFailed)) {
      this.setState({ preCheck: false });
    }
  }

  componentWillUnmount() {
    if (this.cancelLoginListener) {
      this.cancelLoginListener();
    }
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  scaleLogo = scale => {
    const duration = 200;
    Animated.parallel([
      Animated.timing(this.state.logoHeight, {
        toValue: defaultLogoHeight * scale,
        duration,
      }),
      Animated.timing(this.state.logoWidth, {
        toValue: defaultLogoWidth * scale,
        duration,
      }),
    ]).start();
  };

  keyboardDidShow = () => {
    this.scaleLogo(0.5);
  };

  keyboardDidHide = () => {
    this.scaleLogo(1);
  };

  onAuthenticated = () => {
    this.props.navigation.navigate(AppScreen.ActivityFeed);
  };

  checkLogin = async () => {
    await this.props.deviceInfo.checkCodePushVersion();
    const sessionIsOpen = await this.props.auth.checkSession();
    if (sessionIsOpen) {
      const { username } = await AuthStore.getCachedCredentials();
      this.props.auth.onLoggedIn(username);
      this.onAuthenticated();
      return;
    }
    const { username, password } = await AuthStore.getCachedCredentials();
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
    if (!username) {
      Toast.warning(Copy.toast.usernameRequired);
    } else if (!password) {
      Toast.warning(Copy.toast.passwordRequired);
    } else {
      Keyboard.dismiss();
      this.props.auth.login(username, password);
    }
  };

  render() {
    const { auth } = this.props;
    const { username, password, preCheck, logoHeight, logoWidth } = this.state;
    const logoTransform = { height: logoHeight, width: logoWidth };
    return (
      <AdroitScreen>
        <StatusBar hidden />
        <ImageBackground style={styles.bgImage} source={bgImage}>
          <View style={styles.container}>
            <Animated.Image source={logoImage} style={[styles.logo, logoTransform]} />
            {preCheck ? (
              <Spinner style={styles.spinner} color={Theme.inverseTextColor} />
            ) : (
              <Form>
                <Item style={styles.item}>
                  <Icon style={styles.inputIcon} type="FontAwesome" name="user" />
                  <Input
                    ref={input => {
                      this.inputs.username = input;
                    }}
                    blurOnSubmit={false}
                    autoCapitalize="none"
                    textContentType="username"
                    returnKeyType="next"
                    value={username}
                    onChangeText={this.update('username')}
                    style={styles.input}
                    selectionColor={Theme.inverseTextColor}
                    placeholder={Copy.usernameLabel}
                    placeholderTextColor={Color.lightTextMuted}
                    onSubmitEditing={() => {
                      this.focusNextField('password');
                    }}
                  />
                </Item>
                <Item style={styles.item}>
                  <Icon style={styles.inputIcon} type="FontAwesome" name="lock" />
                  <Input
                    ref={input => {
                      this.inputs.password = input;
                    }}
                    blurOnSubmit
                    returnKeyType="done"
                    textContentType="password"
                    value={password}
                    onChangeText={this.update('password')}
                    secureTextEntry
                    style={styles.input}
                    selectionColor={Theme.inverseTextColor}
                    placeholder={Copy.passwordLabel}
                    placeholderTextColor={Color.lightTextMuted}
                    onSubmitEditing={this.login}
                  />
                </Item>
                <Button style={[styles.item, styles.loginButton]} bordered block light onPress={this.login}>
                  {auth.status === AuthStatus.LoggingIn ? (
                    <Spinner size="small" color={Theme.inverseTextColor} />
                  ) : (
                    <Text>{Copy.login}</Text>
                  )}
                </Button>
              </Form>
            )}
          </View>
        </ImageBackground>
      </AdroitScreen>
    );
  }
}

LoginScreen.propTypes = {
  navigation: NavigationPropTypes.isRequired,
};

LoginScreen.wrappedComponent.propTypes = {
  auth: PropTypes.instanceOf(AuthStore).isRequired,
  permissions: PropTypes.instanceOf(PermissionsStore).isRequired,
  deviceInfo: PropTypes.instanceOf(DeviceInfoStore).isRequired,
};

export default LoginScreen;
