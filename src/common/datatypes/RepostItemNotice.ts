import { Notice } from './Notice.js';

interface NoticeElement {
  read_at?: string | null;
  from_user_id: string;
  id: string;
}

export class RepostItemNotice extends Notice {
  private _itemId: string;
  private _itemType: string;
  private _elements: NoticeElement[];

  constructor(itemId: string, itemType: string) {
    super();
    this._itemId = itemId;
    this._itemType = itemType;
    this._elements = [];
  }

  isFrom(type: string): boolean {
    return type === this._itemType;
  }

  getFromId(): string {
    return this._itemId;
  }

  getFromIdType(): string {
    return this._itemType;
  }

  getNUnread(): number {
    let n = 0;
    for (const e of this._elements) {
      if (!e.read_at) {
        n++;
      }
    }
    return n;
  }

  getUserIds(): string[] {
    const ids: string[] = [];
    for (const e of this._elements) {
      ids.push(e.from_user_id);
    }
    return ids;
  }

  getNotificationIds(): string[] {
    const ids: string[] = [];
    for (const e of this._elements) {
      ids.push(e.id);
    }
    return ids;
  }

  addData(d: NoticeElement): void {
    this._elements.push(d);
  }
}

