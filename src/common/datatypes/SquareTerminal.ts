import { ServerDataObject } from './ServerDataObject.js';

interface SquareTerminalData {
  device_id?: string;
  pair_code?: string;
  pair_by?: string;
  status?: string;
  paired_at?: number;
  [key: string]: unknown;
}

export class SquareTerminal extends ServerDataObject {
  protected declare _data: SquareTerminalData;

  getDeviceId(): string | undefined {
    return this._data.device_id as string | undefined;
  }

  getPairCode(): string | undefined {
    return this._data.pair_code as string | undefined;
  }

  getPairBy(): string | undefined {
    return this._data.pair_by as string | undefined;
  }

  getStatus(): string | undefined {
    return this._data.status as string | undefined;
  }

  getPairedAt(): number | undefined {
    return this._data.paired_at as number | undefined;
  }
}

