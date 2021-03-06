import { observable, action, runInAction, computed } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';
import isEqual from 'lodash-es/isEqual';
import intersectionBy from 'lodash-es/intersectionBy';
import Exif from 'react-native-exif';
import parse from 'date-fns/parse';
import fetchJson from 'src/util/fetch';
import Copy from 'src/assets/Copy';
import xhr from 'src/util/xhr';
import Api from 'src/util/api';
import Toast from 'src/util/Toast';
import { format } from 'src/util/date';
import Monitoring, { Event } from 'src/util/Monitoring';
import { PostStatus } from './ResourceStore';

export const UploadStatus = {
  pending: 'pending',
  uploading: 'uploading',
  succeeded: 'succeeded',
  failed: 'failed',
};

export default class DraftActivityImageStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable
  isNew = true;

  @observable
  id = undefined;

  @observable
  image = undefined;

  @observable
  caption = '';

  @observable
  date = undefined;

  @observable
  location = undefined;

  @observable
  team = undefined;

  @observable
  activity = undefined;

  @observable
  taggedPeople = undefined;

  @observable
  uploadedImageName = undefined;

  @observable
  postStatus = PostStatus.pending;

  @observable
  uploadStatus = UploadStatus.pending;

  @observable
  uploadProgressPercent = 0;

  @observable
  feedback = undefined;

  @observable
  showFeedback = false;

  @computed
  get fixPhoto() {
    return this.feedback && this.feedback.fixPhoto && !this.isDirty('uploadedImageName');
  }

  @computed
  get fixCaption() {
    return this.feedback && this.feedback.fixCaption && !this.isDirty('caption');
  }

  @computed
  get fixLocation() {
    return this.feedback && this.feedback.fixLocation && !this.isDirty('location');
  }

  @computed
  get fixDate() {
    return this.feedback && this.feedback.fixDate && !this.isDirty('date');
  }

  @computed
  get fixTeam() {
    return this.feedback && this.feedback.fixTeam && !this.isDirty('team');
  }

  @computed
  get fixActivity() {
    return this.feedback && this.feedback.fixActivity && !this.isDirty('activity');
  }

  @computed
  get fixTaggedPeople() {
    return this.feedback && this.feedback.fixTaggedPeople && !this.isDirty('taggedPeople');
  }

  @computed
  get isUploaded() {
    return this.uploadStatus === UploadStatus.succeeded;
  }

  @computed
  get isReadyForPosting() {
    return !!(
      !this.fixPhoto &&
      !this.fixCaption &&
      !this.fixLocation &&
      !this.fixDate &&
      !this.fixTeam &&
      !this.fixActivity &&
      !this.fixTaggedPeople &&
      this.isUploaded &&
      this.caption &&
      this.caption.length &&
      this.date &&
      this.location &&
      this.team &&
      this.activity &&
      this.taggedPeople.length
    );
  }

  isDirty(field) {
    return !isEqual(this[field], this._cache[field]);
  }

  cacheState() {
    this._cache = {
      uploadedImageName: this.uploadedImageName,
      caption: this.caption,
      location: this.location,
      date: this.date,
      team: this.team,
      activity: this.activity,
      taggedPeople: this.taggedPeople,
    };
  }

  @action.bound
  async initNewDraft() {
    const { projects } = this.rootStore;
    this.id = undefined;
    this.feedback = undefined;
    this.showFeedback = false;
    this.isNew = true;
    this.image = undefined;
    this.caption = '';
    this.date = undefined;
    this.location = undefined;
    const lastTeamId = await AsyncStorage.getItem('last_team_id');
    runInAction(() => {
      if (lastTeamId && projects.list && projects.list.length) {
        this.team = projects.getTeam(lastTeamId);
      } else {
        this.team = undefined;
      }
      this.activity = undefined;
      this.taggedPeople = [];
      this.resetUpload();
      this.cacheState();
    });
  }

  @action.bound
  setDraft(activityImage) {
    this.isNew = false;
    this.id = activityImage.id;
    this.feedback = activityImage.feedback;
    this.showFeedback = !!activityImage.feedback;
    this.image = { uri: `${Api.urls.base}${activityImage.image}` };
    this.caption = activityImage.caption;
    this.date = parse(activityImage.date);
    this.location = this.rootStore.locations.getLocation(activityImage.caption_govt);
    this.team = this.rootStore.projects.getTeam(activityImage.activity.team.IDMinistry);
    this.activity = this.rootStore.projects.getActivity(activityImage.activity.id);
    this.taggedPeople = this.rootStore.projects.toMembersList(activityImage.tagged_people.map(p => p.IDPerson));
    this.uploadedImageName = activityImage.image;
    if (activityImage.image) {
      this.uploadStatus = UploadStatus.succeeded;
      this.uploadProgressPercent = 100;
    } else {
      this.uploadStatus = UploadStatus.pending;
      this.uploadProgressPercent = 0;
    }
    this.postStatus = PostStatus.pending;
    this.cacheState();
  }

  @action.bound
  updateDraft(draftProps) {
    Object.assign(this, draftProps);
  }

  @action.bound
  updateImage(image) {
    this.image = image;
    this.setDateFromImage(image);
    this.uploadImage();
  }

  @action.bound
  updateTeam(team) {
    const { users, projects } = this.rootStore;
    const prevTeam = this.team;
    const allTaggable = projects.getTaggableMembers(team);
    if (!prevTeam && users && users.me) {
      const me = allTaggable.find(m => String(m.IDPerson) === String(users.me.id));
      if (me) {
        this.taggedPeople = [me];
      }
    } else if (prevTeam && prevTeam.IDMinistry !== team.IDMinistry) {
      this.activity = undefined;
      this.taggedPeople = intersectionBy(this.taggedPeople || [], allTaggable, 'IDPerson');
    }
    this.team = team;
  }

  setDateFromImage(image) {
    const imageUri = image.uri;
    const today = new Date();
    Exif.getExif(imageUri)
      .then(data => {
        if (data.exif && data.exif.DateTime) {
          try {
            const formattedDate = data.exif.DateTime.replace(':', '-').replace(':', '-');
            const date = parse(formattedDate);
            this.updateDraft({ date });
          } catch (err) {
            Monitoring.exception(err, { data, problem: 'Failed to parse exif data' });
            this.updateDraft({ date: today });
          }
        } else {
          Monitoring.debug('No exif data available');
          this.updateDraft({ date: today });
        }
      })
      .catch(msg => {
        Monitoring.exception(msg, { problem: 'Exif.getExif ERROR' });
        this.updateDraft({ date: today });
      });
  }

  @action.bound
  resetUpload() {
    this.postStatus = PostStatus.pending;
    this.uploadedImageName = undefined;
    this.uploadStatus = UploadStatus.pending;
    this.uploadProgressPercent = 0;
  }

  @action.bound
  uploadImage() {
    this.resetUpload();

    const body = new FormData();
    body.append('imageFile', {
      uri: this.image.uri,
      type: 'image/jpeg',
      name: 'activityPhoto.jpeg',
    });

    this.uploadStatus = UploadStatus.uploading;
    this.uploadProgressPercent = 0;

    const url = Api.urls.activityImageUpload;

    const onUploadError = () => {
      Toast.danger(Copy.toast.photoUploadFailed);
      runInAction(() => {
        this.uploadStatus = UploadStatus.failed;
      });
    };

    const options = {
      method: 'POST',
      body,
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      }),
    };

    fetchJson(url, options)
      .then(response => {
        try {
          runInAction(() => {
            this.uploadProgressPercent = 100;
            this.uploadedImageName = response.json.data.name;
            this.uploadStatus = UploadStatus.succeeded;
          });
        } catch (error) {
          Monitoring.exception(error, {
            problem: 'Failed to parse response from file upload',
            response: response.currentTarget.response,
            url,
            body,
          });
          onUploadError();
        }
      })
      .catch(async error => {
        if (error.status === 401) {
          Toast.danger(Copy.toast.unauthorized);
          await this.rootStore.auth.logout();
        } else {
          Monitoring.error('Failed to upload file', { url, body, error });
          onUploadError();
        }
      });
  }

  @action.bound
  upload() {
    const url = this.isNew ? Api.urls.createActivityImage : Api.urls.updateActivityImage(this.id);
    const body = new FormData();
    if (!this.isNew) {
      body.append('id', String(this.id));
      body.append('status', 'new');
    }
    body.append('activity', String(this.activity.id));
    body.append('caption', this.caption);
    body.append('caption_govt', this.location.name);
    body.append('date', format(this.date, 'YYYY-MM-DD'));
    this.taggedPeople.forEach(person => {
      body.append('taggedPeople', person.IDPerson);
    });
    body.append('image', this.uploadedImageName);
    const options = {
      method: this.isNew ? 'POST' : 'PUT',
      body,
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      }),
    };

    this.postStatus = PostStatus.sending;
    fetchJson(url, options)
      .then(response => {
        const newActivityImage = response.json.data;
        newActivityImage.activity = this.rootStore.projects.getActivity(newActivityImage.activity);
        if (!this.isNew) {
          // HACK: Need to re-populate some fields as they are not correctly populated in the PUT response
          newActivityImage.taggedPeople = this.taggedPeople.map(p => p.IDPerson);
          newActivityImage.uploadedBy = {
            IDPerson: parseInt(this.rootStore.users.me.id, 10),
          };
          newActivityImage.displayName = this.rootStore.users.me.displayName;
        }
        runInAction(() => {
          if (newActivityImage.taggedPeople.includes(parseInt(this.rootStore.users.me.id, 10))) {
            this.rootStore.activityImages.updateActivityImage(String(newActivityImage.id), newActivityImage);
          } else {
            Monitoring.debug(
              "Authenticated user not tagged in uploaded photo so it won't be displayed in the activity feed"
            );
            // Handle the corner case where the authenticated user _used_ to be tagged in the activity image
            // but is no longer tagged in it (after editing)
            this.rootStore.activityImages.removeActivityImage(String(newActivityImage.id));
          }
          this.postStatus = PostStatus.succeeded;
        });
        Monitoring.event(Event.ActivityPhotoUploadSuccess);
        Toast.success(Copy.toast.activityPhotoUploadSuccess);
      })
      .catch(async error => {
        runInAction(() => {
          this.postStatus = PostStatus.failed;
        });
        Monitoring.event(Event.ActivityPhotoUploadFail);
        Monitoring.exception(error, { problem: 'Failed to upload activity image', body: options.body });
        if (error.status === 401) {
          await this.onUnauthorised();
        } else {
          Toast.danger(Copy.toast.genericError);
        }
      });
  }
}
