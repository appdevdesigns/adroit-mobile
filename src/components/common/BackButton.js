import React from 'react';
import { withNavigation } from 'react-navigation';
import { Button, Icon } from 'native-base';
import { NavigationPropTypes } from 'src/util/PropTypes';

const BackButton = ({ navigation: { goBack }, ...props }) => (
  <Button
    transparent
    onPress={() => {
      goBack();
    }}
    {...props}
  >
    <Icon type="FontAwesome" name="chevron-left" />
  </Button>
);

BackButton.propTypes = {
  navigation: NavigationPropTypes.isRequired,
};

export default withNavigation(BackButton);
