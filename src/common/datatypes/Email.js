import { ServerDataObject } from './ServerDataObject.js';
import { RemoteFile } from './RemoteFile.js';

export class Email extends ServerDataObject {
  constructor(data) {
    super(data);
    this._files = [];
    if (data.files) {
      for (let f of data.files) {
        this._files.push(new RemoteFile(f));
      }
    }
  }

  isRead() { return this._data.is_read; }
  getSender() { return this._data.sender; }
  getReceivers() { return this._data.tos; }
  getCarbonCopies() { return this._data.ccs; }
  getTitle() { return this._data.title; }
  getContentType() { return this._data.content_type; }
  getContent() {
    if (this._data.content_type == "text/html") {
      return this._data.content;
    }
    return this._data.content.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  getRawContent() { return this._data.raw_content; }
  getFiles() { return this._files; }
  getOwnerId() { return this._data.owner_id; }
  getUpdateTime() { return new Date(this._data.updated_at * 1000); }
};
