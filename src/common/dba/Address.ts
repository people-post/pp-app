import { T_DATA } from '../plt/Events.js';
import { Events, T_DATA as FWK_T_DATA } from '../../lib/framework/Events.js';
import { Address as AddressDataType } from '../datatypes/Address.js';
import { glb } from '../../lib/framework/Global.js';

interface ApiResponse {
  error?: unknown;
  data?: {
    address?: unknown;
  };
}

interface AddressInterface {
  get(id: string | null): AddressDataType | null;
  update(address: AddressDataType): void;
}

export class AddressClass implements AddressInterface {
  #lib = new Map<string, AddressDataType>();
  #pendingResponses: string[] = [];

  get(id: string | null): AddressDataType | null {
    if (!id) {
      return null;
    }
    if (this.#lib.has(id)) {
      return this.#lib.get(id)!;
    } else {
      this.#asyncGet(id);
      return null;
    }
  }

  update(address: AddressDataType): void {
    const id = address.getId();
    if (id !== undefined) {
      this.#lib.set(String(id), address);
      Events.trigger(T_DATA.ADDRESS, address);
    }
  }

  #asyncGet(id: string): void {
    if (this.#pendingResponses.indexOf(id) >= 0) {
      return;
    }
    this.#pendingResponses.push(id);
    const url = '/api/user/address';
    const fd = new FormData();
    fd.append('id', id);
    glb.api?.asyncRawPost(url, fd, (r) => this.#onGetRRR(r, id), null);
  }

  #onGetRRR(responseText: string, id: string): void {
    const idx = this.#pendingResponses.indexOf(id);
    if (idx >= 0) {
      this.#pendingResponses.splice(idx, 1);
    }

    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      Events.trigger(FWK_T_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.address) {
        this.update(new AddressDataType(response.data.address as Record<string, unknown>));
      }
    }
  }
}

export const Address = new AddressClass();

