import { ServerDataObject } from './ServerDataObject.js';
import { SquareTerminal } from './SquareTerminal.js';
import type { PaymentTerminalData, SquareTerminalData } from '../../types/backend2.js';

export class PaymentTerminal extends ServerDataObject<PaymentTerminalData> {
  // Synced with backend
  static readonly T_TYPE = {
    SQUARE_TERMINAL: 'SQUARE_TERMINAL',
  } as const;

  #dataObj: SquareTerminal | null = null;

  constructor(data: PaymentTerminalData) {
    super(data);
    this.#dataObj = this.#initDataObj(data.type, data.data);
  }

  getName(): string | null {
    return this._data.name;
  }

  getType(): string | null {
    return this._data.type;
  }

  getState(): string | null {
    return this._data.state;
  }

  getStatus(): string | null {
    return this._data.status;
  }

  getDataObj(): SquareTerminal | null {
    return this.#dataObj;
  }

  getTypeName(): string {
    let s = '';
    switch (this._data.type) {
      case PaymentTerminal.T_TYPE.SQUARE_TERMINAL:
        s = 'Square Terminal';
        break;
      default:
        break;
    }
    return s;
  }

  #initDataObj(type: string | null, data: unknown): SquareTerminal | null {
    let obj: SquareTerminal | null = null;
    switch (type) {
      case PaymentTerminal.T_TYPE.SQUARE_TERMINAL:
        obj = new SquareTerminal(data as SquareTerminalData);
        break;
      default:
        break;
    }
    return obj;
  }
}

