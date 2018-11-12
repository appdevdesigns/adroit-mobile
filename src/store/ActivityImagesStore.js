import { observable, action, computed, runInAction, reaction } from 'mobx';
import reduce from 'lodash-es/reduce';
import compareDesc from 'date-fns/compare_desc';
import { Toast } from 'native-base';
import fetchJson from 'src/util/fetch';
import xhr from 'src/util/xhr';
import Api from 'src/util/api';
import { format } from 'src/util/date';
import ReportingPeriod from 'src/util/ReportingPeriod';
import ResourceStore from './ResourceStore';

const statusOrder = {
  ready: 0,
  approved: 1,
  rejected: 2,
  new: 3,
};

const sortByStatus = (activityA, activityB) => {
  if (!activityA && !activityB) {
    return 0;
  }
  if (!activityA) {
    return 1;
  }
  if (!activityB) {
    return -1;
  }
  return statusOrder[activityA.title] < statusOrder[activityB.title] ? -1 : 1;
};

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
    super(rootStore, 'id');
    this.currentReportingPeriod = new ReportingPeriod();
    reaction(
      () => this.rootStore.auth.isLoggedIn,
      isLoggedIn => {
        if (isLoggedIn) {
          this.getMyActivityImages();
        } else {
          this.clear();
        }
      }
    );
  }

  @observable
  uploadProgressPercent = 0;

  @observable
  uploadedImageName = undefined;

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

  @computed
  get myActivityImagesByStatus() {
    const activitiesByStatus = reduce(
      this.myActivityImages,
      (acc, val) => {
        let section = acc.find(s => s.title === val.status);
        if (!section) {
          section = { title: val.status, data: [] };
          acc.push(section);
        }
        section.data.push(val);
        return acc;
      },
      []
    );
    return activitiesByStatus.sort(sortByStatus);
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
    this.uploadProgressPercent = 0;
    this.uploadedImageName = undefined;
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

    this.fetchCount += 1;
    fetchJson(url, options)
      .then(response => {
        console.log(`${url} response`, response);
        const newActivityImage = response.json.data;
        newActivityImage.activity = this.rootStore.teams.getActivity(newActivityImage.activity);
        runInAction(() => {
          this.map.set(newActivityImage.id, newActivityImage);
          this.uploadedImageName = undefined;
          this.uploadProgressPercent = 0;
          this.fetchCount = Math.max(this.fetchCount - 1, 0);
        });
      })
      .catch(async error => {
        runInAction(() => {
          this.errors.push(error);
          this.fetchCount = Math.max(this.fetchCount - 1, 0);
        });
        console.log('FAILED', error);
        Toast.show({ text: error.message, type: 'danger', buttonText: 'OKAY' });
        if (error.status === 401) {
          await this.onUnauthorised();
        }
      });
  }
}
