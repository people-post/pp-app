import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export const CF_ICON_UPLOADER = {
  ON_ICON_CHANGE : Symbol(),
};

const _CFT_ICON_UPLOADER = {
  MAIN : `
    <div class="profile-icon inline-block s-icon1 s-cprimebg">
       <img class="photo" src="__SRC__" alt="Icon" onclick="javascript:this.nextElementSibling.click()">
       <input type="file" accept="image/*" style="display:none" onchange="javascript:G.action(gui.CF_ICON_UPLOADER.ON_ICON_CHANGE, this.files[0])">
    </div>`,
};

export class FIconUploader extends Fragment {
  #iconUrl;
  setIconUrl(url) { this.#iconUrl = url; }

  action(type, ...args) {
    switch (type) {
    case CF_ICON_UPLOADER.ON_ICON_CHANGE:
      this._delegate.onIconUploaderFragmentRequestUpdateIcon(this, args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let s = _CFT_ICON_UPLOADER.MAIN;
    s = s.replace("__SRC__", this.#iconUrl ? this.#iconUrl : "");
    render.replaceContent(s);
  }
};
// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  window.gui.CF_ICON_UPLOADER = CF_ICON_UPLOADER;
  window.gui.FIconUploader = FIconUploader;
}

