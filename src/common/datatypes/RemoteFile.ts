import { ServerDataObject } from './ServerDataObject.js';
import { STATE } from '../constants/Constants.js';
import { RemoteFile as RemoteFileInterface } from '../../types/basic.js';

export class RemoteFile extends ServerDataObject implements RemoteFileInterface {
  // Synced with backend
  static readonly T_STATUS = {
    LIVE: 'LIVE',
    PREPROC: 'PROC',
  } as const;

  isFinished(): boolean {
    return this._data.state === STATE.FINISHED;
  }

  isActive(): boolean {
    return this._data.state === STATE.ACTIVE;
  }

  isImage(): boolean {
    const type = this._data.type as string | undefined;
    return type ? type.startsWith('image') : false;
  }

  isVideo(): boolean {
    const type = this._data.type as string | undefined;
    return type ? type.startsWith('video') : false;
  }

  isLivestreaming(): boolean {
    return (
      this.isActive() &&
      this._data.status === RemoteFile.T_STATUS.LIVE
    );
  }

  isPending(): boolean {
    return !this.isFinished() && !this.isLivestreaming();
  }

  getName(): string | undefined {
    return this._data.name as string | undefined;
  }

  getCid(): string | undefined {
    return this._data.cid as string | undefined;
  }

  getImageUrl(): string | undefined {
    return this.isVideo() ? this.#getCoverImageUrl() : (this._data.url as string | undefined);
  }

  getDownloadUrl(): string | undefined {
    return (this._data.download_url as string | undefined) || (this._data.url as string | undefined);
  }

  getThumbnailUrl(forWidth: number): string | undefined {
    let s = '';
    if (forWidth > 480) {
      s = '960x960';
    } else if (forWidth > 240) {
      s = '480x480';
    } else {
      s = '240x240';
    }
    const url = this.getImageUrl();
    return url ? `${url}?size=${s}` : undefined;
  }

  getVideoManifestType(): string {
    return 'application/x-mpegURL';
  }

  getVideoManifestUrl(): string | undefined {
    // TODO: This is a quick fix, needs to review design
    const url = this._data.url as string | undefined;
    if (!url) return undefined;
    if (url.endsWith('m3u8')) {
      return url;
    }
    return `${url}/manifest.m3u8`;
  }

  getBackgroundColor(): string {
    return (this._data.bg as string | undefined) || '';
  }

  getProgress(): number | undefined {
    return this._data.progress as number | undefined;
  }

  setState(s: string): void {
    this._data.state = s;
  }

  setStatus(s: string): void {
    this._data.status = s;
  }

  setProgress(p: number): void {
    this._data.progress = p;
  }

  #getCoverImageUrl(): string | undefined {
    return this._data.cover_image_url as string | undefined;
  }
}

