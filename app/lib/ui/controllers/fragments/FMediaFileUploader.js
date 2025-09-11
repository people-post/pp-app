(function(ui) {
ui.CF_MEDIA_FILE_UPLOAD = {
  SET_THUMBNAIL_IMAGE : "CF_MEDIA_FILE_UPLOAD_1",
};

ui._CFT_MEDIA_FILE_UPLOAD = {
  ACTIONS :
      `<a class="button-like s-primary" href="javascript:void(0)" onclick="javascript:this.nextElementSibling.click();">Cover</a>
      <input type="file" accept="image/*" style="display:none" onchange="javascript:G.action(ui.CF_MEDIA_FILE_UPLOAD.SET_THUMBNAIL_IMAGE, this.files[0])">`,
};

class FMediaFileUploader extends ui.FFileUploader {
  constructor() {
    super();
    this._fPreview = new ui.SimpleImage();
    this.setChild("preview", this._fPreview);
  }

  onThumbnailDataLoadedInFileUploader(uploader, urlData) {
    this._fPreview.setSrc(urlData);
    this._fPreview.render()
  }

  onThumbnailUploadProgressUpdateInFileUploader(uploader, percent) {
    this._updateProgress(percent);
    if (percent == 100) {
      // Hack
      this._delegate.onMediaFileUploadFinished(this);
    }
  }

  onThumbnailUploadErrorInFileUploader(uploader, text) {
    this._fatal("Thumbnail upload", text);
    this._updateProgress(0);
  }

  action(type, ...args) {
    switch (type) {
    case ui.CF_MEDIA_FILE_UPLOAD.SET_THUMBNAIL_IMAGE:
      this.#onThumbnailChange(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _onFileUploadWillBegin() { this._delegate.onMediaFileUploadWillBegin(this); }
  _onFileUploadFinished() { this._delegate.onMediaFileUploadFinished(this); }

  _renderOnRender(render) {
    let p = new ui.ListPanel();
    p.setClassName("file-preview-block");
    render.wrapPanel(p);
    let pp = new ui.Panel();
    pp.setClassName("file-preview-icon");
    p.pushPanel(pp);
    this._fPreview.attachRender(pp);

    pp = new ui.PanelWrapper();
    p.pushPanel(pp);
    this._renderProgress(pp);

    if (!this.#isImage()) {
      // None image file only
      pp = new ui.Panel();
      p.pushPanel(pp);
      pp.replaceContent(ui._CFT_MEDIA_FILE_UPLOAD.ACTIONS);
    }

    if (this._urlFile) {
      this._fPreview.setSrc(this._urlFile.getThumbnailUrl(240));
      this._fPreview.render()
    } else {
      this._uploader.asyncReadThumbnail();
    }
  }

  #isImage() {
    return this._urlFile && this._urlFile.isImage() || this._uploader.isImage();
  }

  #onThumbnailChange(file) {
    this._delegate.onMediaFileUploadWillBegin();
    this._uploader.setThumbnailImage(file);
    this._uploader.asyncReadThumbnail(file);
  }
}

ui.FMediaFileUploader = FMediaFileUploader;
}(window.ui = window.ui || {}));
