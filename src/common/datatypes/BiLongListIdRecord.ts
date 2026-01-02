import { LongListIdRecord } from './LongListIdRecord.js';
import { SingleLongListIdRecord } from './SingleLongListIdRecord.js';

export class BiLongListIdRecord extends LongListIdRecord {
  // Front list goes backwards: index of 0, 1, 2 means global index -1 -2 -3
  #rFront = new SingleLongListIdRecord();
  #rBack = new SingleLongListIdRecord();

  isEmpty(): boolean {
    return this.#rFront.isEmpty() && this.#rBack.isEmpty();
  }

  isFrontComplete(): boolean {
    return this.#rFront.isComplete();
  }

  isBackComplete(): boolean {
    return this.#rBack.isComplete();
  }

  has(id: string): boolean {
    return this.#rFront.has(id) || this.#rBack.has(id);
  }

  getFirstIdx(): number {
    return -this.#rFront.size();
  }

  getId(idx: number): string | null {
    // Negative global idx to local idx is l_idx = -g_idx - 1
    const id = idx < 0 ? this.#rFront.getId(-idx - 1) : this.#rBack.getId(idx);
    return id ?? null;
  }

  getFirstId(): string | undefined {
    return this.#rFront.isEmpty() ? this.#rBack.getId(0) : this.#rFront.getLastId();
  }

  getLastId(): string | undefined {
    return this.#rBack.isEmpty() ? this.#rFront.getId(0) : this.#rBack.getLastId();
  }

  getIndexOf(id: string): number | null {
    let idx = this.#rFront.getIndexOf(id);
    if (idx < 0) {
      // Not found, try rBack
      idx = this.#rBack.getIndexOf(id);
      return idx < 0 ? null : idx;
    }
    // Front local idx to global idx is g_idx = -l_idx - 1
    return -idx - 1;
  }

  prependId(id: string): void {
    this.#rFront.appendId(id);
  }

  appendId(id: string): void {
    this.#rBack.appendId(id);
  }

  findIdBefore(id: string): string | null {
    const r = this.#rBack.findIdBefore(id);
    return r ? r : this.#rFront.findIdAfter(id);
  }

  findIdAfter(id: string): string | null {
    const r = this.#rBack.findIdAfter(id);
    return r ? r : this.#rFront.findIdBefore(id);
  }

  markFrontComplete(): void {
    this.#rFront.markComplete();
  }

  markBackComplete(): void {
    this.#rBack.markComplete();
  }

  removeId(id: string): void {
    this.#rFront.removeId(id);
    this.#rBack.removeId(id);
  }

  clear(): void {
    this.#rFront.clear();
    this.#rBack.clear();
  }
}

