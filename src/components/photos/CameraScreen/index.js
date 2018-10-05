import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Content, Left, Body, Text } from 'native-base';
import { inject, observer } from 'mobx-react';
import BackButton from 'src/components/common/BackButton';
import PermissionsStore, { Permission } from 'src/store/PermissionsStore';
import ErrorState from 'src/components/common/ErrorState';
import { NavigationPropTypes } from 'src/util/PropTypes';

@inject('permissions')
@observer
class CameraScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const hasPermission = await this.props.permissions.requestPermission(Permission.Camera, {
      title: 'Permission to take photos',
      message: 'Adroit needs access to your camera so you can take a photo',
    });
    console.log('has camera permission', hasPermission);
  }

  render() {
    const { navigation, permissions } = this.props;
    return (
      <Container>
        <Header>
          <Left>
            <BackButton />
          </Left>
          <Body />
        </Header>
        {permissions.canAccessCamera ? (
          <Content>
            <Text>Camera!</Text>
          </Content>
        ) : (
          <ErrorState
            title="Uh-oh!"
            message="You don't have permission to access the camera roll"
            iconName="lock"
            iconType="FontAwesome"
          />
        )}
      </Container>
    );
  }
}

CameraScreen.propTypes = {
  navigation: NavigationPropTypes.isRequired,
};

CameraScreen.wrappedComponent.propTypes = {
  permissions: PropTypes.instanceOf(PermissionsStore).isRequired,
};

CameraScreen.defaultProps = {};

export default CameraScreen;
