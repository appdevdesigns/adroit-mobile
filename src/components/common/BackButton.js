import React from 'react';
import { withNavigation } from 'react-navigation';
import { Button, Icon } from 'native-base';
import { NavigationPropTypes } from '../../util/PropTypes';

const BackButton = ({ navigation: { goBack } }) => (
  <Button
    transparent
    onPress={() => {
      goBack();
    }}
  >
    <Icon type="FontAwesome" name="arrow-left" />
  </Button>
);

BackButton.propTypes = {
  navigation: NavigationPropTypes.isRequired,
};

export default withNavigation(BackButton);
