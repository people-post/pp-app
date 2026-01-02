import { ServerDataObject } from './ServerDataObject.js';

interface WalkinQueueItemData {
  customer_user_id?: string;
  customer_name?: string;
  product_id?: string;
  state?: string;
  status?: string;
  updated_at?: number;
  agent_id?: string;
  [key: string]: unknown;
}

export class WalkinQueueItem extends ServerDataObject {
  protected declare _data: WalkinQueueItemData;

  getCustomerUserId(): string | undefined {
    return this._data.customer_user_id as string | undefined;
  }

  getCustomerName(): string | undefined {
    return this._data.customer_name as string | undefined;
  }

  getProductId(): string | undefined {
    return this._data.product_id as string | undefined;
  }

  getState(): string | undefined {
    return this._data.state as string | undefined;
  }

  getStatus(): string | undefined {
    return this._data.status as string | undefined;
  }

  getUpdateTime(): Date {
    const updatedAt = this._data.updated_at as number | undefined;
    return new Date((updatedAt || 0) * 1000);
  }

  getAgentId(): string | undefined {
    return this._data.agent_id as string | undefined;
  }
}

