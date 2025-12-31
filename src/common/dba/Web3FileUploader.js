import { FileUploader } from '../plt/FileUploader.js';
import { api } from '../plt/Api.js';
import { Account } from './Account.js';

export class Web3FileUploader extends FileUploader {
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

    // TODO: there is no progress track in fetch api, need to find p2p version
    // of XMLHttpRequest similar to p2pFetch
    Account.asUploadFile(file)
        .then(cid => this.#onUploadFileDone(cid))
        .finally(() => this._isFileUploading = false);
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
    this._delegate.onFileUploadErrorInFileUploader(this, responseText);
  }

  #onUploadFileDone(cid) {
    this._cacheInfoOnServer.id = cid;
    this._delegate.onFileUploadProgressUpdateInFileUploader(this, 100);
  }
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.dba = window.dba || {};
  window.dba.Web3FileUploader = Web3FileUploader;
}
