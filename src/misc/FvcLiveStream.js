import { FScrollViewContent } from '../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ButtonGroup } from '../lib/ui/controllers/fragments/ButtonGroup.js';
import { HintText } from '../lib/ui/controllers/fragments/HintText.js';
import { VIS } from '../common/constants/Constants.js';

window.C_LIVE_STREAM = {
  START_RECORD : "C_LIVE_STREAM_1",
  STOP_RECORD : "C_LIVE_STREAM_2",
  TOGGLE_VIDEO : "C_LIVE_STREAM_3",
  START_PREVIEW : "C_LIVE_STREAM_4",
  STOP_PREVIEW : "C_LIVE_STREAM_5",
}

const _CVT_LIVE_STREAM = {
  MAIN : `<div>
      <div class="textarea-wrapper">
        <label class="s-font5" for="ID_TITLE">Title:</label>
        <br>
        <textarea id="ID_TITLE" class="livestream-title"></textarea>
      </div>
      <br>
      <p class="title">Visibility:</p>
      <div id="ID_VISIBILITY">__VISIBILITY__</div>
      <div>
        <span>Video:</span>
        <label class="switch s-font5">
            <input type="checkbox" checked onclick="javascript:G.action(C_LIVE_STREAM.TOGGLE_VIDEO, this.checked)">
            <span class="slider"></span>
        </label>
      </div>
      <h2>Preview</h2>
      <video id="ID_PREVIEW" width="160" height="120" playsinline autoplay muted></video>
      <div id="ID_ACTION_BUTTONS">
        __ACTION_BUTTONS__
      </div>
      <br>
    </div>`,
  BTN_START_PREVIEW :
      `<a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(C_LIVE_STREAM.START_PREVIEW)">Start Preview</a>`,
  BTN_START :
      `<a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(C_LIVE_STREAM.START_RECORD)">Start</a>`,
  BTN_STOP :
      `<a class="button-bar danger" href="javascript:void(0)" onclick="javascript:G.action(C_LIVE_STREAM.STOP_RECORD)">Stop</a>`,
  BTN_STOP_PREVIEW :
      `<a class="button-bar danger" href="javascript:void(0)" onclick="javascript:G.action(C_LIVE_STREAM.STOP_PREVIEW)">Stop Preview</a>`,
}

class FvcLiveStream extends FScrollViewContent {
  #nUploading = 0;
  #nUploadError = 0;

  constructor(dataSource) {
    super();
    this._dataSource = dataSource;
    this._recorder = null;
    this._stream = null;
    this._mediaOption = {video : true, audio : true};
    // TODO: Use fragment based view
    this._visView = new ButtonGroup();
    this._visView.setDelegate(this);
    this._visView.addChoice({
      name : "Public",
      value : VIS.PUBLIC,
      fDetail : new HintText("Visible to all.")
    });
    this._visView.addChoice({
      name : "Protected",
      value : VIS.PROTECTED,
      fDetail : new HintText("Visible to friends only.")
    });
    this._visView.addChoice({
      name : "Private",
      value : VIS.PRIVATE,
      fDetail : new HintText("Only visible to yourself.")
    });
  }

  onButtonGroupSelectionChanged(fButtonGroup, value) {}

  action(type, ...args) {
    switch (type) {
    case C_LIVE_STREAM.START_PREVIEW:
      this.#onStartPreview();
      break;
    case C_LIVE_STREAM.START_RECORD:
      this.#onStartLive();
      break;
    case C_LIVE_STREAM.STOP_RECORD:
      this.#stopRecording();
      break;
    case C_LIVE_STREAM.STOP_PREVIEW:
      this.#stopPreview();
      break;
    case C_LIVE_STREAM.TOGGLE_VIDEO:
      this.#onVideoToggled(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContentOnRender(render) {
    let s = _CVT_LIVE_STREAM.MAIN;
    s = s.replace("__ACTION_BUTTONS__", _CVT_LIVE_STREAM.BTN_START_PREVIEW);
    s = s.replace("__VISIBILITY__", this._visView.render());
    render.replaceContent(s);
  }

  #setActionButtons(btns) {
    let e = document.getElementById("ID_ACTION_BUTTONS");
    if (e) {
      e.innerHTML = btns.join("<br>");
    }
  }

  #onVideoToggled(checked) { this._mediaOption.video = checked; }

