import React from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { View } from 'react-native';
import Orientation from 'react-native-orientation';
import baseStyles from 'src/assets/style';
import { NavigationPropTypes } from 'src/util/PropTypes';

class AdroitScreen extends React.PureComponent {
  constructor(props) {
    super(props);
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
    const { children } = this.props;
    return <View style={baseStyles.safeView}>{children}</View>;
  }
}

AdroitScreen.propTypes = {
  orientation: PropTypes.oneOf(['portrait', 'landscape']),
  children: PropTypes.node.isRequired,
  navigation: NavigationPropTypes.isRequired,
};

AdroitScreen.defaultProps = {
  orientation: 'portrait',
};

export default withNavigation(AdroitScreen);
