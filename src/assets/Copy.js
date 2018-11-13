const Copy = {
  // Common
  defaultSelectPlaceholder: 'Select...',

  // Login
  login: 'Login',
  usernameLabel: 'Username',
  passwordLabel: 'Password',

  // Activity Feed
  activityFeedTitle: 'My Activity Photos',
  reportingPeriodStatusAhead: 'ahead',
  reportingPeriodStatusOnTrack: 'on track',
  reportingPeriodStatusBehind: 'behind',
  reportingPeriodStatusWarning: 'warning',
  approvedSummary: count => `${count} approved`,
  newSummary: count => `${count} new`,
  daysLeft: days => `${days} days left`,
  emptyActivityList: "You haven't yet been tagged in any photos for this reporting period.",

  // Drawer menu
  drawerMenuLogout: 'Log out',
  drawerMenuHelp: 'Help',
  drawerMenuEditLocations: 'Edit saved locations',

  // Add Photo
  addPhotoTitle: 'Add a photo',
  addPhotoSaveButtonText: 'Save',
  confirmationModalTitle: 'Review your submission',
  confirmCaptionLabel: 'My caption describes how I am helping local Thais',
  confirmTaggedLabel: 'I have tagged everyone on my team who is in this photo',
  confirmationBackButtonText: 'Go back',
  confirmationUploadButtonText: 'Upload',
  photoLocation: 'Photo location',
  captionLabel: 'Caption',
  captionPlaceholder: 'Describe what you did and why it helps local Thais...',
  dateLabel: 'Date',
  locationLabel: 'Location',
  locationPlaceholder: 'Where was this photo taken...?',
  locationModalHeader: 'Photo location',
  teamLabel: 'Team',
  teamPlaceholder: 'Select Team...',
  teamModalHeader: 'Select Team',
  activityLabel: 'Activity',
  activityPlaceholder: 'Select Activity...',
  activityModalHeader: 'Select Activity',
  taggedPeopleLabel: 'Tagged People',
  taggedPeoplePlaceholder: 'Tag team members...',
  taggedPeopleModalHeader: 'Select team members',

  // Help
  helpTitle: 'How to use Adroit',

  // Edit Locations
  editLocationsTitle: 'Edit Locations',
  editLocationsEmpty: "You haven't saved any locations yet..",
  editLocationsHelp: {
    title: 'Your saved locations',
    p1:
      'As an alternative to selecting one of the default FCF locations, you can add a new location when uploading an activity photo.',
    p2: "Any 'custom' locations you add are stored on your device and available to select again.",
    p3:
      "You can remove any of these 'custom' locations on this page. (This will not affect any previously uploaded photos tagged with that location).",
  },

  // Camera Roll
  camRollTitle: 'Select a photo',
  camRollEmpty: 'Camera Roll is empty',
  takeAPhotoCta: 'Take a photo',
  useThisPhotoButtonText: 'Use this photo',

  // Permissions
  perms: {
    cameraRoll: {
      title: 'Permission to read storage',
      message: 'Adroit needs access to your storage so you can select a photo',
    },
    cameraRollWrite: {
      title: 'Permission to save photos',
      message: 'Adroit needs access to your external storage so you can save photos to your camera roll',
    },
    camera: {
      title: 'Permission to use camera',
      message: 'We need your permission to use your camera phone',
    },
  },

  // Error states
  errors: {
    cameraRollNoPermission: {
      title: 'Uh-oh!',
      message: "You don't have permission to access the camera roll",
    },
  },
};

export default Copy;
