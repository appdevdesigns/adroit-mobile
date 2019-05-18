import { observable, action, computed, reaction, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import reduce from 'lodash-es/reduce';
import unionBy from 'lodash-es/unionBy';
import keyBy from 'lodash-es/keyBy';
import Api from 'src/util/api';
import ResourceStore from './ResourceStore';

export default class ProjectsStore extends ResourceStore {
  constructor(rootStore) {
    super(rootStore, 'IDProject', true);
    reaction(
      () => this.rootStore.auth.isLoggedIn,
      isLoggedIn => {
        if (isLoggedIn) {
          this.listMyProjects();
        }
      }
    );
  }

  @persist('map')
  @observable
  membersMap = new Map();

  @computed
  get allTeams() {
    return reduce(this.list, (teams, project) => teams.concat(project.teams.slice()), []);
  }

  getTeamMembers(team) {
    if (!team) {
      return [];
    }
    return team.memberIDs.map(id => this.membersMap.get(String(id))).filter(m => m);
  }

  getProjectMembers(projectID) {
    if (!projectID) {
      return [];
    }
    const project = this.map.get(String(projectID));
    return project ? project.memberIDs.map(id => this.membersMap.get(String(id))).filter(m => m) : [];
  }

  getTaggableMembers(team) {
    if (!team) {
      return [];
    }
    return unionBy(this.getTeamMembers(team), this.getProjectMembers(team.IDProject), 'IDPerson');
  }

  getTeam(teamId) {
    for (let i = 0; i < this.list.length; i += 1) {
      const team = this.list[i].teams.find(t => String(t.IDMinistry) === String(teamId));
      if (team) {
        return team;
      }
    }
    return null;
  }

  getActivity(activityId) {
    let project;
    let team;
    let activity;
    for (let projectIndex = 0; projectIndex < this.list.length; projectIndex += 1) {
      project = this.list[projectIndex];
      for (let teamIndex = 0; teamIndex < project.teams.length; teamIndex += 1) {
        team = project.teams[teamIndex];
        for (let activityIndex = 0; activityIndex < team.activities.length; activityIndex += 1) {
          activity = team.activities[activityIndex];
          if (String(activity.id) === String(activityId)) {
            return {
              activity_name: activity.activity_name,
              id: activity.id,
              team: {
                IDMinistry: team.IDMinistry,
                MinistryDisplayName: team.MinistryDisplayName,
              },
            };
          }
        }
      }
    }
    return null;
  }

  @action.bound
  listMyProjects() {
    const onProjectsResponse = response => {
      const projectsMap = keyBy(response.json.data.projects, i => String(i.IDProject));
      const membersMap = keyBy(response.json.data.members, i => String(i.IDPerson));
      runInAction(() => {
        if (this.map.size) {
          this.map.replace(projectsMap);
        } else {
          this.map.merge(projectsMap);
        }
        if (this.membersMap.size) {
          this.membersMap.replace(membersMap);
        } else {
          this.membersMap.merge(membersMap);
        }
        this.isInitialized = true;
        this.fetchCount = Math.max(this.fetchCount - 1, 0);
      });
    };
    this.fetch(Api.urls.myProjectsWithMembers, onProjectsResponse);
  }
}
