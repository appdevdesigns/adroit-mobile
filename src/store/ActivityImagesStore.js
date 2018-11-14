import { observable, action, computed, runInAction, reaction } from 'mobx';
import compareDesc from 'date-fns/compare_desc';
import { Toast } from 'native-base';
import fetchJson from 'src/util/fetch';
import xhr from 'src/util/xhr';
import Api from 'src/util/api';
import { format } from 'src/util/date';
import ReportingPeriod from 'src/util/ReportingPeriod';
import Monitoring from 'src/util/Monitoring';
import ResourceStore, { PostStatus } from './ResourceStore';

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
  uploadProgressPercent = 0;

  @observable
  uploadedImageName = undefined;

  @observable
  uploadStatus = PostStatus.pending;

  @computed
  get totalReadyOrApproved() {
    return this.myActivityImages.filter(a => a.status === 'approved' || a.status === 'ready').length;
  }

  @computed
  get totalNew() {
    return this.myActivityImages.filter(a => a.status === 'new').length;
  }

  @computed
  get myActivityImages() {
    if (!this.rootStore.users.me.id) {
      return [];
    }
    return this.list.sort(sortByDate);
  }

  @action.bound
  initializeUpload() {
    this.uploadStatus = PostStatus.pending;
    this.uploadedImageName = undefined;
    this.uploadProgressPercent = 0;
  }

  @action.bound
  getMyActivityImages() {
    console.log('getMyActivityImages');
    const fullUrl = `${Api.urls.myActivityImages}?date[>]=${format(this.currentReportingPeriod.start, 'YYYY/MM/DD')}`;
    this.fetchList(fullUrl);
  }

  @action.bound
  uploadImage(image) {
    console.log('uploadImage', image);
    this.initializeUpload();
    const body = new FormData();
    body.append('imageFile', {
      uri: image.uri,
      type: 'image/jpeg',
      name: 'activityPhoto.jpeg',
    });

    const options = {
      method: 'POST',
      body,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      onProgress: e => {
        console.log('Upload progress', e);
        if (e.lengthComputable) {
          runInAction(() => {
            this.uploadProgressPercent = parseInt((e.loaded / e.total) * 100, 10);
          });
        }
      },
      onReadyStateChange: () => {
        if (xhr.readyState === 4) {
          console.log('Upload status', xhr.status === 200 ? 'success' : 'failure');
        }
      },
      onLoad: response => {
        try {
          const { data } = JSON.parse(response.currentTarget.response);
          console.log('Image upload response', data);
          runInAction(() => {
            this.uploadedImageName = data.name;
          });
        } catch (err) {
          console.log(err);
          Monitoring.captureException(err, { problem: 'Failed to parse response from image upload', response });
        }
      },
    };

    xhr(Api.urls.activityImageUpload, options);
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
    console.log('upload', body, options);

    this.uploadStatus = PostStatus.sending;
    fetchJson(url, options)
      .then(response => {
        console.log(`${url} response`, response);
        const newActivityImage = response.json.data;
        newActivityImage.activity = this.rootStore.teams.getActivity(newActivityImage.activity);
        runInAction(() => {
          this.map.set(newActivityImage.id, newActivityImage);
          this.uploadStatus = PostStatus.succeeded;
        });
        Toast.show({
          text: 'Activity photo successfully uploaded!',
          type: 'success',
          duration: 4000,
          buttonText: 'OKAY',
        });
      })
      .catch(async error => {
        runInAction(() => {
          this.errors.push(error);
          this.uploadStatus = PostStatus.failed;
        });
        console.log('FAILED', error);
        Monitoring.captureException(error, { problem: 'Failed to upload activity image', body: options.body });
        if (error.status === 401) {
          await this.onUnauthorised();
        } else {
          Toast.show({ text: 'Oops - something went wrong!', type: 'danger', buttonText: 'OKAY' });
        }
      });
  }
}
