(function(ui) {
const _CFT_ATTACHMENT_FILE = {
  MAIN :
      `<a href="__DOWNLOAD_URL__" target="_blank" onclick="javascript:G.anchorClick()"><span class="inline-block s-icon6">__ICON__</span>__NAME__</a>`,
}

class FAttachmentFile extends ui.Fragment {
  constructor() {
    super();
    this._file = null;
  }

  setFile(f) { this._file = f; }

  _renderContent() {
    let s = _CFT_ATTACHMENT_FILE.MAIN;
    s = s.replace("__ICON__", Utilities.renderSvgFuncIcon(ui.ICONS.ATTACHMENT));
    s = s.replace("__DOWNLOAD_URL__", this._file.getDownloadUrl());
    s = s.replace("__NAME__", this._file.getName());
    return s;
  }
}

ui.FAttachmentFile = FAttachmentFile;
}(window.ui = window.ui || {}));
