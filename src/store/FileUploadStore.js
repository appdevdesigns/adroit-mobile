import { observable, action, runInAction } from 'mobx';
import xhr from 'src/util/xhr';
import Monitoring from 'src/util/Monitoring';

export const UploadStatus = {
  pending: 'pending',
  uploading: 'uploading',
  succeeded: 'succeeded',
  failed: 'failed',
};

export default class FileUploadStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable
  uploadProgressPercent = 0;

  @observable
  status = UploadStatus.pending;

  @action.bound
  reset() {
    this.status = UploadStatus.pending;
    this.uploadProgressPercent = 0;
  }

  @action.bound
  upload = (url, uploadOptions) => {
    console.log('File upload', uploadOptions.body);
    this.status = UploadStatus.uploading;
    this.uploadProgressPercent = 0;

    const options = {
      method: 'POST',
      body: uploadOptions.body,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      onProgress: e => {
        console.log('File upload progress', e);
        if (e.lengthComputable) {
          runInAction(() => {
            this.uploadProgressPercent = parseInt((e.loaded / e.total) * 100, 10);
          });
        }
      },
      // onReadyStateChange: () => {
      //   if (xhr.readyState === 4) {
      //     console.log('Upload status', xhr.status === 200 ? 'success' : 'failure');
      //   }
      // },
      onLoad: response => {
        try {
          console.log('File upload response', response.currentTarget.response);
          if (uploadOptions.onUploadSuccess) {
            uploadOptions.onUploadSuccess(response.currentTarget.response);
          }
          runInAction(() => {
            this.status = UploadStatus.succeeded;
          });
        } catch (error) {
          console.log(error);
          Monitoring.exception(error, {
            problem: 'Failed to parse response from file upload',
            response: response.currentTarget.response,
            url,
            body: uploadOptions.body,
          });
          if (uploadOptions.onUploadFailed) {
            uploadOptions.onUploadFailed();
          }
          runInAction(() => {
            this.status = UploadStatus.failed;
          });
        }
      },
      onError: () => {
        console.log('Failed to upload file', url, uploadOptions.body);
        Monitoring.error('Failed to upload file', { url, body: uploadOptions.body });
        if (uploadOptions.onUploadFailed) {
          uploadOptions.onUploadFailed();
        }
        runInAction(() => {
          this.status = UploadStatus.failed;
        });
      },
    };

    xhr(url, options);
  };
}
