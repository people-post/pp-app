import { FileUploader } from './FileUploader.js';
import { Api } from './Api.js';

interface Web2FileUploaderDelegate {
  onFileUploadProgressUpdateInFileUploader(uploader: Web2FileUploader, percent: number): void;
  onThumbnailUploadProgressUpdateInFileUploader(uploader: Web2FileUploader, percent: number): void;
  onFileUploadErrorInFileUploader(uploader: Web2FileUploader, responseText: string): void;
  onThumbnailUploadErrorInFileUploader(uploader: Web2FileUploader, responseText: string): void;
}

interface UploadResponse {
  error?: unknown;
  data?: {
    id: string;
  };
}

export class Web2FileUploader extends FileUploader {

  _asyncUploadThumbnail(file: File): void {
    this._isThumbnailUploading = true;
    const url = '/api/user/upload';
    const fd = new FormData();
    fd.append('file', file);
    fd.append('id', this._cacheId!.toString() + '_cover');

    if (!Api) {
      throw new Error('API not available');
    }

    Api.asyncRawPost(
      url,
      fd,
      (r) => this.#onUploadThumbnailDone(r),
      (r) => this.#onUploadThumbnailError(r),
      (v) => this.#onUploadThumbnailProgress(v)
    );
  }

  _asyncUploadFile(file: File): void {
    this._isFileUploading = true;
    const url = '/api/user/upload';
    const fd = new FormData();
    fd.append('file', file);
    fd.append('id', this._cacheId!.toString() + '_raw');

    if (!Api) {
      throw new Error('API not available');
    }

    Api.asyncRawPost(
      url,
      fd,
      (r) => this.#onUploadFileDone(r),
      (r) => this.#onUploadFileError(r),
      (v) => this.#onUploadFileProgress(v)
    );
  }

  #onUploadFileProgress(v: number): void {
    const p = (v * 95) / this._file!.size;
    const delegate = this._delegate as Web2FileUploaderDelegate | null;
    delegate?.onFileUploadProgressUpdateInFileUploader(this, p);
  }

  #onUploadThumbnailProgress(v: number): void {
    const p = (v * 95) / this._thumbnailFile!.size;
    const delegate = this._delegate as Web2FileUploaderDelegate | null;
    delegate?.onThumbnailUploadProgressUpdateInFileUploader(this, p);
  }

  #onUploadThumbnailDone(responseText: string): void {
    this._isThumbnailUploading = false;
    const response = JSON.parse(responseText) as UploadResponse;
    const delegate = this._delegate as Web2FileUploaderDelegate | null;
    if (response.error) {
      this.#onUploadThumbnailError('');
    } else {
      this._cacheInfoOnServer.coverId = response.data!.id;
      delegate?.onThumbnailUploadProgressUpdateInFileUploader(this, 100);
    }
  }

  #onUploadThumbnailError(_responseText: string): void {
    this._isThumbnailUploading = false;
    const delegate = this._delegate as Web2FileUploaderDelegate | null;
    delegate?.onThumbnailUploadErrorInFileUploader(this, _responseText);
  }

  #onUploadFileError(responseText: string): void {
    this._isFileUploading = false;
    const delegate = this._delegate as Web2FileUploaderDelegate | null;
    delegate?.onFileUploadErrorInFileUploader(this, responseText);
  }

  #onUploadFileDone(responseText: string): void {
    this._isFileUploading = false;
    const response = JSON.parse(responseText) as UploadResponse;
    const delegate = this._delegate as Web2FileUploaderDelegate | null;
    if (response.error) {
      delegate?.onFileUploadErrorInFileUploader(this, responseText);
      this.#onUploadFileProgress(0);
    } else {
      this._cacheInfoOnServer.id = response.data!.id;
      delegate?.onFileUploadProgressUpdateInFileUploader(this, 100);
    }
  }
}

