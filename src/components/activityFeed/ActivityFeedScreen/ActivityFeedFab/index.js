import React from 'react';
import { withNavigation } from 'react-navigation';
import { Icon, Fab } from 'native-base';
import { CopilotView, CopilotStepAddPhoto } from 'src/util/copilot';
import { NavigationPropTypes } from 'src/util/PropTypes';
import AppScreen from 'src/components/app/AppScreen';
import styles from './style';

const ActivityFeedFab = ({ navigation }) => {
  const goToPhotos = () => {
    navigation.navigate(AppScreen.Photos);
  };

  return (
    <Fab active={false} direction="up" style={styles.fab} position="bottomRight" onPress={goToPhotos}>
      <CopilotStepAddPhoto>
        <CopilotView style={styles.fabCopilot}>
          <Icon type="FontAwesome" name="plus" style={styles.fabIcon} />
        </CopilotView>
      </CopilotStepAddPhoto>
    </Fab>
  );
};

ActivityFeedFab.propTypes = {
  navigation: NavigationPropTypes.isRequired,
};

export default withNavigation(ActivityFeedFab);
