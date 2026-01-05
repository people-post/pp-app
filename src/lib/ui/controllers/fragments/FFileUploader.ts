import { Fragment } from './Fragment.js';
import { SimpleProgress } from './SimpleProgress.js';
import { Factory, T_CATEGORY, T_OBJ } from '../../../framework/Factory.js';

interface FileUploader {
  isBusy(): boolean;
  getCacheFileInfo(): any;
  setCacheId(id: string): void;
  setFile(file: File | null): void;
  setDelegate(delegate: any): void;
  isEmpty(): boolean;
  isUploaded(): boolean;
}

export class FFileUploader extends Fragment {
  protected _fProgress: SimpleProgress;
  protected _uploader: FileUploader | null = null;
  protected _urlFile: any = null;

  constructor() {
    super();
    this._fProgress = new SimpleProgress();
    this.setChild("progress", this._fProgress);
  }

  isBusy(): boolean { return this.#getOrInitUploader().isBusy(); }
  getCacheFileInfo(): any { return this.#getOrInitUploader().getCacheFileInfo(); }

  onThumbnailDataLoadedInFileUploader(_uploader: FileUploader, _urlData: any): void {}
  onThumbnailUploadProgressUpdateInFileUploader(_uploader: FileUploader, _percent: number): void {}
  onThumbnailUploadErrorInFileUploader(_uploader: FileUploader, _text: string): void {}

  onFileUploadProgressUpdateInFileUploader(_uploader: FileUploader, percent: number): void {
    this._updateProgress(percent);
    if (percent == 100) {
      this._onFileUploadFinished();
    }
  }

  onFileUploadErrorInFileUploader(_uploader: FileUploader, text: string): void {
    this._fatal("file upload", text);
    this._updateProgress(0);
  }

  setCacheId(id: string): void { this.#getOrInitUploader().setCacheId(id); }

  resetToFile(file: File, _name: string | null = null): void {
    this._urlFile = null;
    this._onFileUploadWillBegin();
    this.#getOrInitUploader().setFile(file);
  }

  resetToUrlFile(urlFile: any): void {
    this._urlFile = urlFile;
    this.#getOrInitUploader().setFile(null);
  }

  _onFileUploadWillBegin(): void {}
  _onFileUploadFinished(): void {}

  _updateProgress(v: number): void {
    this._fProgress.setValue(v);
    this._fProgress.render();
  }

  _renderProgress(panel: any): void {
    if (this._urlFile || this.#getOrInitUploader().isUploaded()) {
      this._fProgress.setValue(100);
    } else {
      this._fProgress.setValue(0);
    }
    this._fProgress.attachRender(panel);
    this._fProgress.render();
  }

  #getOrInitUploader(): FileUploader {
    if (!this._uploader) {
      let cls = Factory.getClass(T_CATEGORY.UI, T_OBJ.FILE_UPLOADER) as any;
      this._uploader = cls ? new cls() : null;
      this._uploader?.setDelegate(this);
    }
    return this._uploader as FileUploader;
  }
}

