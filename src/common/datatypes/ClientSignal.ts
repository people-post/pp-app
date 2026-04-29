import type { ClientSignalData } from '../../types/backend2.js';

export class ClientSignal {
  // Partially synced with backend
  static readonly T_SOURCE = {
    HOST: 'HOST',
    PEER: 'PEER',
    CLIENT: 'CLIENT',
  } as const;

  // Partially synced with backend
  static readonly T_TYPE = {
    MSG: 'MSG',
    LIBP2P_PEER_ADDR: 'LIBP2P_PEER_ADDR',
  } as const;

  private _data: ClientSignalData;

  constructor() {
    // TODO: Make a base class?
    this._data = { source: ClientSignal.T_SOURCE.CLIENT };
  }

  setType(t: string): void {
    this._data.type = t;
  }

  setFromId(fromId: string): void {
    this._data.from_id = fromId;
  }

  setData(data: unknown): void {
    this._data.data = data;
  }

  toEncodedString(): string {
    return JSON.stringify(this._data);
  }
}

