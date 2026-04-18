import { PerishableObject } from '../../lib/ext/PerishableObject.js';
import { T_DATA } from '../plt/Events.js';
import { Events } from '../../lib/framework/Events.js';
import { Api } from '../plt/Api.js';
import type { HostingData } from '../../types/backend2.js';

interface ApiResponse {
  error?: unknown;
  data?: HostingData;
}

interface HostingInterface {
  getStatus(): HostingData | null;
  setStatus(d: HostingData): void;
}

export class HostingClass implements HostingInterface {
  #status = new PerishableObject<HostingData>(5000);

  getStatus(): HostingData | null {
    const d = this.#status.getData();
    if (!d) {
      this.#asyncGetStatus();
    }
    return d;
  }

  setStatus(d: HostingData): void {
    this.#status.setData(d);
  }

  #asyncGetStatus(): void {
    const url = 'api/hosting/status';
    Api.asyncRawCall(url, (r) => this.#onStatusRRR(r), null);
  }

  #onStatusRRR(responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
        // TODO: Handle error
    } else {
      if (response.data) {
        this.setStatus(response.data);
        Events.trigger(T_DATA.HOSTING_STATUS, this.#status);
      } else {
        // TODO: Handle error
      }
    }
  }
}

export const Hosting = new HostingClass();

