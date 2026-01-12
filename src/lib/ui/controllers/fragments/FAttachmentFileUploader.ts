import { FFileUploader } from './FFileUploader.js';
import { TextInput } from './TextInput.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { Panel } from '../../renders/panels/Panel.js';
import { ICONS } from '../../Icons.js';
import { Utilities as CommonUtilities } from '../../../../common/Utilities.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';

export const CF_ATTACHMENT_FILE_UPLOAD = {
  ADD_FILE : "CF_ATTACHMENT_FILE_UPLOAD_1",
} as const;

// Export to window for string template access
declare global {
  interface Window {
    CF_ATTACHMENT_FILE_UPLOAD?: typeof CF_ATTACHMENT_FILE_UPLOAD;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_ATTACHMENT_FILE_UPLOAD = CF_ATTACHMENT_FILE_UPLOAD;
}

export const _CFT_ATTACHMENT_FILE_UPLOAD = {
  BTN_ADD_FILE : `<label class="s-font5" for="__ID__">
    <span class="icon-legacy inline-block s-icon3">__ICON__</span>
  </label>
  <input id="__ID__" type="file" style="display:none" onchange="javascript:G.action(window.CF_ATTACHMENT_FILE_UPLOAD.ADD_FILE, this)">`,
} as const;

export class FAttachmentFileUploader extends FFileUploader {
  protected _fName: TextInput;

  constructor() {
    super();
    this._fName = new TextInput();
    this._fName.setConfig(
        {title : "", hint : "File name", value : "", isRequired : true});
    this.setChild("name", this._fName);
  }

  validate(): boolean {
    if (!this.#isEmpty()) {
      return this._fName.validate();
    }
    return true;
  }

  getJsonData(): any {
    if (this.#isEmpty()) {
      return null;
    }
    let fInfo = this._uploader!.getCacheFileInfo();
    return {
      "id" : fInfo.id,
      "type" : fInfo.mimeType,
      "cover_id" : fInfo.coverId,
      "name" : this._fName.getValue()
    };
  }

  getDataForForm(): string | null {
    if (this.#isEmpty()) {
      return null;
    }
    return JSON.stringify(this.getJsonData());
  }

  action(type: string | symbol, ...args: any[]): void {
    switch (type) {
    case CF_ATTACHMENT_FILE_UPLOAD.ADD_FILE:
      this.#addFile(args[0]);
      break;
    default:
      super.action.apply(this, arguments as any);
      break;
    }
  }

  _onFileUploadWillBegin(): void {
    if (this._delegate && typeof (this._delegate as any).onAttachmentFileUploadWillBegin === 'function') {
      (this._delegate as any).onAttachmentFileUploadWillBegin(this);
    }
  }
  _onFileUploadFinished(): void {
    if (this._delegate && typeof (this._delegate as any).onAttachmentFileUploadFinished === 'function') {
      (this._delegate as any).onAttachmentFileUploadFinished(this);
    }
  }

  _renderOnRender(render: PanelWrapper): void {
    let p = new ListPanel();
    render.wrapPanel(p);

    let pp = new Panel();
    pp.setClassName("");
    p.pushPanel(pp);
    pp.replaceContent(this.#renderAddFileButton());

    pp = new Panel();
    p.pushPanel(pp);

    if (!this.#isEmpty()) {
      this._fName.attachRender(pp);
      this._fName.render();
      if (this._urlFile && typeof (this._urlFile as any).getName === 'function') {
        this._fName.setValue((this._urlFile as any).getName());
      }

      // Progress
      const pProgress = new PanelWrapper();
      p.pushPanel(pProgress);
      this._renderProgress(pProgress);
    }
  }

  #renderAddFileButton(): string {
    let s: string = _CFT_ATTACHMENT_FILE_UPLOAD.BTN_ADD_FILE;
    s = s.replace("__ICON__", CommonUtilities.renderSvgFuncIcon(ICONS.ATTACHMENT));
    s = s.replace(/__ID__/g, this._id + "-btn-label");
    return s;
  }

  #isEmpty(): boolean { return this._uploader!.isEmpty() && !this._urlFile; }

  #addFile(inputNode: HTMLInputElement): void {
    if (inputNode.files && inputNode.files.length) {
      this.resetToFile(inputNode.files[0]);
      this._fName.setValue(inputNode.value);
      this.render();
    }
  }
}

