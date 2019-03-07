import { observable, action, runInAction, computed } from 'mobx';
import parse from 'date-fns/parse';
import fetchJson from 'src/util/fetch';
import Copy from 'src/assets/Copy';
import xhr from 'src/util/xhr';
import Api from 'src/util/api';
import Toast from 'src/util/Toast';
import { format } from 'src/util/date';
import Monitoring from 'src/util/Monitoring';
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

  @computed
  get isUploaded() {
    return this.uploadStatus === UploadStatus.succeeded;
  }

  @computed
  get isReadyForPosting() {
    return !!(
      this.uploadStatus === UploadStatus.succeeded &&
      this.caption &&
      this.caption.length &&
      this.date &&
      this.location &&
      this.team &&
      this.activity &&
      this.taggedPeople.length
    );
  }

  @action.bound
  initNewDraft(image) {
    this.isNew = true;
    this.image = image;
    this.caption = '';
    this.date = undefined;
    this.location = undefined;
    this.team = undefined;
    this.activity = undefined;
    this.taggedPeople = [];
    this.uploadedImageName = undefined;
    this.uploadStatus = UploadStatus.pending;
    this.postStatus = PostStatus.pending;
    this.uploadProgressPercent = 0;
  }

  @action.bound
  setDraft(activityImage) {
    this.isNew = false;
    this.image = { uri: `${Api.urls.base}${activityImage.image}` };
    this.caption = activityImage.caption;
    this.date = parse(activityImage.date);
    this.location = { name: activityImage.caption_govt };
    this.team = this.rootStore.teams.map[String(activityImage.activity.team.IDMinistry)];
    this.activity = this.rootStore.teams.getActivity(activityImage.activity.id);
    this.taggedPeople = []; // Waiting on https://github.com/appdevdesigns/adroit-mobile/issues/24
    this.uploadedImageName = undefined;
    this.uploadStatus = PostStatus.pending;
  }

  @action.bound
  updateDraft(draftProps) {
    Object.assign(this, draftProps);
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
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      onProgress: e => {
        if (e.lengthComputable) {
          runInAction(() => {
            this.uploadProgressPercent = parseInt((e.loaded / e.total) * 100, 10);
          });
        }
      },
      onLoad: response => {
        try {
          const { data } = JSON.parse(response.currentTarget.response);
          runInAction(() => {
            this.uploadedImageName = data.name;
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
      },
      onError: () => {
        Monitoring.error('Failed to upload file', { url, body });
        onUploadError();
      },
    };

    xhr(url, options);
  }

  @action.bound
  upload() {
    const url = Api.urls.createActivityImage;
    const body = new FormData();
    body.append('activity', String(this.activity.id));
    body.append('caption', this.caption);
    body.append('caption_govt', this.location);
    body.append('date', format(this.date, 'YYYY-MM-DD'));
    this.taggedPeople
      .map(person => person.IDPerson)
      .forEach(id => {
        body.append('taggedPeople', id);
      });
    body.append('image', this.uploadedImageName);
    const options = {
      method: 'POST',
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
        newActivityImage.activity = this.rootStore.teams.getActivity(newActivityImage.activity);
        runInAction(() => {
          if (newActivityImage.taggedPeople.includes(this.rootStore.users.me.id)) {
            this.map.set(newActivityImage.id, newActivityImage);
          } else {
            Monitoring.debug(
              "Authenticated user not tagged in uploaded photo so it won't be displayed in the activity feed"
            );
          }
          this.postStatus = PostStatus.succeeded;
        });
        Monitoring.event(Event.ActivityPhotoUploadSuccess);
        Toast.success(Copy.toast.activityPhotoUploadSuccess);
      })
      .catch(async error => {
        runInAction(() => {
          this.errors.push(error);
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
