import { SocialItemId } from './SocialItemId.js';
import { SocialItem } from './SocialItem.js';

export class ChatTarget {
  #sId: SocialItemId;
  #isReadOnly: boolean;

  constructor() {
    this.#sId = new SocialItemId();
    this.#isReadOnly = false;
  }

  isReadOnly(): boolean {
    return this.#isReadOnly;
  }

  isGroup(): boolean {
    return this.getIdType() === SocialItem.TYPE.GROUP;
  }

  isUser(): boolean {
    return this.getIdType() === SocialItem.TYPE.USER;
  }

  getId(): string | null {
    return this.#sId.getValue();
  }

  getIdType(): string | null {
    return this.#sId.getType();
  }

  setId(id: string | null): void {
    this.#sId.setValue(id);
  }

  setIdType(t: string | null): void {
    this.#sId.setType(t);
  }

  setIsReadOnly(b: boolean): void {
    this.#isReadOnly = b;
  }
}

