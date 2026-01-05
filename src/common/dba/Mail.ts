import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { UniLongListIdRecord } from '../datatypes/UniLongListIdRecord.js';
import { Email } from '../datatypes/Email.js';
import { Api } from '../plt/Api.js';

interface ApiResponse {
  error?: unknown;
  data?: {
    email?: unknown;
  };
}

interface MailInterface {
  get(id: string | null): Email | null | undefined;
  getIdRecord(): UniLongListIdRecord;
  reloadIds(): void;
  reload(id: string): void;
  update(email: Email): void;
  remove(emailId: string): void;
  clear(): void;
}

export class MailClass implements MailInterface {
  #lib = new Map<string, Email>();
  #pendingResponses: string[] = [];
  #idRecord = new UniLongListIdRecord();

  get(id: string | null): Email | null | undefined {
    if (!id) {
      return null;
    }
    if (!this.#lib.has(id)) {
      this.#asyncLoad(id);
    }
    return this.#lib.get(id);
  }

  getIdRecord(): UniLongListIdRecord {
    return this.#idRecord;
  }

  update(email: Email): void {
    const id = email.getId();
    if (id !== undefined) {
      this.#lib.set(String(id), email);
      FwkEvents.trigger(PltT_DATA.EMAIL, email);
    }
  }

  remove(emailId: string): void {
    this.#idRecord.removeId(emailId);
    this.#lib.delete(emailId);
    FwkEvents.trigger(PltT_DATA.EMAIL_IDS, null);
  }

  reload(id: string): void {
    this.#asyncLoad(id);
  }

  reloadIds(): void {
    this.#idRecord.clear();
  }

  clear(): void {
    this.#lib.clear();
    this.#idRecord.clear();
    FwkEvents.trigger(PltT_DATA.EMAIL_IDS, null);
  }

  #asyncLoad(id: string): void {
    if (this.#pendingResponses.indexOf(id) >= 0) {
      return;
    }
    this.#pendingResponses.push(id);

    const url = 'api/email/item?id=' + id;
    Api.asyncRawCall(url, (r) => this.#onEmailRRR(r, id), null);
  }

  #onEmailRRR(responseText: string, id: string): void {
    const idx = this.#pendingResponses.indexOf(id);
    if (idx >= 0) {
      this.#pendingResponses.splice(idx, 1);
    }

    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.email) {
        const e = new Email(response.data.email as Record<string, unknown>);
        this.update(e);
      }
    }
  }
}

export const Mail = new MailClass();

