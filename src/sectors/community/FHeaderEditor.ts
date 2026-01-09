export const CF_COMMUNITY_HEADER_EDITOR = {
  ON_ICON_CHANGE : "CF_COMMUNITY_HEADER_EDITOR_1",
  ON_INFO_IMAGE_CHANGE : "CF_COMMUNITY_HEADER_EDITOR_2",
} as const;

// Export to window for HTML string templates
declare global {
  interface Window {
    CF_COMMUNITY_HEADER_EDITOR?: typeof CF_COMMUNITY_HEADER_EDITOR;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_COMMUNITY_HEADER_EDITOR = CF_COMMUNITY_HEADER_EDITOR;
}

const _CFT_COMMUNITY_HEADER_EDITOR = {
  INFO_IMAGE : `<img class="overview-header" src="__BG_URL__" alt=""></img>`,
  FCN_ONCLICK : `this.nextElementSibling.click()`,
  FCN_VOID : `void(0)`,
  ICON :
      `<img class="user-info-icon s-icon2" src="__URL__" alt="Icon" onclick="javascript:__ONCLICK__">
       <input type="file" accept="image/*" style="display:none" onchange="javascript:G.action(CF_COMMUNITY_HEADER_EDITOR.ON_ICON_CHANGE, this.files[0])">`,
  INFO_IMAGE_UPLOAD :
      `<span onclick="javascript:this.nextElementSibling.click()">Upload</span>
    <input type="file" accept="image/*" style="display:none" onchange="javascript:G.action(CF_COMMUNITY_HEADER_EDITOR.ON_INFO_IMAGE_CHANGE, this.files[0])">`,
} as const;

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FileUploader } from '../../common/plt/FileUploader.js';
import { PHeaderEditor } from './PHeaderEditor.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';

interface HeaderEditorDelegate {
  onImageChangedInHeaderEditorFragment(f: FHeaderEditor): void;
}

export class FHeaderEditor extends Fragment {
  protected _iconUploader: FileUploader;
  protected _imageUploader: FileUploader;
  protected _pInfoImage: Panel | null = null;
  protected _pIcon: Panel | null = null;
  protected _imageUrl: string = "";
  protected _iconUrl: string = "";
  protected _isEditable: boolean = true;
  protected _delegate!: HeaderEditorDelegate;

  constructor() {
    super();
    this._iconUploader = new FileUploader();
    this._iconUploader.setCacheId(1);
    this._iconUploader.setDelegate(this);
    this._imageUploader = new FileUploader();
    this._imageUploader.setCacheId(2);
    this._imageUploader.setDelegate(this);
  }

  isBusy(): boolean {
    return this._iconUploader.isBusy() || this._imageUploader.isBusy();
  }
  getIconCacheFileInfo(): unknown { return this._iconUploader.getCacheFileInfo(); }
  getImageCacheFileInfo(): unknown { return this._imageUploader.getCacheFileInfo(); }

  setIconUrl(url: string): void {
    this._iconUrl = url;
    this._iconUploader.setFile(null);
  }
  setImageUrl(url: string): void {
    this._imageUrl = url;
    this._imageUploader.setFile(null);
  }
  setEnableEdit(b: boolean): void { this._isEditable = b; }

  onThumbnailDataLoadedInFileUploader(_uploader: FileUploader, _urlData: string): void {}
  onThumbnailUploadProgressUpdateInFileUploader(_uploader: FileUploader, _percent: number): void {}
  onFileUploadProgressUpdateInFileUploader(_uploader: FileUploader, percent: number): void {
    if (percent == 100) {
      this._delegate.onImageChangedInHeaderEditorFragment(this);
    }
  }
  onThumbnailUploadErrorInFileUploader(_uploader: FileUploader, _text: string): void {}
  onFileUploadErrorInFileUploader(_uploader: FileUploader, text: string): void {
    this._fatal("file upload", text);
  }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_COMMUNITY_HEADER_EDITOR.ON_ICON_CHANGE:
      this.#onUpdateIcon((args[0] as FileList)[0]);
      break;
    case CF_COMMUNITY_HEADER_EDITOR.ON_INFO_IMAGE_CHANGE:
      this.#onUpdateInfoImage((args[0] as FileList)[0]);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderOnRender(render: Panel): void {
    let p = new PHeaderEditor();
    render.wrapPanel(p);

    p.setClassName("community-overview");
    this._pInfoImage = p.getBackgroundImagePanel();
    this.#renderInfoImage(this._imageUrl);

    this._pIcon = p.getCommunityIconPanel();
    this.#renderIcon(this._iconUrl);

    if (this._isEditable) {
      let pp = p.getUploadButtonPanel();
      pp.replaceContent(_CFT_COMMUNITY_HEADER_EDITOR.INFO_IMAGE_UPLOAD);
    }
  }

  #renderIcon(urlData: string): void {
    if (!this._pIcon) {
      return;
    }

    let s = _CFT_COMMUNITY_HEADER_EDITOR.ICON;
    s = s.replace("__URL__", urlData);
    if (this._isEditable) {
      s = s.replace("__ONCLICK__", _CFT_COMMUNITY_HEADER_EDITOR.FCN_ONCLICK);
    } else {
      s = s.replace("__ONCLICK__", _CFT_COMMUNITY_HEADER_EDITOR.FCN_VOID);
    }
    this._pIcon.replaceContent(s);
  }

  #renderInfoImage(urlData: string): void {
    if (!this._pInfoImage) {
      return;
    }

    let s = _CFT_COMMUNITY_HEADER_EDITOR.INFO_IMAGE;
    s = s.replace("__BG_URL__", urlData);
    this._pInfoImage.replaceContent(s);
  }

  #onUpdateIcon(file: File): void { this._iconUploader.setFile(file); }
  #onUpdateInfoImage(file: File): void { this._imageUploader.setFile(file); }
}
