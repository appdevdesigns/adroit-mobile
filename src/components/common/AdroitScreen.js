import React from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { SafeAreaView, StatusBar } from 'react-native';
import Orientation from 'react-native-orientation';
import Theme from 'src/assets/theme';
import baseStyles from 'src/assets/style';
import { NavigationPropTypes } from 'src/util/PropTypes';

const defaultStatusBarProps = {
  backgroundColor: Theme.toolbarDefaultBg,
  barStyle: 'dark-content',
};

class AdroitScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
      this.setOrientation();
    });
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  setOrientation = () => {
    const { orientation } = this.props;
    if (orientation === 'portrait') {
      Orientation.lockToPortrait();
    } else if (orientation === 'landscape') {
      Orientation.lockToLandscape();
    } else {
      Orientation.unlockAllOrientations();
    }
  };

  render() {
    const { children, statusBarProps } = this.props;
    return (
      <SafeAreaView style={baseStyles.safeView}>
        <StatusBar {...defaultStatusBarProps} {...statusBarProps} />
        {children}
      </SafeAreaView>
    );
  }
}

AdroitScreen.propTypes = {
  orientation: PropTypes.oneOf(['portrait', 'landscape']),
  children: PropTypes.node.isRequired,
  statusBarProps: PropTypes.shape(),
  navigation: NavigationPropTypes.isRequired,
};

AdroitScreen.defaultProps = {
  orientation: 'portrait',
  statusBarProps: {},
};

export default withNavigation(AdroitScreen);
