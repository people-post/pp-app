import Utilities from '../../lib/ext/Utilities.js';

export class SingleLongListIdRecord {
  #ids: string[] = [];
  #isComplete = false;

  isEmpty(): boolean {
    return this.#ids.length === 0;
  }

  isComplete(): boolean {
    return this.#isComplete;
  }

  has(id: string): boolean {
    return this.#ids.indexOf(id) >= 0;
  }

  getId(index: number): string | undefined {
    return this.#ids[index];
  }

  getLastId(): string | undefined {
    return this.#ids[this.#ids.length - 1];
  }

  getIds(): string[] {
    return this.#ids;
  }

  getIndexOf(id: string): number {
    return this.#ids.indexOf(id);
  }

  size(): number {
    return this.#ids.length;
  }

  appendId(id: string): void {
    this.#ids.push(id);
  }

  markComplete(): void {
    this.#isComplete = true;
  }

  findIdBefore(id: string): string | null {
    return Utilities.findItemBefore(this.#ids, id);
  }

  findIdAfter(id: string): string | null {
    return Utilities.findItemAfter(this.#ids, id);
  }

  removeId(id: string): void {
    const idx = this.#ids.indexOf(id);
    if (idx < 0) {
      return;
    }
    this.#ids.splice(idx, 1);
  }

  clear(): void {
    this.#ids = [];
    this.#isComplete = false;
  }
}

