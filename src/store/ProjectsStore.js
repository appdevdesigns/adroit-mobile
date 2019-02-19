import { action, computed, reaction } from 'mobx';
import reduce from 'lodash-es/reduce';
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

  @computed
  get allTeams() {
    return reduce(this.list, (teams, project) => teams.concat(project.teams.slice()), []);
  }

  getProjectMembersByTeam(team) {
    if (!team) {
      return [];
    }
    const project = this.map.get(team.IDProject);
    return project ? project.members.slice() : [];
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
    this.fetchList(Api.urls.myProjects);
  }
}
