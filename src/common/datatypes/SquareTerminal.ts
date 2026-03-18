import { ServerDataObject } from './ServerDataObject.js';
import type { SquareTerminalData } from '../../types/backend2.js';

export class SquareTerminal extends ServerDataObject<SquareTerminalData> {
  getDeviceId(): string | null {
    return this._data.device_id;
  }

  getPairCode(): string | null {
    return this._data.pair_code;
  }

  getPairBy(): string | null {
    return this._data.pair_by;
  }

  getStatus(): string | null {
    return this._data.status;
  }

  getPairedAt(): number | null {
    return this._data.paired_at;
  }
}

