import React from 'react';
import PropTypes from 'prop-types';
import { Container, Content } from 'native-base';
import { inject, observer } from 'mobx-react';
import Copy from 'src/assets/Copy';
import AdroitHeader from 'src/components/common/AdroitHeader';
import PermissionsStore, { Permission } from 'src/store/PermissionsStore';
import { NavigationPropTypes } from 'src/util/PropTypes';
import AdroitScreen from 'src/components/common/AdroitScreen';
import NonIdealState from 'src/components/common/NonIdealState';
import CameraRollList from './CameraRollList';

@inject('permissions')
@observer
class CameraRollScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: this.props.permissions.canReadExternalStorage,
    };
  }

  async componentDidMount() {
    const hasPermission = await this.props.permissions.requestPermission(Permission.ReadExternalStorage, {
      title: Copy.perms.cameraRoll.title,
      message: Copy.perms.cameraRoll.message,
    });
    this.setState({ hasPermission });
    console.log('Permission.ReadExternalStorage', hasPermission);
  }

  render() {
    const { navigation } = this.props;
    const { hasPermission } = this.state;
    return (
      <AdroitScreen>
        <Container>
          <AdroitHeader title={Copy.camRollTitle} />
          {hasPermission ? (
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
      </AdroitScreen>
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
