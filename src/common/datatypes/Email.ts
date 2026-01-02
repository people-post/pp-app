import { ServerDataObject } from './ServerDataObject.js';
import { RemoteFile } from './RemoteFile.js';

export class Email extends ServerDataObject {
  private _files: RemoteFile[];

  constructor(data: Record<string, unknown>) {
    super(data);
    this._files = [];
    if (data.files) {
      const files = data.files as Record<string, unknown>[];
      for (const f of files) {
        this._files.push(new RemoteFile(f));
      }
    }
  }

  isRead(): boolean {
    return !!(this._data.is_read as boolean | undefined);
  }

  getSender(): string | undefined {
    return this._data.sender as string | undefined;
  }

  getReceivers(): string[] | undefined {
    return this._data.tos as string[] | undefined;
  }

  getCarbonCopies(): string[] | undefined {
    return this._data.ccs as string[] | undefined;
  }

  getTitle(): string | undefined {
    return this._data.title as string | undefined;
  }

  getContentType(): string | undefined {
    return this._data.content_type as string | undefined;
  }

  getContent(): string | undefined {
    const contentType = this.getContentType();
    const content = this._data.content as string | undefined;
    if (!content) return undefined;
    if (contentType === 'text/html') {
      return content;
    }
    return content.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }

  getRawContent(): string | undefined {
    return this._data.raw_content as string | undefined;
  }

  getFiles(): RemoteFile[] {
    return this._files;
  }

  getOwnerId(): string | number | undefined {
    return this._data.owner_id as string | number | undefined;
  }

  getUpdateTime(): Date {
    const updatedAt = this._data.updated_at as number | undefined;
    return new Date((updatedAt || 0) * 1000);
  }
}

