/**
 * Basic type definitions for common data structures
 */

export interface SocialItemId {
  isValid(): boolean;
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

export interface OgpData {
  getTitle(): string;
  getUrl(): string;
}

export interface SocialItem {
  getId(): string | null;
  getSocialItemType(): string;
  getOgpData(): OgpData | null;
}

export interface RemoteError {
  type: string;
  code: string;
  data?: unknown;
}

/**
 * Bookmark / reaction metadata for an item (Web3 marks root).
 * Structural match for pp-api User.asyncFindMark; defined here because pp-api
 * does not export this interface.
 */
export interface MarkInfo {
  like?: boolean;
  comments?: unknown[];
}

export interface RemoteFile {
  isFinished(): boolean;
  isActive(): boolean;
  isImage(): boolean;
  isVideo(): boolean;
  isLivestreaming(): boolean;
  isPending(): boolean;
  getName(): string | null;
  getCid(): string | null;
  getImageUrl(): string | null;
  getDownloadUrl(): string | null;
  getThumbnailUrl(forWidth: number): string | null;
  getVideoManifestType(): string;
  getVideoManifestUrl(): string | null;
  getBackgroundColor(): string;
  getProgress(): number | null;
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
