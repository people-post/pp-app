import { Fragment } from './Fragment.js';
import { FMediaFileUploader } from './FMediaFileUploader.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { Panel } from '../../renders/panels/Panel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';
import { ICONS } from '../../Icons.js';

export const CF_MULTI_MEDIA_FILE_UPLOAD = {
  ADD_FILES : "CF_MULTI_MEDIA_FILE_UPLOAD_1",
} as const;

// Export to window for string template access
declare global {
  interface Window {
    CF_MULTI_MEDIA_FILE_UPLOAD?: typeof CF_MULTI_MEDIA_FILE_UPLOAD;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_MULTI_MEDIA_FILE_UPLOAD = CF_MULTI_MEDIA_FILE_UPLOAD;
}

export const _CFT_MULTI_MEDIA_FILE_UPLOAD = {
  BTN_ADD_FILE : `<label class="s-font5" for="__ID__">
      <span class="icon-btn-wrapper inline-block s-icon1 clickable">__ICON__</span>
    </label>
    <input id="__ID__" multiple="" type="file" accept="image/*,video/*" style="display:none" onchange="javascript:G.action(window.CF_MULTI_MEDIA_FILE_UPLOAD.ADD_FILES, this)">`,
} as const;

export class FMultiMediaFileUploader extends Fragment {
  private _cacheIds: string[] = [];
  private _fFiles: FMediaFileUploader[] = [];

  constructor() {
    super();
    this._cacheIds = [];
    this._fFiles = [];
  }

  isBusy(): boolean { return this._fFiles.some(f => f.isBusy()); }

  onMediaFileUploadWillBegin(_fFile: FMediaFileUploader): void {
    if (this._delegate && typeof (this._delegate as any).onMultiMediaFileUploadWillBegin === 'function') {
      (this._delegate as any).onMultiMediaFileUploadWillBegin(this);
    }
  }
  onMediaFileUploadFinished(_fFile: FMediaFileUploader): void {
    if (!this.isBusy()) {
      if (this._delegate && typeof (this._delegate as any).onMultiMediaFileUploadFinished === 'function') {
        (this._delegate as any).onMultiMediaFileUploadFinished(this);
      }
    }
  }

  setCacheIds(ids: string[]): void { this._cacheIds = ids; }

  setToHrefFiles(hrefFiles: any[]): void {
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

  saveDataToForm(formData: FormData): void {
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

  validate(): boolean { return true; }

  action(type: string | symbol, ...args: any[]): void {
    switch (type) {
    case CF_MULTI_MEDIA_FILE_UPLOAD.ADD_FILES:
      this.#addFiles(args[0]);
      break;
    default:
      super.action.apply(this, arguments as any);
      break;
    }
  }

  _getAllChildControllers(): Fragment[] {
    let cs: Fragment[] = [];
    cs.push(...super._getAllChildControllers() as Fragment[]);
    cs.push(...this._fFiles);
    return cs;
  }

  _renderOnRender(render: any): void {
    let p = new ListPanel();
    render.wrapPanel(p);

    let pp: Panel | PanelWrapper;
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

  #renderAddFileButton(): string {
    let s: string = _CFT_MULTI_MEDIA_FILE_UPLOAD.BTN_ADD_FILE;
    s = s.replace("__ICON__", ICONS.CAMERA);
    s = s.replace(/__ID__/g, this._id + "-btn-label");
    return s;
  }

  #clear(): void { this._fFiles = []; }

  #addFiles(inputNode: HTMLInputElement): void {
    this.#clear();
    if (inputNode.files) {
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
    }

    this.render();
  }
}

