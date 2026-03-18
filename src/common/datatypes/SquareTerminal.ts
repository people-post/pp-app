import { ServerDataObject } from './ServerDataObject.js';
import type { SquareTerminalData } from '../../types/backend2.js';

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

