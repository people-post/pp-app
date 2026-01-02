import { ServerDataObject } from './ServerDataObject.js';
import { SquareTerminal } from './SquareTerminal.js';

interface PaymentTerminalData {
  name?: string;
  type?: string;
  state?: string;
  status?: string;
  data?: unknown;
  [key: string]: unknown;
}

export class PaymentTerminal extends ServerDataObject {
  // Synced with backend
  static readonly T_TYPE = {
    SQUARE_TERMINAL: 'SQUARE_TERMINAL',
  } as const;

  protected _data: PaymentTerminalData;
  #dataObj: SquareTerminal | null = null;

  constructor(data: PaymentTerminalData) {
    super(data);
    this._data = data;
    this.#dataObj = this.#initDataObj(data.type, data.data);
  }

  getName(): string | undefined {
    return this._data.name as string | undefined;
  }

  getType(): string | undefined {
    return this._data.type;
  }

  getState(): string | undefined {
    return this._data.state as string | undefined;
  }

  getStatus(): string | undefined {
    return this._data.status as string | undefined;
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

  #initDataObj(type: string | undefined, data: unknown): SquareTerminal | null {
    let obj: SquareTerminal | null = null;
    switch (type) {
      case PaymentTerminal.T_TYPE.SQUARE_TERMINAL:
        obj = new SquareTerminal(data as Record<string, unknown>);
        break;
      default:
        break;
    }
    return obj;
  }
}

