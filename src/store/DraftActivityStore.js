import { observable, action, runInAction, computed } from 'mobx';
import isAfter from 'date-fns/is_after'
import Api from 'src/util/api';
import { format } from 'src/util/date';
import Copy from 'src/assets/Copy';
import fetchJson from 'src/util/fetch';
import Toast from 'src/util/Toast';
import Monitoring, { Event } from 'src/util/Monitoring';

export const ActivityStatus = {
  pending: 'pending',
  saving: 'saving',
  succeeded: 'succeeded',
  failed: 'failed',
};

export default class DraftActivityStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable
  teamId;

  @observable
  status = ActivityStatus.pending;

  @observable
  activityName = '';

  @observable
  activityNameGovt = '';

  @observable
  startDate = new Date();

  @observable
  endDate = new Date();

  @observable
  teamObjectives = [];

  @observable
  description = '';

  @observable
  descriptionGovt = '';

  @observable
  atLeastOneObjectiveMet = false;
  
  @observable
  addedActivity = null;

  @computed
  get isSaving() {
    return this.status === ActivityStatus.saving;
  }

  @computed
  get isReadyForPosting() {
    return !!(
      this.activityName &&
      this.activityNameGovt &&
      this.datesAreValid(),
      this.description &&
      this.descriptionGovt &&
      this.atLeastOneObjectiveMet
    );
  }

  @action.bound
  initNewDraft(projectId, teamId) {
    const now = new Date();
    this.addedActivity = null;
    this.projectId = projectId;
    this.teamId = teamId;
    this.status = ActivityStatus.pending;
    this.teamObjectives = this.rootStore.projects.teamObjectives.get(teamId, []).map(teamObjective => ({
      ...teamObjective,
      selected: false,
    }));
    this.activityName = '';
    this.activityNameGovt = '';
    this.description = '';
    this.descriptionGovt = '';
    this.startDate = now;
    this.endDate = now;
    this.atLeastOneObjectiveMet = false;
  }

  @action.bound
  updateDraft(draftProps) {
    Object.assign(this, draftProps);
  }

  @action.bound
  setTeamObjective(objectiveIndex, selected) {
    this.teamObjectives[objectiveIndex].selected = selected;
    this.atLeastOneObjectiveMet = !!this.teamObjectives.find(o => o.selected);
  }

  @action.bound
  save() {
    const url = Api.urls.createActivity;
    const body = new FormData();
    body.append('team', String(this.teamId));
    body.append('activity_name', this.activityName);
    body.append('activity_name_govt', this.activityNameGovt);
    body.append('date_start', format(this.startDate, 'YYYY-MM-DD'));
    body.append('date_end', format(this.endDate, 'YYYY-MM-DD'));
    body.append('activity_description', this.description);
    body.append('activity_description_govt', this.descriptionGovt);
    this.teamObjectives.filter(o => o.selected).forEach(({id}) => {
      body.append('objective', String(id));
    });
    const options = {
      method: 'POST',
      body,
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      }),
    };

    this.status = ActivityStatus.saving;
    fetchJson(url, options)
      .then(response => {
        const newActivity = response.json.data;
        const activityDetails = {
          id: newActivity.id,
          activity_name: newActivity.activity_name,
          date_start: this.startDate.toISOString(),
          date_end: this.endDate.toISOString(),
        };
        runInAction(() => {
          this.addedActivity = activityDetails;
          this.status = ActivityStatus.succeeded;
        });
        
        this.rootStore.projects.addActivity(this.projectId, this.teamId, activityDetails);
        
        Monitoring.event(Event.ActivityCreationSuccess);
        // Toast.success(Copy.toast.activityCreationSuccess);
      })
      .catch(async error => {
        runInAction(() => {
          this.status = ActivityStatus.failed;
        });
        Monitoring.event(Event.ActivityCreationFail);
        Monitoring.exception(error, { problem: 'Failed to create new activity', body: options.body });
        if (error.status === 401) {
          await this.onUnauthorised();
        } else {
          Toast.danger(Copy.toast.genericError);
        }
      });
  }

  datesAreValid() {
    return this.startDate === this.endDate || isAfter(this.endDate, this.startDate);
  }
}
