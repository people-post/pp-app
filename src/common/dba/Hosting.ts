import { PerishableObject } from '../../lib/ext/PerishableObject.js';
import { T_DATA } from '../plt/Events.js';
import { Events } from '../../lib/framework/Events.js';
import { glb } from '../../lib/framework/Global.js';

interface ApiResponse {
  error?: unknown;
  data?: unknown;
}

interface HostingInterface {
  getStatus(): unknown;
  setStatus(d: unknown): void;
}

export class HostingClass implements HostingInterface {
  #status = new PerishableObject(5000);

  getStatus(): unknown {
    const d = this.#status.getData();
    if (!d) {
      this.#asyncGetStatus();
    }
    return d;
  }

  setStatus(d: unknown): void {
    this.#status.setData(d);
  }

  #asyncGetStatus(): void {
    const url = 'api/hosting/status';
    glb.api?.asyncRawCall(url, (r) => this.#onStatusRRR(r), null);
  }

  #onStatusRRR(responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (!response.error) {
      this.setStatus(response.data);
      Events.trigger(T_DATA.HOSTING_STATUS, this.#status);
    }
  }
}

export const Hosting = new HostingClass();

