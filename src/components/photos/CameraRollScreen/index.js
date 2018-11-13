import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Title, Content, Left, Body } from 'native-base';
import { inject, observer } from 'mobx-react';
import Copy from 'src/assets/Copy';
import BackButton from 'src/components/common/BackButton';
import PermissionsStore, { Permission } from 'src/store/PermissionsStore';
import { NavigationPropTypes } from 'src/util/PropTypes';
import ErrorState from 'src/components/common/ErrorState';
import CameraRollList from './CameraRollList';

@inject('permissions')
@observer
class CameraRollScreen extends React.Component {
  async componentDidMount() {
    await this.props.permissions.requestPermission(Permission.ReadExternalStorage, {
      title: Copy.perms.cameraRoll.title,
      message: Copy.perms.cameraRoll.message,
    });
  }

  render() {
    const { navigation, permissions } = this.props;
    return (
      <Container>
        <Header>
          <Left>
            <BackButton />
          </Left>
          <Body>
            <Title>{Copy.camRollTitle}</Title>
          </Body>
        </Header>
        {permissions.canReadExternalStorage ? (
          <Content>
            <CameraRollList navigation={navigation} />
          </Content>
        ) : (
          <ErrorState
            title={Copy.errors.cameraRollNoPermission.title}
            message={Copy.errors.cameraRollNoPermission.message}
            iconName="lock"
            iconType="FontAwesome"
          />
        )}
      </Container>
    );
  }
}

CameraRollScreen.propTypes = {
  navigation: NavigationPropTypes.isRequired,
};

CameraRollScreen.wrappedComponent.propTypes = {
  permissions: PropTypes.instanceOf(PermissionsStore).isRequired,
};

CameraRollScreen.defaultProps = {};

export default CameraRollScreen;
