import { FileUploader } from '../plt/FileUploader.js';
import { Api } from '../plt/Api.js';

interface Web3FileUploaderDelegate {
  onFileUploadProgressUpdateInFileUploader(uploader: Web3FileUploader, percent: number): void;
  onThumbnailUploadProgressUpdateInFileUploader(uploader: Web3FileUploader, percent: number): void;
  onFileUploadErrorInFileUploader(uploader: Web3FileUploader, responseText: string): void;
  onThumbnailUploadErrorInFileUploader(uploader: Web3FileUploader, responseText: string): void;
  [key: string]: unknown;
}

interface UploadResponse {
  error?: unknown;
  data?: {
    id: string;
  };
}

export class Web3FileUploader extends FileUploader {
  protected _delegate: Web3FileUploaderDelegate | null = null;

  _asyncUploadThumbnail(file: File): void {
    this._isThumbnailUploading = true;
    const url = '/api/user/upload';
    const fd = new FormData();
    fd.append('file', file);
    fd.append('id', this._cacheId!.toString() + '_cover');

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

    // TODO: there is no progress track in fetch api, need to find p2p version
    // of XMLHttpRequest similar to p2pFetch
    // Note: asUploadFile is a Web3-specific method that may not exist in Web2Account
    const account = window.dba?.Account as unknown as { asUploadFile?: (file: File) => Promise<string> };
    if (account.asUploadFile) {
      account.asUploadFile(file)
        .then((cid: string) => this.#onUploadFileDone(cid))
        .finally(() => (this._isFileUploading = false));
    } else {
      // Fallback: mark as done if method doesn't exist
      this._isFileUploading = false;
      console.warn('window.dba.Account.asUploadFile is not available');
    }
  }

  #onUploadFileProgress(v: number): void {
    const p = (v * 95) / this._file!.size;
    const delegate = this._delegate as Web3FileUploaderDelegate | null;
    delegate?.onFileUploadProgressUpdateInFileUploader(this, p);
  }

  #onUploadThumbnailProgress(v: number): void {
    const p = (v * 95) / this._thumbnailFile!.size;
    const delegate = this._delegate as Web3FileUploaderDelegate | null;
    delegate?.onThumbnailUploadProgressUpdateInFileUploader(this, p);
  }

  #onUploadThumbnailDone(responseText: string): void {
    this._isThumbnailUploading = false;
    const response = JSON.parse(responseText) as UploadResponse;
    const delegate = this._delegate as Web3FileUploaderDelegate | null;
    if (response.error) {
      this.#onUploadThumbnailError('');
    } else {
      if (response.data?.id) {
        this._cacheInfoOnServer.coverId = response.data.id;
        delegate?.onThumbnailUploadProgressUpdateInFileUploader(this, 100);
      }
    }
  }

  #onUploadThumbnailError(_responseText: string): void {
    this._isThumbnailUploading = false;
    const delegate = this._delegate as Web3FileUploaderDelegate | null;
    delegate?.onThumbnailUploadErrorInFileUploader(this, _responseText);
  }

  #onUploadFileError(responseText: string): void {
    const delegate = this._delegate as Web3FileUploaderDelegate | null;
    delegate?.onFileUploadErrorInFileUploader(this, responseText);
  }

  #onUploadFileDone(cid: string): void {
    this._cacheInfoOnServer.id = cid;
    const delegate = this._delegate as Web3FileUploaderDelegate | null;
    delegate?.onFileUploadProgressUpdateInFileUploader(this, 100);
  }
}

