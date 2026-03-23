export abstract class LongListIdRecord {
  abstract isEmpty(): boolean;
  abstract isFrontComplete(): boolean;
  abstract isBackComplete(): boolean;

  abstract getFirstIdx(): number;
  getId(_idx: number): string | null {
    return null;
  }

  getIndexOf(_id: string | number): number | null {
    return null;
  }

  abstract findIdAfter(id: string): string | null;
  abstract findIdBefore(id: string): string | null;

  abstract clear(): void;
}

