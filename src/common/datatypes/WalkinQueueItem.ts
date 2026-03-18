import { ServerDataObject } from './ServerDataObject.js';
import type { WalkinQueueItemData } from '../../types/backend2.js';

export class WalkinQueueItem extends ServerDataObject<WalkinQueueItemData> {
  getCustomerUserId(): string | null {
    return this._data.customer_user_id;
  }

  getCustomerName(): string | null {
    return this._data.customer_name;
  }

  getProductId(): string | null {
    return this._data.product_id;
  }

  getState(): string | null {
    return this._data.state;
  }

  getStatus(): string | null {
    return this._data.status;
  }

  getUpdateTime(): Date {
    const updatedAt = this._data.updated_at;
    return new Date((updatedAt || 0) * 1000);
  }

  getAgentId(): string | null {
    return this._data.agent_id ?? null;
  }
}

