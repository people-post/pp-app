/**
 * Basic type definitions for common data structures
 */

export interface SocialItemId {
  getValue(): string | null;
  getType(): string | null;
  setValue(v: string | null): void;
  setType(t: string | null): void;
  toEncodedStr(): string;
}

export interface ColorTheme {
  getPrimaryColor(): string;
  getSecondaryColor(): string;
  getTextColor(eTest: HTMLElement | null): string;
  getInfoTextColor(eTest: HTMLElement | null): string;
  getMenuColor(eTest: HTMLElement | null): string;
  getFuncColor(eTest: HTMLElement | null): string;
  getPrimeDecorColor(eTest: HTMLElement | null): string;
  getSecondaryDecorColor(eTest: HTMLElement | null): string;
  getSeparationColor(eTest: HTMLElement | null): string | null;
}

export interface SocialItem {
  getSocialItemType(): string;
  getOgpData(): unknown;
}

export interface RemoteError {
  type: string;
  code: string;
  data?: unknown;
}

export interface RemoteFile {
  isFinished(): boolean;
  isActive(): boolean;
  isImage(): boolean;
  isVideo(): boolean;
  isLivestreaming(): boolean;
  isPending(): boolean;
  getName(): string | undefined;
  getCid(): string | undefined;
  getImageUrl(): string | undefined;
  getDownloadUrl(): string | undefined;
  getThumbnailUrl(forWidth: number): string | undefined;
  getVideoManifestType(): string;
  getVideoManifestUrl(): string | undefined;
  getBackgroundColor(): string;
  getProgress(): number | undefined;
  setState(s: string): void;
  setStatus(s: string): void;
  setProgress(p: number): void;
}

export namespace RemoteFile {
  export const T_STATUS: {
    readonly LIVE: 'LIVE';
    readonly PREPROC: 'PROC';
  };
}
