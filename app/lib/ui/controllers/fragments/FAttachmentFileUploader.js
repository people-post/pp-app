(function(ui) {
ui.CF_ATTACHMENT_FILE_UPLOAD = {
  ADD_FILE : "CF_ATTACHMENT_FILE_UPLOAD_1",
};

ui._CFT_ATTACHMENT_FILE_UPLOAD = {
  BTN_ADD_FILE : `<label class="s-font5" for="__ID__">
    <span class="icon-legacy inline-block s-icon3">__ICON__</span>
  </label>
  <input id="__ID__" type="file" style="display:none" onchange="javascript:G.action(ui.CF_ATTACHMENT_FILE_UPLOAD.ADD_FILE, this)">`,
}

class FAttachmentFileUploader extends ui.FFileUploader {
  constructor() {
    super();
    this._fName = new ui.TextInput();
    this._fName.setConfig(
        {title : "", hint : "File name", value : "", isRequired : true});
    this.setChild("name", this._fName);
  }

  validate() {
    if (!this.#isEmpty()) {
      return this._fName.validate();
    }
    return true;
  }

  getJsonData() {
    if (this.#isEmpty()) {
      return null;
    }
    let fInfo = this._uploader.getCacheFileInfo();
    return {
      "id" : fInfo.id,
      "type" : fInfo.mimeType,
      "cover_id" : fInfo.coverId,
      "name" : this._fName.getValue()
    };
  }

  getDataForForm() {
    if (this.#isEmpty()) {
      return null;
    }
    return JSON.stringify(this.getJsonData());
  }

  action(type, ...args) {
    switch (type) {
    case ui.CF_ATTACHMENT_FILE_UPLOAD.ADD_FILE:
      this.#addFile(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _onFileUploadWillBegin() {
    this._delegate.onAttachmentFileUploadWillBegin(this);
  }
  _onFileUploadFinished() {
    this._delegate.onAttachmentFileUploadFinished(this);
  }

  _renderOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);

    let pp = new ui.Panel();
    pp.setClassName();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderAddFileButton());

    pp = new ui.Panel();
    p.pushPanel(pp);

    if (!this.#isEmpty()) {
      this._fName.attachRender(pp);
      this._fName.render();
      if (this._urlFile) {
        this._fName.setValue(this._urlFile.getName());
      }

      // Progress
      pp = new ui.PanelWrapper();
      p.pushPanel(pp);
      this._renderProgress(pp);
    }
  }

  #renderAddFileButton() {
    let s = ui._CFT_ATTACHMENT_FILE_UPLOAD.BTN_ADD_FILE;
    s = s.replace("__ICON__", Utilities.renderSvgFuncIcon(ui.ICONS.ATTACHMENT));
    s = s.replace(/__ID__/g, this._id + "-btn-label");
    return s;
  }

  #isEmpty() { return this._uploader.isEmpty() && !this._urlFile; }

  #addFile(inputNode) {
    if (inputNode.files.length) {
      this.resetToFile(inputNode.files[0]);
      this._fName.setValue(inputNode.value);
      this.render();
    }
  }
};

ui.FAttachmentFileUploader = FAttachmentFileUploader;
}(window.ui = window.ui || {}));
