import { Fragment } from './Fragment.js';
import { ICONS } from '../../Icons.js';
import { Utilities as CommonUtilities } from '../../../../common/Utilities.js';
import { RemoteFile } from '../../../../common/datatypes/RemoteFile.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';

const _CFT_ATTACHMENT_FILE = {
  MAIN :
      `<a href="__DOWNLOAD_URL__" target="_blank" onclick="javascript:G.anchorClick()"><span class="tw-inline-block tw-w-s-icon6 tw-h-s-icon6">__ICON__</span>__NAME__</a>`,
} as const;

export class FAttachmentFile extends Fragment {
  #file: RemoteFile | undefined = undefined;

  constructor() {
    super();
  }

  setFile(f: RemoteFile | undefined): void { this.#file = f; }

  _renderOnRender(render: PanelWrapper): void {
    if (!this.#file) {
      return;
    }
    let s: string = _CFT_ATTACHMENT_FILE.MAIN;
    s = s.replace("__ICON__", CommonUtilities.renderSvgFuncIcon(ICONS.ATTACHMENT) as string);
    s = s.replace("__DOWNLOAD_URL__", this.#file.getDownloadUrl() || "");
    s = s.replace("__NAME__", this.#file.getName() || "");
    render.replaceContent(s);
  }
}

