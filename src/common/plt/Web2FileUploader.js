import { FileUploader } from './FileUploader.js';
import { api } from './Api.js';

export class Web2FileUploader extends FileUploader {
  _asyncUploadThumbnail(file) {
    this._isThumbnailUploading = true;
    let url = "/api/user/upload";
    let fd = new FormData();
    fd.append('file', file);
    fd.append('id', this._cacheId.toString() + '_cover');

    api.asyncRawPost(url, fd, r => this.#onUploadThumbnailDone(r),
                         r => this.#onUploadThumbnailError(r),
                         v => this.#onUploadThumbnailProgress(v));
  }

  _asyncUploadFile(file) {
    this._isFileUploading = true;
    let url = "/api/user/upload";
    let fd = new FormData();
    fd.append('file', file);
    fd.append('id', this._cacheId.toString() + '_raw');

    api.asyncRawPost(url, fd, r => this.#onUploadFileDone(r),
                         r => this.#onUploadFileError(r),
                         v => this.#onUploadFileProgress(v));
  }

  #onUploadFileProgress(v) {
    let p = v * 95 / this._file.size;
    this._delegate.onFileUploadProgressUpdateInFileUploader(this, p);
  }

  #onUploadThumbnailProgress(v) {
    let p = v * 95 / this._thumbnailFile.size;
    this._delegate.onThumbnailUploadProgressUpdateInFileUploader(this, p);
  }

  #onUploadThumbnailDone(responseText) {
    this._isThumbnailUploading = false;
    let response = JSON.parse(responseText);
    if (response.error) {
      this.#onUploadThumbnailError();
    } else {
      this._cacheInfoOnServer.coverId = response.data.id;
      this._delegate.onThumbnailUploadProgressUpdateInFileUploader(this, 100);
    }
  }

  #onUploadThumbnailError(responseText) {
    this._isThumbnailUploading = false;
    this._delegate.onThumbnailUploadErrorInFileUploader(this, responseText);
  }

  #onUploadFileError(responseText) {
    this._isFileUploading = false;
    this._delegate.onFileUploadErrorInFileUploader(this, responseText);
  }

  #onUploadFileDone(responseText) {
    this._isFileUploading = false;
    let response = JSON.parse(responseText);
    if (response.error) {
      this._delegate.onFileUploadErrorInFileUploader(this, responseText);
      this.#onUploadFileProgress(0);
    } else {
      this._cacheInfoOnServer.id = response.data.id;
      this._delegate.onFileUploadProgressUpdateInFileUploader(this, 100);
    }
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.plt = window.plt || {};
  window.plt.Web2FileUploader = Web2FileUploader;
}
