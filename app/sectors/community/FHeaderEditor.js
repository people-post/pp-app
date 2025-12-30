
window.CF_COMMUNITY_HEADER_EDITOR = {
  ON_ICON_CHANGE : "CF_COMMUNITY_HEADER_EDITOR_1",
  ON_INFO_IMAGE_CHANGE : "CF_COMMUNITY_HEADER_EDITOR_2",
};

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
};

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export class FHeaderEditor extends Fragment {
  constructor() {
    super();
    this._iconUploader = new plt.FileUploader();
    this._iconUploader.setCacheId(1);
    this._iconUploader.setDelegate(this);
    this._imageUploader = new plt.FileUploader();
    this._imageUploader.setCacheId(2);
    this._imageUploader.setDelegate(this);

    this._pInfoImage = null;
    this._pIcon = null;

    this._imageUrl = "";
    this._iconUrl = "";

    this._isEditable = true;
  }

  isBusy() {
    return this._iconUploader.isBusy() && this._imageUploader.isBusy();
  }
  getIconCacheFileInfo() { return this._iconUploader.getCacheFileInfo(); }
  getImageCacheFileInfo() { return this._imageUploader.getCacheFileInfo(); }

  setIconUrl(url) {
    this._iconUrl = url;
    this._iconUploader.setFile(null);
  }
  setImageUrl(url) {
    this._imageUrl = url;
    this._imageUploader.setFile(null);
  }
  setEnableEdit(b) { this._isEditable = b; }

  onThumbnailDataLoadedInFileUploader(uploader, urlData) {}
  onThumbnailUploadProgressUpdateInFileUploader(uploader, percent) {}
  onFileUploadProgressUpdateInFileUploader(uploader, percent) {
    if (percent == 100) {
      this._delegate.onImageChangedInHeaderEditorFragment(this);
    }
  }
  onThumbnailUploadErrorInFileUploader(uploader, text) {}
  onFileUploadErrorInFileUploader(uploader, text) {
    this._fatal("file upload", text);
  }

  action(type, ...args) {
    switch (type) {
    case CF_COMMUNITY_HEADER_EDITOR.ON_ICON_CHANGE:
      this.#onUpdateIcon(args[0]);
      break;
    case CF_COMMUNITY_HEADER_EDITOR.ON_INFO_IMAGE_CHANGE:
      this.#onUpdateInfoImage(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let p = new cmut.PHeaderEditor();
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

  #renderIcon(urlData) {
    let s = _CFT_COMMUNITY_HEADER_EDITOR.ICON;
    s = s.replace("__URL__", urlData);
    if (this._isEditable) {
      s = s.replace("__ONCLICK__", _CFT_COMMUNITY_HEADER_EDITOR.FCN_ONCLICK);
    } else {
      s = s.replace("__ONCLICK__", _CFT_COMMUNITY_HEADER_EDITOR.FCN_VOID);
    }
    this._pIcon.replaceContent(s);
  }

  #renderInfoImage(urlData) {
    let s = _CFT_COMMUNITY_HEADER_EDITOR.INFO_IMAGE;
    s = s.replace("__BG_URL__", urlData);
    this._pInfoImage.replaceContent(s);
  }

  #onUpdateIcon(file) { this._iconUploader.setFile(file); }
  #onUpdateInfoImage(file) { this._imageUploader.setFile(file); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.cmut = window.cmut || {};
  window.cmut.FHeaderEditor = FHeaderEditor;
}
