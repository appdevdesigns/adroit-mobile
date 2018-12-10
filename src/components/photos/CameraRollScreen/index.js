import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Title, Content, Left, Body, Right } from 'native-base';
import { inject, observer } from 'mobx-react';
import Copy from 'src/assets/Copy';
import baseStyles from 'src/assets/style';
import BackButton from 'src/components/common/BackButton';
import PermissionsStore, { Permission } from 'src/store/PermissionsStore';
import { NavigationPropTypes } from 'src/util/PropTypes';
import NonIdealState from 'src/components/common/NonIdealState';
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
          <Left style={baseStyles.headerLeft}>
            <BackButton />
          </Left>
          <Body style={baseStyles.headerBody}>
            <Title>{Copy.camRollTitle}</Title>
          </Body>
          <Right style={baseStyles.headerRight} />
        </Header>
        {permissions.canReadExternalStorage ? (
          <Content>
            <CameraRollList navigation={navigation} />
          </Content>
        ) : (
          <NonIdealState
            title={Copy.nonIdealState.cameraRollNoPermission.title}
            message={Copy.nonIdealState.cameraRollNoPermission.message}
            icon="lock"
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
