import { Fragment } from './Fragment.js';
import { FMediaFileUploader } from './FMediaFileUploader.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { Panel } from '../../renders/panels/Panel.js';
import { ICONS } from '../../Icons.js';
import { Utilities as CommonUtilities } from '../../../../common/Utilities.js';

export const CF_MULTI_MEDIA_FILE_UPLOAD = {
  ADD_FILES : "CF_MULTI_MEDIA_FILE_UPLOAD_1",
};

export const _CFT_MULTI_MEDIA_FILE_UPLOAD = {
  BTN_ADD_FILE : `<label class="s-font5" for="__ID__">
      <span class="icon-btn-wrapper inline-block s-icon1 clickable">__ICON__</span>
    </label>
    <input id="__ID__" multiple="" type="file" accept="image/*,video/*" style="display:none" onchange="javascript:G.action(window.CF_MULTI_MEDIA_FILE_UPLOAD.ADD_FILES, this)">`,
};

export class FMultiMediaFileUploader extends Fragment {
  constructor() {
    super();
    this._cacheIds = [];
    this._fFiles = [];
  }

  isBusy() { return this._fFiles.some(f => f.isBusy()); }

  onMediaFileUploadWillBegin(fFile) {
    this._delegate.onMultiMediaFileUploadWillBegin(this);
  }
  onMediaFileUploadFinished(fFile) {
    if (!this.isBusy()) {
      this._delegate.onMultiMediaFileUploadFinished(this);
    }
  }

  setCacheIds(ids) { this._cacheIds = ids; }

  setToHrefFiles(hrefFiles) {
    this.#clear();
    for (let [i, rf] of hrefFiles.entries()) {
      if (i < this._cacheIds.length) {
        let f = new FMediaFileUploader();
        f.setCacheId(this._cacheIds[i]);
        f.setDataSource(this);
        f.setDelegate(this);
        f.resetToUrlFile(rf);
        this._fFiles.push(f);
      }
    }
  }

  saveDataToForm(formData) {
    for (let f of this._fFiles) {
      let fInfo = f.getCacheFileInfo();
      let info = {
        "id" : fInfo.id,
        "type" : fInfo.mimeType,
        "cover_id" : fInfo.coverId
      };
      formData.append("file_infos", JSON.stringify(info));
    }
  }

  validate() { return true; }

  action(type, ...args) {
    switch (type) {
    case CF_MULTI_MEDIA_FILE_UPLOAD.ADD_FILES:
      this.#addFiles(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _getAllChildControllers() {
    let cs = [];
    cs.push(...super._getAllChildControllers());
    cs.push(...this._fFiles);
    return cs;
  }

  _renderOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);

    let pp;
    for (let f of this._fFiles) {
      pp = new PanelWrapper();
      pp.setClassName("inline-block");
      p.pushPanel(pp);
      f.attachRender(pp);
      f.render();
    }

    pp = new Panel();
    pp.setClassName("inline-block");
    p.pushPanel(pp);
    pp.replaceContent(this.#renderAddFileButton());
  }

  #renderAddFileButton() {
    let s = _CFT_MULTI_MEDIA_FILE_UPLOAD.BTN_ADD_FILE;
    s = s.replace("__ICON__", ICONS.CAMERA);
    s = s.replace(/__ID__/g, this._id + "-btn-label");
    return s;
  }

  #clear() { this._fFiles = []; }

  #addFiles(inputNode) {
    this.#clear();
    for (let i = 0; i < inputNode.files.length; ++i) {
      if (i < this._cacheIds.length) {
        let f = new FMediaFileUploader();
        f.setCacheId(this._cacheIds[i]);
        f.setDataSource(this);
        f.setDelegate(this);
        f.resetToFile(inputNode.files[i]);
        this._fFiles.push(f);
      }
    }

    this.render();
  }
}
