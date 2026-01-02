import Controller from '../../lib/ext/Controller.js';

export interface CacheInfoOnServer {
  id: string | null;
  mimeType: string | null;
  coverId: string | null;
}

interface FileUploaderDelegate {
  onThumbnailDataLoadedInFileUploader(uploader: FileUploader, dataUrl: string): void;
}

export class FileUploader extends Controller {
  protected _file: File | null = null;
  protected _cacheInfoOnServer: CacheInfoOnServer = {
    id: null,
    mimeType: null,
    coverId: null,
  };
  protected _cacheId: string | null = null;
  protected _thumbnailFile: File | null = null;
  protected _isThumbnailUploading = false;
  protected _isFileUploading = false;

  constructor() {
    super();
    this._file = null;
    this._cacheInfoOnServer = {
      id: null,
      mimeType: null,
      coverId: null,
    };
    this._cacheId = null;
    this._thumbnailFile = null;
    this._isThumbnailUploading = false;
    this._isFileUploading = false;
  }

  isEmpty(): boolean {
    return !this._file;
  }

  isImage(): boolean {
    return this.#isImage(this._file);
  }

  isBusy(): boolean {
    return this._isThumbnailUploading || this._isFileUploading;
  }

  isUploaded(): boolean {
    return this._cacheInfoOnServer.id !== null;
  }

  getCacheFileInfo(): CacheInfoOnServer {
    return this._cacheInfoOnServer;
  }

  setCacheId(id: string | null): void {
    this._cacheId = id;
  }

  setThumbnailImage(file: File): void {
    this._thumbnailFile = file;
    this._asyncUploadThumbnail(file);
  }

  setFile(file: File | null): void {
    this._file = file;
    this._thumbnailFile = null;
    this._cacheInfoOnServer.id = null;
    this._cacheInfoOnServer.coverId = null;
    if (file) {
      this._cacheInfoOnServer.mimeType = file.type;
      this._asyncUploadFile(file);
    }
  }

  asyncReadThumbnail(): void {
    if (this._thumbnailFile) {
      this.#asyncReadThumbnail(this._thumbnailFile);
    } else if (this.#isImage(this._file)) {
      this.#asyncReadThumbnail(this._file!);
    }
  }

  #isImage(file: File | null): boolean {
    return !!(file && file.type.startsWith('image'));
  }

  #asyncReadThumbnail(file: File): void {
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (this._delegate && 'onThumbnailDataLoadedInFileUploader' in this._delegate) {
        (this._delegate as FileUploaderDelegate).onThumbnailDataLoadedInFileUploader(
          this,
          evt.target?.result as string
        );
      }
    };
    reader.readAsDataURL(file);
  }

  _asyncUploadThumbnail(_file: File): void {}

  _asyncUploadFile(_file: File): void {}
}

