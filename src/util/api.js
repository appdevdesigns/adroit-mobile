const Api = {
  urls: {
    base: 'https://adroit.appdevdesigns.net',
    csrfToken: '/csrfToken',
    login: '/site/login',
    whoami: '/fcf_activities/activityreport/whoami',
    listUserTeams: '/fcf_activities/userteam/find',
    teamActivities: teamId => `/fcfactivities/teamactivities?team=${teamId}`,
    activityImages: activityId => `/fcf_activities/activityimage?activity=${activityId}`,
    teamMembers: teamId => `/fcf_activities/teammembers?teamID=${teamId}`,
  },
};

export default Api;
