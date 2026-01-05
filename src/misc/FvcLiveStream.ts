import { FScrollViewContent } from '../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ButtonGroup } from '../lib/ui/controllers/fragments/ButtonGroup.js';
import { HintText } from '../lib/ui/controllers/fragments/HintText.js';
import { VIS } from '../common/constants/Constants.js';
import Render from '../lib/ui/renders/Render.js';
import { Api } from '../common/plt/Api.js';
import { R } from '../common/constants/R.js';

declare global {
  interface Window {
    C_LIVE_STREAM: {
      START_RECORD: string;
      STOP_RECORD: string;
      TOGGLE_VIDEO: string;
      START_PREVIEW: string;
      STOP_PREVIEW: string;
    };
  }
}

window.C_LIVE_STREAM = {
  START_RECORD : "C_LIVE_STREAM_1",
  STOP_RECORD : "C_LIVE_STREAM_2",
  TOGGLE_VIDEO : "C_LIVE_STREAM_3",
  START_PREVIEW : "C_LIVE_STREAM_4",
  STOP_PREVIEW : "C_LIVE_STREAM_5",
}

const C_LIVE_STREAM = window.C_LIVE_STREAM;

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

interface MediaOption {
  video: boolean;
  audio: boolean;
}

class FvcLiveStream extends FScrollViewContent {
  #nUploading = 0;
  #nUploadError = 0;
  _dataSource: unknown;
  _recorder: MediaRecorder | null = null;
  _stream: MediaStream | null = null;
  _mediaOption: MediaOption = {video : true, audio : true};
  // TODO: Use fragment based view
  _visView: ButtonGroup;

  constructor(dataSource: unknown) {
    super();
    this._dataSource = dataSource;
    this._visView = new ButtonGroup();
    // @ts-expect-error - setDelegate accepts any object with delegate methods
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

  onButtonGroupSelectionChanged(_fButtonGroup: ButtonGroup, _value: string): void {}

  action(type: string, ...args: unknown[]): void {
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
      this.#onVideoToggled(args[0] as boolean);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderContentOnRender(render: Render): void {
    let s = _CVT_LIVE_STREAM.MAIN;
    s = s.replace("__ACTION_BUTTONS__", _CVT_LIVE_STREAM.BTN_START_PREVIEW);
    // Set ButtonGroup as child fragment - it will render into ID_VISIBILITY div
    this.setChild("visibility", this._visView);
    s = s.replace("__VISIBILITY__", '<div id="ID_VISIBILITY"></div>');
    render.replaceContent(s);
  }

  #setActionButtons(btns: string[]): void {
    let e = document.getElementById("ID_ACTION_BUTTONS");
    if (e) {
      e.innerHTML = btns.join("<br>");
    }
  }

