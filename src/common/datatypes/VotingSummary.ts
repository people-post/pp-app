import type { BallotConfig, VotingSummaryData } from '../../types/backend2.js';

export class VotingSummary {
  #data: VotingSummaryData;

  constructor(data: VotingSummaryData) {
    this.#data = data;
  }

  getBallotConfig(): BallotConfig {
    return this.#data.config;
  }

  getBallot(value: string): BallotConfig | null {
    if (!this.#data.items) {
      return null;
    }
    for (const item of this.#data.items) {
      if (item.value == value) {
        return item.ballot;
      }
    }
    return null;
  }
}