  #onStartPreview() {
    let d = this;
    let devices = navigator.mediaDevices;
    if (devices) {
      devices.getUserMedia(this._mediaOption)
          .then(stream => d.#setPreview(stream))
          .then(() => d.#onPreviewReady())
          .catch(err => d.#onPreviewError(err));
    } else {
      this._owner.onLocalErrorInFragment(this, R.get("EL_GET_DEVICE"));
    }
  }

  #setPreview(stream) {
    this._stream = stream;
    let ePreview = document.getElementById("ID_PREVIEW");
    ePreview.srcObject = stream;
    return new Promise(resolve => ePreview.onplaying = resolve);
  }

  #onPreviewReady() {
    this.#setActionButtons(
        [ _CVT_LIVE_STREAM.BTN_START, _CVT_LIVE_STREAM.BTN_STOP_PREVIEW ]);
  }

  #onPreviewError(err) {
    switch (err.name) {
    case "NotAllowedError":
      this._owner.onLocalErrorInFragment(this, R.get("EL_ACCESS_DEVICE"));
      break;
    case "NotFoundError":
      this._owner.onLocalErrorInFragment(this, R.get("EL_NO_DEVICE"));
      break;
    default:
      console.log(err);
      break;
    }
    this.#stopPreview();
  }

  #onStartLive() {
    if (this._recorder) {
      return;
    }
    this.#asyncStartLive();
  }

  #onRemoveServerReady() {
    this.#setActionButtons([ _CVT_LIVE_STREAM.BTN_STOP ]);
    this.#startRecording();
  }

  #startRecording() {
    this.#nUploading = 0;
    this.#nUploadError = 0;
    let recorder = new MediaRecorder(this._stream);
    recorder.ondataavailable = event => this.#onStreamDataAvailable(event.data);
    recorder.start(500);
    recorder.onerror = event => this.#onRecordError(event);
    this._recorder = recorder;
  }

  #onStreamDataAvailable(data) { this.#asyncSendLiveData(data); }

  #onRecordError(evt) {
    switch (err.name) {
    case "NotAllowedError":
      this._owner.onLocalErrorInFragment(this, R.get("EL_ACCESS_DEVICE"));
      break;
    case "NotFoundError":
      this._owner.onLocalErrorInFragment(this, R.get("EL_NO_DEVICE"));
      break;
    default:
      console.log(err);
      break;
    }
    this.#stopRecording();
  }

  #stopRecording() {
    if (this._recorder) {
      this._recorder.stop();
      this._recorder = null;
    }
    this.#asyncStopLive();
  }

  #onRemoveServerStopped() {
    this.#setActionButtons([ _CVT_LIVE_STREAM.BTN_STOP_PREVIEW ]);
  }

  #stopPreview() {
    if (this._stream) {
      this._stream.getTracks().forEach(track => track.stop());
      this._stream = null;
    }
    this.#setActionButtons([ _CVT_LIVE_STREAM.BTN_START_PREVIEW ]);
  }

  #asyncStartLive() {
    let url = "/api/blog/start_live";
    let fd = new FormData();
    let e = document.getElementById("ID_TITLE");
    fd.append("title", e.value);
    fd.append("visibility", this._visView.getValue());
    api.asyncFragmentPost(this, url, fd)
        .then(d => { this.#onStartLiveRRR(d); });
  }

  #onStartLiveRRR(responseText) { this.#onRemoveServerReady(); }

  #asyncSendLiveData(data) {
    if (this.#nUploading > 10) {
      console.log("Too many in queue, dropped data.");
      this.#nUploadError++;
      return;
    }
    // let recordedBlob = new Blob([ data ], {type : "video/webm"});
    let url = "/api/blog/live_data";
    this.#nUploading++;
    api.asyncPost(url, data)
        .then(d => this.#onSendDataRRR(d), e => this.#onSendDataError(e))
        .finally(() => this.#onSendDataDone());
  }

  #onSendDataRRR(data) { this.#nUploadError = 0; }

  #onSendDataError(e) {
    this.#nUploadError++;
    if (this.#nUploadError > 10) {
      this._owner.onLocalErrorInFragment(this, R.get("EL_CONNECTION_LOST"));
    }
  }

  #onSendDataDone() { this.#nUploading--; }

  #asyncStopLive() {
    let url = "/api/blog/stop_live";
    api.asyncFragmentCall(this, url).then(d => { this.#onStopLiveRRR(d); });
  }

  #onStopLiveRRR(data) { this.#onRemoveServerStopped(); }
}
