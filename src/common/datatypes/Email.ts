import { ServerDataObject } from './ServerDataObject.js';
import { RemoteFile } from './RemoteFile.js';
import type { EmailData, EmailRecipientData } from '../../types/backend2.js';

export class Email extends ServerDataObject<EmailData> {
  #files: RemoteFile[] | undefined = undefined;

  isRead(): boolean {
    return this._data.is_read;
  }

  getSender(): EmailRecipientData {
    return this._data.sender;
  }

  getReceivers(): EmailRecipientData[] {
    return this._data.tos;
  }

  getCarbonCopies(): EmailRecipientData[] {
    return this._data.ccs;
  }

  getTitle(): string | null {
    return this._data.title;
  }

  getContentType(): string | null {
    return this._data.content_type;
  }

  getContent(): string | null {
    const contentType = this.getContentType();
    const content = this._data.content;
    if (!content) return null;
    if (contentType === 'text/html') {
      return content;
    }
    return content.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }

  getRawContent(): string | null {
    return this._data.raw_content;
  }

  getFiles(): RemoteFile[] {
    if (this.#files) {
      return this.#files;
    }
    this.#files = [];
    if (this._data.files) {
      for (const f of this._data.files) {
        this.#files.push(new RemoteFile(f));
      }
    }
    return this.#files;
  }

  getOwnerId(): string | null {
    return this._data.owner_id ?? null;
  }

  getUpdateTime(): Date {
    const updatedAt = this._data.updated_at;
    return new Date((updatedAt || 0) * 1000);
  }
}

