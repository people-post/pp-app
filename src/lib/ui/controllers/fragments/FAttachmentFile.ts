import { Fragment } from './Fragment.js';
import { ICONS } from '../../Icons.js';
import { Utilities as CommonUtilities } from '../../../../common/Utilities.js';

const _CFT_ATTACHMENT_FILE = {
  MAIN :
      `<a href="__DOWNLOAD_URL__" target="_blank" onclick="javascript:G.anchorClick()"><span class="inline-block s-icon6">__ICON__</span>__NAME__</a>`,
} as const;

interface FileLike {
  getDownloadUrl(): string;
  getName(): string;
}

export class FAttachmentFile extends Fragment {
  #file: FileLike | null = null;

  constructor() {
    super();
  }

  setFile(f: FileLike): void { this.#file = f; }

  _renderContent(): string {
    if (!this.#file) {
      return "";
    }
    let s = _CFT_ATTACHMENT_FILE.MAIN;
    s = s.replace("__ICON__", CommonUtilities.renderSvgFuncIcon(ICONS.ATTACHMENT));
    s = s.replace("__DOWNLOAD_URL__", this.#file.getDownloadUrl());
    s = s.replace("__NAME__", this.#file.getName());
    return s;
  }
}

