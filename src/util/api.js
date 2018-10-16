const BASE_URL = 'https://adroit.appdevdesigns.net';

const Api = {
  urls: {
    base: BASE_URL,
    csrfToken: '/csrfToken',
    login: '/site/login',
    whoami: '/fcf_activities/activityreport/whoami',
    listUserTeams: '/fcf_activities/userteam/find',
    teamActivities: teamId => `/fcfactivities/teamactivities?team=${teamId}`,
    activityImages: activityId => `/fcf_activities/activityimage?activity=${activityId}`,
    teamMembers: teamId => `/fcf_activities/teammembers?teamID=${teamId}`,
  },

  absoluteUrl: relativeUrl => `${BASE_URL}${relativeUrl}`,
};

export default Api;
