(function(gui) {
gui.CF_ICON_UPLOADER = {
  ON_ICON_CHANGE : Symbol(),
};

const _CFT_ICON_UPLOADER = {
  MAIN : `
    <div class="profile-icon inline-block s-icon1 s-cprimebg">
       <img class="photo" src="__SRC__" alt="Icon" onclick="javascript:this.nextElementSibling.click()">
       <input type="file" accept="image/*" style="display:none" onchange="javascript:G.action(gui.CF_ICON_UPLOADER.ON_ICON_CHANGE, this.files[0])">
    </div>`,
};

class FIconUploader extends ui.Fragment {
  #iconUrl;
  setIconUrl(url) { this.#iconUrl = url; }

  action(type, ...args) {
    switch (type) {
    case gui.CF_ICON_UPLOADER.ON_ICON_CHANGE:
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

gui.FIconUploader = FIconUploader;
}(window.gui = window.gui || {}));
