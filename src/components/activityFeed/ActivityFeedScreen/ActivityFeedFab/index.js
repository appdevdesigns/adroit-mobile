import React from 'react';
import PropTypes from 'prop-types';
import { withNavigation, withNavigationFocus } from 'react-navigation';
import { Button, Icon, Fab } from 'native-base';
import { CopilotView, CopilotStepAddPhoto } from 'src/util/copilot';
import { NavigationPropTypes } from 'src/util/PropTypes';
import AppScreen from 'src/components/app/AppScreen';
import styles from './style';

class ActivityFeedFab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFabActive: false,
    };
  }

  toggleFab = () => {
    this.setState(prevState => ({ isFabActive: !prevState.isFabActive }));
  };

  goToPhotos = () => {
    this.setState({ isFabActive: false }, () => {
      this.props.navigation.navigate(AppScreen.Photos);
    });
  };

  goToCamera = () => {
    this.setState({ isFabActive: false }, () => {
      this.props.navigation.navigate(AppScreen.Camera);
    });
  };

  render() {
    const { isFabActive } = this.state;
    const { isFocused } = this.props;
    if (!isFocused) { return null; }
    return (
      <Fab active={isFabActive} direction="up" style={styles.fab} position="bottomRight" onPress={this.toggleFab}>
        <CopilotStepAddPhoto>
          <CopilotView style={styles.fabCopilot}>
            <Icon type="FontAwesome" name="plus" style={styles.fabIcon} />
          </CopilotView>
        </CopilotStepAddPhoto>
        <Button style={styles.fabImage} onPress={this.goToPhotos}>
          <Icon type="FontAwesome" name="image" />
        </Button>
        <Button style={styles.fabCamera} onPress={this.goToCamera}>
          <Icon type="FontAwesome" name="camera" />
        </Button>
      </Fab>
    );
  }
}

ActivityFeedFab.propTypes = {
  navigation: NavigationPropTypes.isRequired,
  isFocused: PropTypes.bool.isRequired,
};

export default withNavigation(withNavigationFocus(ActivityFeedFab));
