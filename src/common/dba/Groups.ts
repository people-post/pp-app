import { T_DATA } from '../plt/Events.js';
import { Events, T_DATA as FWK_T_DATA } from '../../lib/framework/Events.js';
import { UserGroup } from '../datatypes/UserGroup.js';
import { Api } from '../plt/Api.js';

interface ApiResponse {
  error?: unknown;
  data?: {
    groups?: unknown[];
  };
}

interface GroupsInterface {
  loadMissing(ids: string[]): boolean;
  get(id: string | null): UserGroup | null | undefined;
  getTag(id: string | null): UserGroup | null | undefined;
  update(group: UserGroup): void;
}

export class GroupsClass implements GroupsInterface {
  // Public groups' information
  #map = new Map<string, UserGroup | null>();

  loadMissing(ids: string[]): boolean {
    const missingIds: string[] = [];
    for (const id of ids) {
      if (!this.#map.has(id)) {
        missingIds.push(id);
      }
    }
    if (missingIds.length) {
      this.#load(missingIds);
      return true;
    }
    return false;
  }

  #load(ids: string[]): void {
    const url = 'api/career/groups';
    const fd = new FormData();
    for (const id of ids) {
      fd.append('ids', id);
      // Set to default
      this.#map.set(id, null);
    }
    Api.asyncRawPost(url, fd, (r) => this.#onLoadRRR(ids, r), null);
  }

  get(id: string | null): UserGroup | null | undefined {
    if (!id) {
      return null;
    }
    if (this.#map.has(id)) {
      return this.#map.get(id) || null;
    }
    this.#load([id]);
    return null;
  }

  getTag(id: string | null): UserGroup | null | undefined {
    // TODO: Separate tag and group
    return this.get(id);
  }

  update(group: UserGroup): void {
    const id = group.getId();
    if (id !== undefined) {
      this.#map.set(String(id), group);
    }
  }

  #onLoadRRR(ids: string[], responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      Events.trigger(FWK_T_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.groups) {
        const gs: UserGroup[] = [];
        for (const d of response.data.groups) {
          const g = new UserGroup(d as Record<string, unknown>);
          this.update(g);
          gs.push(g);
        }
        Events.trigger(T_DATA.GROUPS, gs);
      }
    }
  }
}

export const Groups = new GroupsClass();

