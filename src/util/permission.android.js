import { PermissionsAndroid } from 'react-native';
import Monitoring from 'src/util/Monitoring';

const PermissionMap = {
  TakePhotos: PermissionsAndroid.PERMISSIONS.CAMERA,
  ReadExternalStorage: PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  WriteToExternalStorage: PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
};

class Permission {
  _validatePerm = perm => {
    if (!PermissionMap[perm]) {
      throw new Error(`Unknown permission identifier: ${perm}`);
    }
  };

  hasPermission = async perm => {
    this._validatePerm(perm);
    return PermissionsAndroid.check(PermissionMap[perm]);
  };

  requestPermission = async (perm, rationale) => {
    this._validatePerm(perm);
    Monitoring.debug('Requesting permission', perm);
    const response = await PermissionsAndroid.request(PermissionMap[perm], rationale);
    Monitoring.debug('Permission response', response);
    return response;
  };
}

export default new Permission();
