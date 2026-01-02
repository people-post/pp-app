import { ServerDataObject } from './ServerDataObject.js';

interface BallotItem {
  value: string;
  ballot: number;
  [key: string]: unknown;
}

interface VotingSummaryData {
  config?: unknown;
  items?: BallotItem[];
  [key: string]: unknown;
}

export class VotingSummary extends ServerDataObject {
  protected _data: VotingSummaryData;

  constructor(data: VotingSummaryData) {
    super(data);
    this._data = data;
  }

  getBallotConfig(): unknown {
    return this._data.config;
  }

  getBallot(value: string): number | null {
    if (!this._data.items) {
      return null;
    }
    for (const item of this._data.items) {
      if (item.value == value) {
        return item.ballot;
      }
    }
    return null;
  }
}

