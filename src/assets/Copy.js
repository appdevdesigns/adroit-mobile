const Copy = {
  // Common
  defaultSelectPlaceholder: 'Select...',
  defaultSearchPlaceholder: 'Search...',
  done: 'Done',
  add: 'Add',
  couldNotFind: 'Could not find:',

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

  // Activity Feed Intro Modal
  introModalTitle1: 'Getting started with',
  introModalTitle2: 'Adroit',
  introModalMain: {
    p1: "Congratulations - you've now got Adroit on your mobile device!",
    p2: 'The best way to get started is to let us show you round the main view with a quick tutorial.',
    p3: 'You can always start the tutorial again or view the Help pages from the main menu.',
  },
  introModalNo: 'No thanks',
  introModalYes: 'Show me around!',

  // Drawer menu
  drawerMenuLogout: 'Log out',
  drawerMenuHelp: 'Help',
  drawerMenuTutorial: 'Show tutorial',
  drawerMenuEditLocations: 'My locations...',

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
  myLocationsSection: 'My locations',
  fcfLocationsSection: 'FCF locations',
  selectLocationFilterPlaceholder: 'Search or add location...',
  selectActivityEmptyTitle: 'No activities to select',
  selectActivityEmptyMessage: 'Please select a team first',
  selectTaggedPeopleEmptyTitle: 'No team members to select',
  selectTaggedPeopleEmptyMessage: 'Please select a team first',

  // Help
  helpTitle: 'How to use Adroit',

  // Edit Locations
  editLocationsTitle: 'Add/Remove Locations',
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

  // Toasts
  toast: {
    usernameRequired: 'Please enter a username',
    passwordRequired: 'Please enter a password',
    photoUploadFailed: 'Photo upload failed',
    locationAlreadyExists: 'This location already exists',
    activityPhotoUploadSuccess: 'Activity photo successfully uploaded!',
    genericError: 'Oops - something went wrong!',
    tryAgain: 'Try again',
    unauthorized: 'Please login again',
    okButtonText: 'OKAY',
  },

  // Non Ideal State
  nonIdealState: {
    emptyActivityList: {
      title: 'No photos',
      message: "You haven't yet been tagged in any photos for this reporting period.",
    },
    cameraRollNoPermission: {
      title: 'Uh-oh!',
      message: "You don't have permission to access the camera roll",
    },
    cameraRollEmpty: {
      title: 'No photos',
      message: 'Camera Roll is empty',
    },
    noUserLocations: {
      title: 'No locations',
      message: "You haven't saved any locations yet..",
    },
    defaultEmptySelect: {
      title: 'No options',
      message: 'Nothing to select here!',
    },
  },

  // Onboarding
  copilot: {
    approvedSummary: 'This is how many of your photos have been approved for this reporting period.',
    newSummary: 'This is how many new photos you have uploaded that have not yet been approved.',
    daysLeft: 'Keep an eye on how many days are left in the current reporting period.',
    overallState: "Quickly check whether you're on track with your photo uploads for this reporting period.",
    progressBars:
      "This area compares how far through the current reporting period we are (black vertical bar) with how many approved (green progress bar) and new (black progress bar) photos you've uploaded.",
    photoList: 'Your uploaded activity photos for the current reporting period are listed here.',
    addPhoto: 'Tap here to add a new activity photo.',
  },
};

export default Copy;
