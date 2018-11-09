const BASE_URL = 'https://adroit.appdevdesigns.net';

const Api = {
  urls: {
    base: BASE_URL,
    csrfToken: '/csrfToken',
    login: '/site/login',
    whoami: '/fcf_activities/activityreport/whoami',
    listUserTeams: '/fcf_activities/userteam/find',
    myTeams: '/fcf_activities/mobile/myteams',
    teamActivities: teamId => `/fcfactivities/teamactivities?team=${teamId}`,
    activityImages: activityId => `/fcf_activities/activityimage?activity=${activityId}`,
    myActivityImages: `/fcf_activities/mobile/myactivityimages`,
    teamMembers: teamId => `/fcf_activities/teammembers?teamID=${teamId}`,
    activityImageUpload: '/fcf_activities/activityimageupload',
    createActivityImage: '/fcf_activities/activityimage/create',
  },

  absoluteUrl: relativeUrl => `${BASE_URL}${relativeUrl}`,
};

export default Api;
