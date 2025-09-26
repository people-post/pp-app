(function(plt) {
class Web3FileUploader extends ext.Controller {
  constructor() {
    super();
    this._file = null;
    this._cacheInfoOnServer = {
      "id" : null,
      "mimeType" : null,
      "coverId" : null
    };
    this._cacheId = null;
    this._thumbnailFile = null;
    this._isThumbnailUploading = false;
    this._isFileUploading = false;
  }

  isEmpty() { return !this._file; }
  isImage() { return this.#isImage(this._file); }
  isBusy() { return this._isThumbnailUploading || this._isFileUploading; }
  isUploaded() { return this._cacheInfoOnServer.id != null; }

  getCacheFileInfo() { return this._cacheInfoOnServer; }

  setCacheId(id) { throw "setCacheId is not supported in Web3FileUploader"; }
  setThumbnailImage(file) {
    this._thumbnailFile = file;
    this.#asyncUploadThumbnail(file);
  }

  setFile(file) {
    this._file = file;
    this._thumbnailFile = null;
    this._cacheInfoOnServer.id = null;
    this._cacheInfoOnServer.coverId = null;
    if (file) {
      this._cacheInfoOnServer.mimeType = file.type;
      this.#asyncUploadFile(file);
    }
  }

  asyncReadThumbnail() {
    if (this._thumbnailFile) {
      this.#asyncReadThumbnail(this._thumbnailFile);
    } else if (this.#isImage(this._file)) {
      this.#asyncReadThumbnail(this._file);
    }
  }

  #isImage(file) { return file && file.type.startsWith("image"); }
  #asyncReadThumbnail(file) {
    let reader = new FileReader();
    reader.onload = evt => this._delegate.onThumbnailDataLoadedInFileUploader(
        this, evt.target.result);
    reader.readAsDataURL(file);
  }

  #onUploadFileProgress(v) {
    let p = v * 95 / this._file.size;
    this._delegate.onFileUploadProgressUpdateInFileUploader(this, p);
  }

  #onUploadThumbnailProgress(v) {
    let p = v * 95 / this._thumbnailFile.size;
    this._delegate.onThumbnailUploadProgressUpdateInFileUploader(this, p);
  }

  #asyncUploadThumbnail(file) {
    this._isThumbnailUploading = true;
    let url = "/api/user/upload";
    let fd = new FormData();
    fd.append('file', file);
    fd.append('id', this._cacheId.toString() + '_cover');

    plt.Api.asyncRawPost(url, fd, r => this.#onUploadThumbnailDone(r),
                         r => this.#onUploadThumbnailError(r),
                         v => this.#onUploadThumbnailProgress(v));
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

  #asyncUploadFile(file) {
    this._isFileUploading = true;

    // TODO: plt should not depend on dba
    dba.Account.asUploadFile(file)
        .then(cid => this.#onUploadFileDone(cid))
        .finally(() => this._isFileUploading = false);
  }

  #onUploadFileError(responseText) {
    this._delegate.onFileUploadErrorInFileUploader(this, responseText);
  }

  #onUploadFileDone(cid) {
    this._cacheInfoOnServer.id = cid;
    this._delegate.onFileUploadProgressUpdateInFileUploader(this, 100);
  }
};

plt.Web3FileUploader = Web3FileUploader;
}(window.plt = window.plt || {}));
