import { observable, action, computed, runInAction, reaction } from 'mobx';
import compareDesc from 'date-fns/compare_desc';
import Copy from 'src/assets/Copy';
import fetchJson from 'src/util/fetch';
import Api from 'src/util/api';
import Toast from 'src/util/Toast';
import { format } from 'src/util/date';
import ReportingPeriod from 'src/util/ReportingPeriod';
import Monitoring, { Event } from 'src/util/Monitoring';
import ResourceStore, { PostStatus } from './ResourceStore';
import FileUploadStore from './FileUploadStore';

const sortByDate = (activityA, activityB) => {
  if (!activityA && !activityB) {
    return 0;
  }
  if (!activityA) {
    return 1;
  }
  if (!activityB) {
    return -1;
  }
  const dateResult = compareDesc(activityA.date, activityB.date);
  if (dateResult === 0) {
    return compareDesc(activityA.createdAt, activityB.createdAt);
  }
  return dateResult;
};

export default class ActivityImagesStore extends ResourceStore {
  constructor(rootStore) {
    super(rootStore, 'id', true);
    this.currentReportingPeriod = new ReportingPeriod();
    this.photo = new FileUploadStore(rootStore);
    reaction(
      () => this.rootStore.auth.isLoggedIn,
      isLoggedIn => {
        if (isLoggedIn) {
          this.getMyActivityImages();
        }
      }
    );
  }

  @observable
  uploadedImageName = undefined;

  @observable
  uploadStatus = PostStatus.pending;

  @computed
  get totalReadyOrApproved() {
    const myActivityImages = this.myActivityImages;
    if (!myActivityImages) {
      return 0;
    }
    return this.myActivityImages.filter(a => a.status === 'approved' || a.status === 'ready').length;
  }

  @computed
  get totalNew() {
    const myActivityImages = this.myActivityImages;
    if (!myActivityImages) {
      return 0;
    }
    return myActivityImages.filter(a => a.status === 'new').length;
  }

  @computed
  get myActivityImages() {
    if (!this.rootStore.users.me.id) {
      return null;
    }
    return this.list.sort(sortByDate);
  }

  @action.bound
  initializeUpload() {
    this.uploadStatus = PostStatus.pending;
    this.uploadedImageName = undefined;
    this.photo.reset();
  }

  @action.bound
  getMyActivityImages() {
    const fullUrl = `${Api.urls.myActivityImages}?date[>]=${format(this.currentReportingPeriod.start, 'YYYY/MM/DD')}`;
    this.fetchList(fullUrl);
  }

  @action.bound
  uploadImage(image) {
    this.initializeUpload();
    const body = new FormData();
    body.append('imageFile', {
      uri: image.uri,
      type: 'image/jpeg',
      name: 'activityPhoto.jpeg',
    });

    this.photo.upload(Api.urls.activityImageUpload, {
      body,
      onUploadSuccess: response => {
        const { data } = JSON.parse(response);
        runInAction(() => {
          this.uploadedImageName = data.name;
        });
      },
      onUploadFailed: () => {
        Toast.danger(Copy.toast.photoUploadFailed);
      },
    });
  }

  @action.bound
  upload(activityImage) {
    const url = Api.urls.createActivityImage;
    const body = new FormData();
    body.append('activity', String(activityImage.activityId));
    body.append('caption', activityImage.caption);
    body.append('caption_govt', activityImage.location);
    body.append('date', format(activityImage.date, 'YYYY-MM-DD'));
    activityImage.taggedPeopleIds.forEach(id => {
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

    this.uploadStatus = PostStatus.sending;
    fetchJson(url, options)
      .then(response => {
        const newActivityImage = response.json.data;
        newActivityImage.activity = this.rootStore.projects.getActivity(newActivityImage.activity);
        runInAction(() => {
          if (newActivityImage.taggedPeople.includes(this.rootStore.users.me.id)) {
            this.map.set(newActivityImage.id, newActivityImage);
          } else {
            Monitoring.debug(
              "Authenticated user not tagged in uploaded photo so it won't be displayed in the activity feed"
            );
          }
          this.uploadStatus = PostStatus.succeeded;
        });
        Monitoring.event(Event.ActivityPhotoUploadSuccess);
        Toast.success(Copy.toast.activityPhotoUploadSuccess);
      })
      .catch(async error => {
        runInAction(() => {
          this.errors.push(error);
          this.uploadStatus = PostStatus.failed;
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
