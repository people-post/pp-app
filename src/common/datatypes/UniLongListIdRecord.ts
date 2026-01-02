import { LongListIdRecord } from './LongListIdRecord.js';
import { SingleLongListIdRecord } from './SingleLongListIdRecord.js';

export class UniLongListIdRecord extends LongListIdRecord {
  #record = new SingleLongListIdRecord();

  isEmpty(): boolean {
    return this.#record.isEmpty();
  }

  isFrontComplete(): boolean {
    return true;
  }

  isBackComplete(): boolean {
    return this.#record.isComplete();
  }

  isComplete(): boolean {
    return this.#record.isComplete();
  }

  has(id: string): boolean {
    return this.#record.has(id);
  }

  getFirstIdx(): number {
    return 0;
  }

  getId(index: number): string | null {
    const id = this.#record.getId(index);
    return id ?? null;
  }

  getLastId(): string | undefined {
    return this.#record.getLastId();
  }

  getIds(): string[] {
    return this.#record.getIds();
  }

  getIndexOf(id: string): number | null {
    const idx = this.#record.getIndexOf(id);
    return idx < 0 ? null : idx;
  }

  appendId(id: string): void {
    this.#record.appendId(id);
  }

  markComplete(): void {
    this.#record.markComplete();
  }

  findIdBefore(id: string): string | null {
    return this.#record.findIdBefore(id);
  }

  findIdAfter(id: string): string | null {
    return this.#record.findIdAfter(id);
  }

  removeId(id: string): void {
    this.#record.removeId(id);
  }

  clear(): void {
    this.#record.clear();
  }
}

