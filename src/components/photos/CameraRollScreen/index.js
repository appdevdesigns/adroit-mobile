import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Title, Content, Left, Body, Right } from 'native-base';
import { inject, observer } from 'mobx-react';
import BackButton from 'src/components/common/BackButton';
import PermissionsStore, { Permission } from 'src/store/PermissionsStore';
import { NavigationPropTypes } from 'src/util/PropTypes';
import ErrorState from 'src/components/common/ErrorState';
import CameraRollList from './CameraRollList';

@inject('permissions')
@observer
class CameraRollScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const hasPermission = await this.props.permissions.requestPermission(Permission.ReadExternalStorage, {
      title: 'Permission to read storage',
      message: 'Adroit needs access to your storage so you can select a photo',
    });
    console.log('has camera roll permission', hasPermission);
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
            <Title>Select a photo</Title>
          </Body>
          <Right />
        </Header>
        {permissions.canReadExternalStorage ? (
          <Content>
            <CameraRollList navigation={navigation} />
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

CameraRollScreen.propTypes = {
  navigation: NavigationPropTypes.isRequired,
};

CameraRollScreen.wrappedComponent.propTypes = {
  permissions: PropTypes.instanceOf(PermissionsStore).isRequired,
};

CameraRollScreen.defaultProps = {};

export default CameraRollScreen;
