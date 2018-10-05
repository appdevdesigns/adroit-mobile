class Permission {
  hasPermission = async perm => Promise.resolve(true);

  requestPermission = async (perm, rationale) => Promise.resolve(true);
}

export default Permission;
