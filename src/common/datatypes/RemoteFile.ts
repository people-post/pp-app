import { ServerDataObject } from './ServerDataObject.js';
import { STATE } from '../constants/Constants.js';
import { RemoteFile as RemoteFileInterface } from '../../types/basic.js';
import type { RemoteFileData } from '../../types/backend2.js';

export class RemoteFile extends ServerDataObject<RemoteFileData> implements RemoteFileInterface {
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

  getName(): string | null {
    return this._data.name ?? null;
  }

  getCid(): string | null {
    return this._data.cid ?? null;
  }

  getImageUrl(): string | null {
    return this.isVideo() ? this.#getCoverImageUrl() : (this._data.url ?? null);
  }

  getDownloadUrl(): string | null {
    return (this._data.download_url ?? this._data.url) ?? null;
  }

  getThumbnailUrl(forWidth: number): string | null {
    let s = '';
    if (forWidth > 480) {
      s = '960x960';
    } else if (forWidth > 240) {
      s = '480x480';
    } else {
      s = '240x240';
    }
    const url = this.getImageUrl();
    return url ? `${url}?size=${s}` : null;
  }

  getVideoManifestType(): string {
    return 'application/x-mpegURL';
  }

  getVideoManifestUrl(): string | null {
    // TODO: This is a quick fix, needs to review design
    const url = this._data.url ?? null;
    if (!url) return null;
    if (url.endsWith('m3u8')) {
      return url;
    }
    return `${url}/manifest.m3u8`;
  }

  getBackgroundColor(): string {
    return this._data.bg ?? '';
  }

  getProgress(): number | null {
    return this._data.progress ?? null;
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

  #getCoverImageUrl(): string | null {
    return this._data.cover_image_url ?? null;
  }
}

