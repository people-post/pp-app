import { FFileUploader } from './FFileUploader.js';
import { TextInput } from './TextInput.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { Panel } from '../../renders/panels/Panel.js';
import { ICONS } from '../../Icons.js';
import { Utilities as CommonUtilities } from '../../../../common/Utilities.js';

export const CF_ATTACHMENT_FILE_UPLOAD = {
  ADD_FILE : "CF_ATTACHMENT_FILE_UPLOAD_1",
};

export const _CFT_ATTACHMENT_FILE_UPLOAD = {
  BTN_ADD_FILE : `<label class="s-font5" for="__ID__">
    <span class="icon-legacy inline-block s-icon3">__ICON__</span>
  </label>
  <input id="__ID__" type="file" style="display:none" onchange="javascript:G.action(ui.CF_ATTACHMENT_FILE_UPLOAD.ADD_FILE, this)">`,
}

export class FAttachmentFileUploader extends FFileUploader {
  constructor() {
    super();
    this._fName = new TextInput();
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
    case CF_ATTACHMENT_FILE_UPLOAD.ADD_FILE:
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
    let p = new ListPanel();
    render.wrapPanel(p);

    let pp = new Panel();
    pp.setClassName();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderAddFileButton());

    pp = new Panel();
    p.pushPanel(pp);

    if (!this.#isEmpty()) {
      this._fName.attachRender(pp);
      this._fName.render();
      if (this._urlFile) {
        this._fName.setValue(this._urlFile.getName());
      }

      // Progress
      pp = new PanelWrapper();
      p.pushPanel(pp);
      this._renderProgress(pp);
    }
  }

  #renderAddFileButton() {
    let s = _CFT_ATTACHMENT_FILE_UPLOAD.BTN_ADD_FILE;
    s = s.replace("__ICON__", CommonUtilities.renderSvgFuncIcon(ICONS.ATTACHMENT));
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

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.CF_ATTACHMENT_FILE_UPLOAD = CF_ATTACHMENT_FILE_UPLOAD;
  window.ui._CFT_ATTACHMENT_FILE_UPLOAD = _CFT_ATTACHMENT_FILE_UPLOAD;
  window.ui.FAttachmentFileUploader = FAttachmentFileUploader;
}
