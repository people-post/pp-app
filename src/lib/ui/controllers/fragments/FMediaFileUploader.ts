import { FFileUploader } from './FFileUploader.js';
import { SimpleImage } from './SimpleImage.js';
import { ListPanel } from '../../renders/panels/ListPanel.js';
import { Panel } from '../../renders/panels/Panel.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';

export const CF_MEDIA_FILE_UPLOAD = {
  SET_THUMBNAIL_IMAGE : "CF_MEDIA_FILE_UPLOAD_1",
} as const;

// Export to window for string template access
declare global {
  interface Window {
    CF_MEDIA_FILE_UPLOAD?: typeof CF_MEDIA_FILE_UPLOAD;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_MEDIA_FILE_UPLOAD = CF_MEDIA_FILE_UPLOAD;
}

export const _CFT_MEDIA_FILE_UPLOAD = {
  ACTIONS :
      `<a class="button-like s-primary" href="javascript:void(0)" onclick="javascript:this.nextElementSibling.click();">Cover</a>
      <input type="file" accept="image/*" style="display:none" onchange="javascript:G.action(window.CF_MEDIA_FILE_UPLOAD.SET_THUMBNAIL_IMAGE, this.files[0])">`,
} as const;

interface FileUploaderExtended {
  isImage(): boolean;
  asyncReadThumbnail(file?: File): void;
  setThumbnailImage(file: File): void;
}

interface UrlFile {
  getThumbnailUrl(size: number): string;
  isImage(): boolean;
}

export class FMediaFileUploader extends FFileUploader {
  protected _fPreview: SimpleImage;

  constructor() {
    super();
    this._fPreview = new SimpleImage();
    this.setChild("preview", this._fPreview);
  }

  onThumbnailDataLoadedInFileUploader(_uploader: any, urlData: string): void {
    this._fPreview.setSrc(urlData);
    this._fPreview.render()
  }

  onThumbnailUploadProgressUpdateInFileUploader(_uploader: any, percent: number): void {
    this._updateProgress(percent);
    if (percent == 100) {
      // Hack
      if (this._delegate && typeof (this._delegate as any).onMediaFileUploadFinished === 'function') {
        (this._delegate as any).onMediaFileUploadFinished(this);
      }
    }
  }

  onThumbnailUploadErrorInFileUploader(_uploader: any, text: string): void {
    this._fatal("Thumbnail upload", text);
    this._updateProgress(0);
  }

  action(type: string | symbol, ...args: any[]): void {
    switch (type) {
    case CF_MEDIA_FILE_UPLOAD.SET_THUMBNAIL_IMAGE:
      this.#onThumbnailChange(args[0]);
      break;
    default:
      super.action.apply(this, arguments as any);
      break;
    }
  }

  _onFileUploadWillBegin(): void {
    if (this._delegate && typeof (this._delegate as any).onMediaFileUploadWillBegin === 'function') {
      (this._delegate as any).onMediaFileUploadWillBegin(this);
    }
  }
  _onFileUploadFinished(): void {
    if (this._delegate && typeof (this._delegate as any).onMediaFileUploadFinished === 'function') {
      (this._delegate as any).onMediaFileUploadFinished(this);
    }
  }

  _renderOnRender(render: any): void {
    let p = new ListPanel();
    p.setClassName("file-preview-block");
    render.wrapPanel(p);
    let pp = new Panel();
    pp.setClassName("file-preview-icon");
    p.pushPanel(pp);
    this._fPreview.attachRender(pp);

    pp = new PanelWrapper();
    p.pushPanel(pp);
    this._renderProgress(pp);

    if (!this.#isImage()) {
      // None image file only
      pp = new Panel();
      p.pushPanel(pp);
      pp.replaceContent(_CFT_MEDIA_FILE_UPLOAD.ACTIONS);
    }

    if (this._urlFile) {
      let urlFile = this._urlFile as UrlFile;
      this._fPreview.setSrc(urlFile.getThumbnailUrl(240));
      this._fPreview.render()
    } else {
      (this._uploader as any as FileUploaderExtended).asyncReadThumbnail();
    }
  }

  #isImage(): boolean {
    let uploader = this._uploader as any as FileUploaderExtended;
    return (this._urlFile && (this._urlFile as UrlFile).isImage()) || uploader.isImage();
  }

  #onThumbnailChange(file: File): void {
    if (this._delegate && typeof (this._delegate as any).onMediaFileUploadWillBegin === 'function') {
      (this._delegate as any).onMediaFileUploadWillBegin();
    }
    let uploader = this._uploader as any as FileUploaderExtended;
    uploader.setThumbnailImage(file);
    uploader.asyncReadThumbnail(file);
  }
}

