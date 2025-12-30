import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { FMediaFileUploader } from '../../lib/ui/controllers/fragments/FMediaFileUploader.js';
import { ICONS } from '../../lib/ui/Icons.js';

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

export class LiveStreamConfigFragment extends Fragment {
  constructor() {
    super();
    this._fFile = null;
  }

  onMediaFileUploadWillBegin(fFile) {}
  onMediaFileUploadFinished(fFile) {}

  saveDataToForm(formData) {
    if (this._fFile) {
      let fInfo = this._fFile.getCacheFileInfo();
      let info = {"id" : fInfo.id, "type" : fInfo.mimeType};
      formData.append("livestream_info", JSON.stringify(info));
    }
  }

  clearFiles() { this._fFile = null; }

  validate() {
    if (!this._fFile) {
      this.onLocalErrorInFragment(this, R.get("EL_COVER_IMAGE_REQUIRED"));
      return false;
    }
    return true;
  }

  action(type, ...args) {
    switch (type) {
    case CF_LIVE_STREAM_CONFIG.ADD_FILE:
      this.#addFile(args[0]);
      break;
    case CF_LIVE_STREAM_CONFIG.SHOW_TIP:
      this._displayMessage(args[0]);
      break;
    case CF_LIVE_STREAM_CONFIG.REGENERATE_KEY:
      this.#onRegenerateStreamKey();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let p = new ListPanel();
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

  #renderAddFileButton() {
    let s = _CFT_LIVE_STREAM_CONFIG.BTN_ADD_FILE
    s = s.replace(/__ID__/g, this._id + "-add-file");
    s = s.replace("__ICON__", ICONS.CAMERA);
    return s;
  }

  #addFile(inputNode) {
    this._fFile = new FMediaFileUploader();
    this._fFile.setCacheId(0);
    this._fFile.setDataSource(this);
    this._fFile.setDelegate(this);
    this._fFile.resetToFile(inputNode.files[0]);
    this.render();
  }

  #renderInstructions() {
    let s = _CFT_LIVE_STREAM_CONFIG.INSTRUCTION;
    s = s.replace("__RTMP_URL__", dba.WebConfig.getRtmpUrl());
    s = s.replace("__KEY__", dba.Account.getLiveStreamKey());
    s = s.replace("__TIP_LINK__",
                  this._renderTipLink("gui.CF_LIVE_STREAM_CONFIG.SHOW_TIP",
                                      "how to", "TIP_LIVE_STREAM"));
    return s;
  }

  #onRegenerateStreamKey() {
    let url = "api/user/regenerate_live_stream_key";
    plt.Api.asyncFragmentCall(this, url).then(
        d => this.#onRegenerateStreamKeyRRR(d));
  }

  #onRegenerateStreamKeyRRR(data) {
    dba.Account.setLiveStreamKey(data.live_stream_key);
    this.render();
  }
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  window.gui.CF_LIVE_STREAM_CONFIG = CF_LIVE_STREAM_CONFIG;
  window.gui.LiveStreamConfigFragment = LiveStreamConfigFragment;
}
