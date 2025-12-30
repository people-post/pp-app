import { Fragment } from './Fragment.js';
import { ICONS } from '../../Icons.js';
import { Utilities as CommonUtilities } from '../../../../common/Utilities.js';

const _CFT_ATTACHMENT_FILE = {
  MAIN :
      `<a href="__DOWNLOAD_URL__" target="_blank" onclick="javascript:G.anchorClick()"><span class="inline-block s-icon6">__ICON__</span>__NAME__</a>`,
}

export class FAttachmentFile extends Fragment {
  constructor() {
    super();
    this._file = null;
  }

  setFile(f) { this._file = f; }

  _renderContent() {
    let s = _CFT_ATTACHMENT_FILE.MAIN;
    s = s.replace("__ICON__", CommonUtilities.renderSvgFuncIcon(ICONS.ATTACHMENT));
    s = s.replace("__DOWNLOAD_URL__", this._file.getDownloadUrl());
    s = s.replace("__NAME__", this._file.getName());
    return s;
  }
}

