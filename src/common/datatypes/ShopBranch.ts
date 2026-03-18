import { ServerDataObject } from './ServerDataObject.js';
import type { ShopBranchData } from '../../types/backend2.js';

export class ShopBranch extends ServerDataObject {
  protected declare _data: ShopBranchData;

  getName(): string | undefined {
    return this._data.name as string | undefined;
  }

  getOwnerId(): string | undefined {
    return this._data.owner_id as string | undefined;
  }

  getAddressId(): string | undefined {
    return this._data.address_id as string | undefined;
  }
}

