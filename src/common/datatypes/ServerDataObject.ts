export class ServerDataObject {
  protected _data: {
    id?: string | number;
    created_at?: Date;
    [key: string]: unknown;
  };

  constructor(data: Record<string, unknown>) {
    if (data.created_at) {
      data.created_at = new Date((data.created_at as number) * 1000);
    }
    this._data = data as typeof this._data;
  }

  getId(): string | number | undefined {
    return this._data.id;
  }

  getCreationTime(): Date | undefined {
    return this._data.created_at;
  }
}

