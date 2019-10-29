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
  approvedSummary: (count, abbr) => `${count} ${abbr ? 'appr' : 'approved'}`,
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
  drawerMenuFeedback: 'Feedback',
  drawerMenuTutorial: 'Show tutorial',
  drawerMenuEditLocations: 'My locations...',

  // Add Photo
  addPhotoTitle: 'Add a photo',
  editPhotoTitle: 'Edit photo',
  addPhotoSaveButtonText: 'Save',
  confirmationModalTitle: 'Review your submission',
  confirmCaptionLabel: 'My caption describes how this activity is helping local Thais',
  confirmTaggedLabel: 'I have tagged everyone on my team who is in this photo',
  confirmationBackButtonText: 'Go back',
  confirmationUploadButtonText: 'Upload',
  captionLabel: 'Caption',
  captionPlaceholder: 'Describe what you did and why it helps local Thais...',
  dateLabel: 'Date of Photo',
  locationLabel: 'Activity Location',
  locationPlaceholder: 'Where was this photo taken...?',
  locationModalHeader: 'Activity Location',
  teamLabel: 'Team',
  teamPlaceholder: 'Select Team...',
  teamModalHeader: 'Select Team',
  activityLabel: 'Activity',
  selectTeamFirst: '(Select Team first)',
  activityPlaceholder: 'Select Activity...',
  activityModalHeader: 'Select Activity',
  taggedPeopleLabel: 'People in Photo',
  taggedPeoplePlaceholder: 'Tag team members...',
  taggedPeopleModalHeader: 'Who is in this photo?',
  teamMembersSectionTitle: "My Team's Volunteers",
  projectMembersSectionTitle: "My Project's Volunteers",
  myLocationsSection: 'My locations',
  fcfLocationsSection: 'FCF locations',
  selectLocationFilterPlaceholder: 'Search or add location...',
  selectActivityEmptyTitle: 'No activities to select',
  selectActivityEmptyMessage: 'Click the \'+\' button to add an activity',
  selectTaggedPeopleEmptyTitle: 'No team members to select',
  selectTaggedPeopleEmptyMessage: 'Please select a team first',

  photoFeedback: {
    title: 'Fixes required',
    reviewerPlaceholder: 'A reviewer',
    intro: ' has requested some changes:',
    button: 'Got it!',
    fixPhoto: 'Photo is not appropriate. Please use a different photo.',
    fixCaption: 'Caption needs to be re-worded to include both WHAT you are doing and HOW it impacts Thai people.',
    fixDate: 'Date of the photo is not within the current reporting period. Please correct.',
    fixLocation: 'Location is too general. Please provide complete details of the location: Name, Tambon and Ampoe.',
  },

  // Add Activity
  addActivity: {
    screenTitle: 'Add a new Activity',
    headingActivityName: 'Activity Name',
    headingDuration: 'Activity Duration',
    headingTeamObjectives: 'Team Objectives',
    headingDescription: 'Description',
    headingStartDate: 'Start Date',
    headingEndDate: 'End Date',
    descActivityName: 'Please use a name everyone associated with the activity will recognize',
    descTeamObjectives: 'Every activity must meet at least one objective. Please choose all that apply:',
    descDescription: 'Please describe this activity using the team objective as a guideline',
    labelActivityName: 'Activity Name',
    labelActivityNameGovt: 'Activity Name (Govt)',
    labelDescription: 'Description',
    labelDescriptionGovt: 'Description (Govt)',
    buttonAdd: 'Save',
    buttonCancel: 'Cancel',
  },

  // Help
  helpTitle: 'How to use Adroit',

  // Feedback
  feedbackTitle: 'Feedback',
  feedbackEmailSubject: 'Adroit Mobile feedback',
  feedbackIntro:
    'Questions about the Adroit mobile app? Suggestions? Need to report a bug? Or just want to tell us how much you love the app?!',
  feedbackEmailIntro: 'Send us an email at:',

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
    ok: 'Ok',
    cancel: 'Cancel',
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
    appUpdated: 'App updated! Please login again.',
    activityCreationSuccess: 'New activity added!',
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
