export const Resource = {
  listUserTeams: 'listUserTeams',
};

const Api = {
  baseUrl: 'https://adroit.appdevdesigns.net',

  resources: {
    [Resource.listUserTeams]: {
      url: '/fcf_activities/userteam/find',
    },
  },
};

export default Api;
