import { ServerDataObject } from './ServerDataObject.js';

interface TimeClockData {
  t_current?: number;
  [key: string]: unknown;
}

export class TimeClock extends ServerDataObject {
  protected declare _data: TimeClockData;

  getServerTime(): Date {
    const tCurrent = this._data.t_current as number | undefined;
    return new Date((tCurrent || 0) * 1000);
  }

  getDurationMs(): number {
    const serverTime = this.getServerTime();
    const creationTime = this.getCreationTime();
    if (!creationTime) {
      return 0;
    }
    return serverTime.getTime() - creationTime.getTime();
  }
}

