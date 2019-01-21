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
    style={{ paddingLeft: 8, paddingRight: 6}}
    {...props}
  >
    <Icon type="FontAwesome" name="chevron-left" style={{color: '#fff', marginTop: 0, marginRight: 2, marginLeft: 1, paddingTop: 1}}/>
  </Button>
);

BackButton.propTypes = {
  navigation: NavigationPropTypes.isRequired,
};

export default withNavigation(BackButton);
