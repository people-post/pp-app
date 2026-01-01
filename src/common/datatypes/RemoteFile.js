import { ServerDataObject } from './ServerDataObject.js';
import { STATE } from '../constants/Constants.js';

export class RemoteFile extends ServerDataObject {
  // Synced with backend
  static T_STATUS = {
    LIVE : "LIVE",
    PREPROC: "PROC",
  };

  isFinished() { return this._data.state == STATE.FINISHED; }
  isActive() { return this._data.state == STATE.ACTIVE; }
  isImage() { return this._data.type.startsWith("image"); }
  isVideo() { return this._data.type.startsWith("video"); }
  isLivestreaming() {
    return this.isActive() &&
           this._data.status == this.constructor.T_STATUS.LIVE;
  }
  isPending() { return !this.isFinished() && !this.isLivestreaming(); }

  getName() { return this._data.name; }
  getCid() { return this._data.cid; }
  getImageUrl() {
    return this.isVideo() ? this.#getCoverImageUrl() : this._data.url;
  }
  getDownloadUrl() {
    return this._data.download_url ? this._data.download_url : this._data.url;
  }
  getThumbnailUrl(forWidth) {
    let s = "";
    if (forWidth > 480) {
      s = "960x960";
    } else if (forWidth > 240) {
      s = "480x480";
    } else {
      s = "240x240";
    }
    return this.getImageUrl() + "?size=" + s;
  }
  getVideoManifestType() { return "application/x-mpegURL"; }
  getVideoManifestUrl() {
    // TODO: This is a quick fix, needs to review design
    if (this._data.url.endsWith("m3u8")) {
      return this._data.url;
    }
    return this._data.url + "/manifest.m3u8";
  }
  getBackgroundColor() { return this._data.bg ? this._data.bg : ""; }
  getProgress() { return this._data.progress; }

  setState(s) { this._data.state = s; }
  setStatus(s) { this._data.status = s; }
  setProgress(p) { this._data.progress = p; }

  #getCoverImageUrl() { return this._data.cover_image_url; }
};
