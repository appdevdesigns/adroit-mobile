import { observable, action, computed, reaction, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import reduce from 'lodash-es/reduce';
import unionBy from 'lodash-es/unionBy';
import keyBy from 'lodash-es/keyBy';
import sortBy from 'lodash-es/sortBy';
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

  @persist('map')
  @observable
  teamObjectives = new Map();

  @computed
  get teamObjectivesList() {
    return sortBy(Array.from(this.teamObjectives.values()), ['id']);
  }

  getTeamMembers(team) {
    if (!team) {
      return [];
    }
    return this.toMembersList(team.memberIDs);
  }

  getProjectMembers(projectID) {
    if (!projectID) {
      return [];
    }
    const project = this.map.get(String(projectID));
    return project ? this.toMembersList(project.memberIDs) : [];
  }

  getTaggableMembers(team) {
    if (!team) {
      return [];
    }
    return unionBy(this.getTeamMembers(team), this.getProjectMembers(team.IDProject), 'IDPerson');
  }

  toMembersList(memberIDs) {
    const authUserId = parseInt(this.rootStore.users.me.id, 10);
    const members = memberIDs.map(id => this.membersMap.get(String(id))).filter(m => m);
    // eslint-disable-next-line no-nested-ternary
    return members.sort((x, y) => (x.IDPerson === authUserId ? -1 : y.IDPerson === authUserId ? 1 : 0)).slice();
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

  taggedPeople(taggedPeople, projectId) {
    // Just need to populate the avatar attribute for each tagged person
    return taggedPeople.map(p => {
      const matchingPerson = this.map.get(projectId).members.find(m => m.IDPerson === p.IDPerson);
      return {
        ...p,
        avatar: matchingPerson ? matchingPerson.avatar : null,
      };
    });
  }

  @action.bound
  addActivity(projectId, teamId, newActivity) {
    const team = this.getTeam(teamId);
    team.activities.unshift(newActivity);
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
      // Get the team objectives for each team in each project
      response.json.data.projects.forEach(project => {
        project.teams.forEach(team => {
          this.getTeamObjectives(team.IDMinistry);
        });
      });
    };
    this.fetch(Api.urls.myProjectsWithMembers, onProjectsResponse);
  }

  getTeamObjectives(teamId) {
    const teamObjectivesUrl = Api.urls.teamObjectives(teamId);
    const onListResponse = response => {
      runInAction(() => {
        this.teamObjectives.set(teamId, response.json.data);
      });
    };
    this.fetch(teamObjectivesUrl, onListResponse);
  }
}
