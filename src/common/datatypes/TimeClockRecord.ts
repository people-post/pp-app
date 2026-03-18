import { ServerDataObject } from './ServerDataObject.js';
import type { TimeClockRecordData } from '../../types/backend2.js';

export class TimeClockRecord extends ServerDataObject {
  protected declare _data: TimeClockRecordData;

  getTotal(): number | undefined {
    return this._data.total as number | undefined;
  }
}

