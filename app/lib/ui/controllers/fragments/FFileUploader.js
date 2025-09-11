(function(ui) {
class FFileUploader extends ui.Fragment {
  constructor() {
    super();
    this._fProgress = new ui.SimpleProgress();
    this.setChild("progress", this._fProgress);

    this._uploader = null;
    this._urlFile = null;
  }

  isBusy() { return this.#getOrInitUploader().isBusy(); }
  getCacheFileInfo() { return this.#getOrInitUploader().getCacheFileInfo(); }

  onThumbnailDataLoadedInFileUploader(uploader, urlData) {}
  onThumbnailUploadProgressUpdateInFileUploader(uploader, percent) {}
  onThumbnailUploadErrorInFileUploader(uploader, text) {}

  onFileUploadProgressUpdateInFileUploader(uploader, percent) {
    this._updateProgress(percent);
    if (percent == 100) {
      this._onFileUploadFinished();
    }
  }

  onFileUploadErrorInFileUploader(uploader, text) {
    this._fatal("file upload", text);
    this._updateProgress(0);
  }

  setCacheId(id) { this.#getOrInitUploader().setCacheId(id); }

  resetToFile(file, name = null) {
    this._urlFile = null;
    this._onFileUploadWillBegin();
    this.#getOrInitUploader().setFile(file);
  }

  resetToUrlFile(urlFile) {
    this._urlFile = urlFile;
    this.#getOrInitUploader().setFile(null);
  }

  _onFileUploadWillBegin() {}
  _onFileUploadFinished() {}

  _updateProgress(v) {
    this._fProgress.setValue(v);
    this._fProgress.render();
  }

  _renderProgress(panel) {
    if (this._urlFile || this.#getOrInitUploader().isUploaded()) {
      this._fProgress.setValue(100);
    } else {
      this._fProgress.setValue(0);
    }
    this._fProgress.attachRender(panel);
    this._fProgress.render();
  }

  #getOrInitUploader() {
    if (!this._uploader) {
      let cls =
          fwk.Factory.getClass(fwk.T_CATEGORY.UI, fwk.T_OBJ.FILE_UPLOADER);
      this._uploader = new cls();
      this._uploader.setDelegate(this);
    }
    return this._uploader;
  }
}

ui.FFileUploader = FFileUploader;
}(window.ui = window.ui || {}));
