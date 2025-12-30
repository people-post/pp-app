export class FileUploader extends ext.Controller {
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

  setCacheId(id) { this._cacheId = id; }
  setThumbnailImage(file) {
    this._thumbnailFile = file;
    this._asyncUploadThumbnail(file);
  }

  setFile(file) {
    this._file = file;
    this._thumbnailFile = null;
    this._cacheInfoOnServer.id = null;
    this._cacheInfoOnServer.coverId = null;
    if (file) {
      this._cacheInfoOnServer.mimeType = file.type;
      this._asyncUploadFile(file);
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

  _asyncUploadThumbnail(file) {}

  _asyncUploadFile(file) {}
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.plt = window.plt || {};
  window.plt.FileUploader = FileUploader;
}
