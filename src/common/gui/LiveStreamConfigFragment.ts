import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { FMediaFileUploader } from '../../lib/ui/controllers/fragments/FMediaFileUploader.js';
import { ICONS } from '../../lib/ui/Icons.js';
import { WebConfig } from '../dba/WebConfig.js';
import { Render } from '../../lib/ui/renders/Render.js';
import { R } from '../constants/R.js';
import { Api } from '../plt/Api.js';

export const CF_LIVE_STREAM_CONFIG = {
  ADD_FILE : "CF_GUI_LIVE_STREAM_CONFIG_1",
  SHOW_TIP : "CF_GUI_LIVE_STREAM_CONFIG_2",
  REGENERATE_KEY : "CF_GUI_LIVE_STREAM_CONFIG_3",
}

const _CFT_LIVE_STREAM_CONFIG = {
  BTN_ADD_FILE :
      `<label class="s-font5" for="__ID__"><span class="icon-btn-wrapper inline-block s-icon1 clickable">__ICON__</span></label>
    <input id="__ID__" type="file" accept="image/*" style="display:none" onchange="javascript:G.action(gui.CF_LIVE_STREAM_CONFIG.ADD_FILE, this)">`,
  INSTRUCTION : `<table class="w100">
      <tbody>
        <tr>
          <td>Stream server:</td>
          <td>__RTMP_URL__</td>
          <td></td>
        </tr>
        <tr>
          <td>Stream key:</td>
          <td>__KEY__</td>
          <td><span class="button-like small s-primary" onclick="javascript:G.action(gui.CF_LIVE_STREAM_CONFIG.REGENERATE_KEY)">Regenerate</span></td>
        </tr>
      </tbody>
    </table>
    <p>Stream time limit: 1 hour.</p>
    <p>Please start streaming within 1 min after post.</p>
    <p>New to live stream? __TIP_LINK__</p>`,
}

interface CacheFileInfo {
  id: string;
  mimeType: string;
}

interface RegenerateKeyResponse {
  live_stream_key: string;
}

export class LiveStreamConfigFragment extends Fragment {
  _fFile: FMediaFileUploader | null = null;

  constructor() {
    super();
  }

  onMediaFileUploadWillBegin(fFile: FMediaFileUploader): void {}
  onMediaFileUploadFinished(fFile: FMediaFileUploader): void {}

  saveDataToForm(formData: FormData): void {
    if (this._fFile) {
      const fInfo = this._fFile.getCacheFileInfo() as CacheFileInfo | null;
      if (fInfo) {
        const info = {"id" : fInfo.id, "type" : fInfo.mimeType};
        formData.append("livestream_info", JSON.stringify(info));
      }
    }
  }

  clearFiles(): void { this._fFile = null; }

  validate(): boolean {
    if (!this._fFile) {
      this.onLocalErrorInFragment(this, R.get("EL_COVER_IMAGE_REQUIRED"));
      return false;
    }
    return true;
  }

  action(type: string, ...args: unknown[]): void {
    switch (type) {
    case CF_LIVE_STREAM_CONFIG.ADD_FILE:
      this.#addFile(args[0] as HTMLInputElement);
      break;
    case CF_LIVE_STREAM_CONFIG.SHOW_TIP:
      this._displayMessage(args[0] as string);
      break;
    case CF_LIVE_STREAM_CONFIG.REGENERATE_KEY:
      this.#onRegenerateStreamKey();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render: Render): void {
    const p = new ListPanel();
    render.wrapPanel(p);
    let pp = new SectionPanel("Cover image");
    p.pushPanel(pp);

    if (this._fFile) {
      this._fFile.attachRender(pp.getContentPanel());
      this._fFile.render();
    } else {
      pp.getContentPanel().replaceContent(this.#renderAddFileButton());
    }

    pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderInstructions());
  }

  #renderAddFileButton(): string {
    let s = _CFT_LIVE_STREAM_CONFIG.BTN_ADD_FILE;
    s = s.replace(/__ID__/g, this._id + "-add-file");
    s = s.replace("__ICON__", ICONS.CAMERA);
    return s;
  }

  #addFile(inputNode: HTMLInputElement): void {
    this._fFile = new FMediaFileUploader();
    this._fFile.setCacheId(0);
    this._fFile.setDataSource(this);
    this._fFile.setDelegate(this);
    if (inputNode.files && inputNode.files[0]) {
      this._fFile.resetToFile(inputNode.files[0]);
    }
    this.render();
  }

  #renderInstructions(): string {
    let s = _CFT_LIVE_STREAM_CONFIG.INSTRUCTION;
    s = s.replace("__RTMP_URL__", WebConfig.getRtmpUrl() || "");
    s = s.replace("__KEY__", (window.dba?.Account?.getLiveStreamKey() || "") || "");
    s = s.replace("__TIP_LINK__",
                  this._renderTipLink("gui.CF_LIVE_STREAM_CONFIG.SHOW_TIP",
                                      "how to", "TIP_LIVE_STREAM"));
    return s;
  }

  #onRegenerateStreamKey(): void {
    const url = "api/user/regenerate_live_stream_key";
    Api.asFragmentCall(this, url).then(
        (d: RegenerateKeyResponse) => this.#onRegenerateStreamKeyRRR(d));
  }

  #onRegenerateStreamKeyRRR(data: RegenerateKeyResponse): void {
    window.dba.Account.setLiveStreamKey(data.live_stream_key);
    this.render();
  }
}

