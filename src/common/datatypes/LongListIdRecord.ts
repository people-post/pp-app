export abstract class LongListIdRecord {
  abstract isEmpty(): boolean;
  abstract isFrontComplete(): boolean;
  abstract isBackComplete(): boolean;

  abstract getFirstIdx(): number;
  getId(_idx: number): string | null {
    return null;
  }

  abstract clear(): void;
}

