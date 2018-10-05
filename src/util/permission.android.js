import { PermissionsAndroid } from 'react-native';

const PermissionMap = {
  Camera: PermissionsAndroid.PERMISSIONS.CAMERA,
  CameraRoll: PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  SavePhoto: PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
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
    console.log('Requesting permission', perm);
    const response = await PermissionsAndroid.request(PermissionMap[perm], rationale);
    console.log('Permission response', response);
    return response;
  };
}

export default new Permission();
