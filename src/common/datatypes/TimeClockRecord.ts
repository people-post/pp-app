import { ServerDataObject } from './ServerDataObject.js';

interface TimeClockRecordData {
  total?: number;
  [key: string]: unknown;
}

export class TimeClockRecord extends ServerDataObject {
  protected declare _data: TimeClockRecordData;

  getTotal(): number | undefined {
    return this._data.total as number | undefined;
  }
}

