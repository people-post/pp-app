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
    PEER_CONN_OFFER: 'PC_OFFER',
    PEER_CONN_ANSWER: 'PC_ANSWER',
    ICE_CANDIDATE: 'ICE_CANDIDATE',
  } as const;

  private _data: {
    source: string;
    type?: string;
    from_id?: string;
    data?: unknown;
  };

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