  #onVideoToggled(checked: boolean): void {
    this._mediaOption.video = checked;
  }

  #onStartPreview(): void {
    let d = this;
    let devices = navigator.mediaDevices;
    if (devices) {
      devices.getUserMedia(this._mediaOption)
          .then(stream => d.#setPreview(stream))
          .then(() => d.#onPreviewReady())
          .catch(err => d.#onPreviewError(err));
    } else {
      // @ts-expect-error - owner may have onLocalErrorInFragment method
      this._owner?.onLocalErrorInFragment?.(this, R.get("EL_GET_DEVICE"));
    }
  }

  #setPreview(stream: MediaStream): Promise<void> {
    this._stream = stream;
    let ePreview = document.getElementById("ID_PREVIEW") as HTMLVideoElement | null;
    if (!ePreview) {
      return Promise.resolve();
    }
    ePreview.srcObject = stream;
    return new Promise(resolve => {
      ePreview!.onplaying = () => resolve();
    });
  }

  #onPreviewReady(): void {
    this.#setActionButtons(
        [ _CVT_LIVE_STREAM.BTN_START, _CVT_LIVE_STREAM.BTN_STOP_PREVIEW ]);
  }

  #onPreviewError(err: DOMException): void {
    switch (err.name) {
    case "NotAllowedError":
      // @ts-expect-error - owner may have onLocalErrorInFragment method
      this._owner?.onLocalErrorInFragment?.(this, R.get("EL_ACCESS_DEVICE"));
      break;
    case "NotFoundError":
      // @ts-expect-error - owner may have onLocalErrorInFragment method
      this._owner?.onLocalErrorInFragment?.(this, R.get("EL_NO_DEVICE"));
      break;
    default:
      console.log(err);
      break;
    }
    this.#stopPreview();
  }

  #onStartLive(): void {
    if (this._recorder) {
      return;
    }
    this.#asyncStartLive();
  }

  #onRemoveServerReady(): void {
    this.#setActionButtons([ _CVT_LIVE_STREAM.BTN_STOP ]);
    this.#startRecording();
  }

  #startRecording(): void {
    this.#nUploading = 0;
    this.#nUploadError = 0;
    let recorder = new MediaRecorder(this._stream!);
    recorder.ondataavailable = (event: BlobEvent) => this.#onStreamDataAvailable(event.data);
    recorder.start(500);
    recorder.onerror = (event: Event) => this.#onRecordError(event);
    this._recorder = recorder;
  }

  #onStreamDataAvailable(data: Blob): void {
    this.#asyncSendLiveData(data);
  }

  #onRecordError(evt: Event): void {
    const err = evt as { name?: string };
    switch (err.name) {
    case "NotAllowedError":
      // @ts-expect-error - owner may have onLocalErrorInFragment method
      this._owner?.onLocalErrorInFragment?.(this, R.get("EL_ACCESS_DEVICE"));
      break;
    case "NotFoundError":
      // @ts-expect-error - owner may have onLocalErrorInFragment method
      this._owner?.onLocalErrorInFragment?.(this, R.get("EL_NO_DEVICE"));
      break;
    default:
      console.log(err);
      break;
    }
    this.#stopRecording();
  }

  #stopRecording(): void {
    if (this._recorder) {
      this._recorder.stop();
      this._recorder = null;
    }
    this.#asyncStopLive();
  }

  #onRemoveServerStopped(): void {
    this.#setActionButtons([ _CVT_LIVE_STREAM.BTN_STOP_PREVIEW ]);
  }

  #stopPreview(): void {
    if (this._stream) {
      this._stream.getTracks().forEach(track => track.stop());
      this._stream = null;
    }
    this.#setActionButtons([ _CVT_LIVE_STREAM.BTN_START_PREVIEW ]);
  }

  #asyncStartLive(): void {
    let url = "/api/blog/start_live";
    let fd = new FormData();
    let e = document.getElementById("ID_TITLE") as HTMLTextAreaElement;
    fd.append("title", e.value);
    fd.append("visibility", this._visView.getSelectedValue() || "");
    Api!.asFragmentPost(this, url, fd)
        .then((d: unknown) => { this.#onStartLiveRRR(d); });
  }

  #onStartLiveRRR(_responseText: unknown): void {
    this.#onRemoveServerReady();
  }

  #asyncSendLiveData(data: Blob): void {
    if (this.#nUploading > 10) {
      console.log("Too many in queue, dropped data.");
      this.#nUploadError++;
      return;
    }
    // let recordedBlob = new Blob([ data ], {type : "video/webm"});
    let url = "/api/blog/live_data";
    this.#nUploading++;
    Api!.asPost(url, data)
        .then((d: unknown) => this.#onSendDataRRR(d), (e: unknown) => this.#onSendDataError(e))
        .finally(() => this.#onSendDataDone());
  }

  #onSendDataRRR(_data: unknown): void {
    this.#nUploadError = 0;
  }

  #onSendDataError(_e: unknown): void {
    this.#nUploadError++;
    if (this.#nUploadError > 10) {
      // @ts-expect-error - owner may have onLocalErrorInFragment method
      this._owner?.onLocalErrorInFragment?.(this, R.get("EL_CONNECTION_LOST"));
    }
  }

  #onSendDataDone(): void {
    this.#nUploading--;
  }

  #asyncStopLive(): void {
    let url = "/api/blog/stop_live";
    Api!.asFragmentCall(this, url).then((d: unknown) => { this.#onStopLiveRRR(d); });
  }

  #onStopLiveRRR(_data: unknown): void {
    this.#onRemoveServerStopped();
  }
}

export default FvcLiveStream;
