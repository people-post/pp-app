import { ServerDataObject } from './ServerDataObject.js';
import type { TimeClockRecordData } from '../../types/backend2.js';

export class TimeClockRecord extends ServerDataObject<TimeClockRecordData> {
  getTotal(): number {
    return this._data.total || 0;
  }
}

