import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { User } from '../datatypes/User.js';
import type { User as UserType } from '../../types/User.js';
import { PATH } from '../constants/Constants.js';
import { Env } from '../plt/Env.js';
import { Api } from '../plt/Api.js';
import { User as PpUser } from 'pp-api';
import { Account } from './Account.js';

interface ApiResponse {
  error?: unknown;
  data?: {
    profiles?: unknown[];
  };
}

interface Web3Resolver {
  asResolve(id: string): Promise<unknown>;
}

// Public users' information
export class UserLib {
  #isLoading = false;
  #mUsers = new Map<string, UserType | null>();

  constructor() {
    this.#initMap();
  }

  onWeb3UserIdolsLoaded(user: UserType): void {
    const id = user.getId();
    if (id !== undefined) {
      FwkEvents.trigger(PltT_DATA.USER_IDOLS, String(id));
    }
  }

  onWeb3UserProfileLoaded(user: UserType): void {
    const id = user.getId();
    if (id !== undefined) {
      FwkEvents.trigger(PltT_DATA.USER_PUBLIC_PROFILE, String(id));
    }
  }

  get(id: string | null): UserType | null {
    if (!id) {
      return null;
    }

    if (Env.isWeb3() && Account.isAuthenticated() && Account.getId() === id) {
      return Account.getImplementation() as unknown as User;
    }

    if (this.#mUsers.has(id)) {
      return this.#mUsers.get(id) || null;
    } else {
      this.#load([id]);
      return null;
    }
  }

  async asyncGet(id: string): Promise<UserType> {
    if (Env.isWeb3() && Account.isAuthenticated() && Account.getId() === id) {
      return Account.getImplementation() as unknown as User;
    }

    if (!this.#mUsers.has(id)) {
      // Lazy access to web3Resolver to avoid circular dependency
      const web3Resolver = (typeof window !== 'undefined' && (window as { glb?: { web3Resolver?: Web3Resolver } }).glb?.web3Resolver) || null;
      const d = web3Resolver ? await web3Resolver.asResolve(id) : null;
      const u = new PpUser(d as Record<string, unknown>);
      u.setDataSource(this as unknown as Parameters<typeof u.setDataSource>[0]);
      u.setDelegate(this);
      this.#mUsers.set(id, u);
    }
    return this.#mUsers.get(id)!;
  }

  update(user: UserType): void {
    const id = user.getId();
    if (id !== undefined) {
      this.#mUsers.set(String(id), user);
    }
  }

  reload(userId: string): void {
    this.#mUsers.delete(userId);
    this.#load([userId]);
  }

  loadMissing(ids: string[]): void {
    const missingIds: string[] = [];
    for (const id of ids) {
      if (!this.#mUsers.has(id)) {
        missingIds.push(id);
      }
    }
    if (missingIds.length) {
      this.#load(missingIds);
    }
  }

  clear(): void {
    this.#initMap();
  }

  #initMap(): void {
    this.#mUsers.clear();
    if (!User || !User.C_ID) {
      console.error('User.C_ID is not available. Module loading issue?');
      return;
    }

    this.#mUsers.set(
      User.C_ID.SYSTEM,
      new User({ nickname: 'G-Cabin', icon_url: 'file/gcabin_favicon' } as Record<string, unknown>)
    );
    this.#mUsers.set(
      User.C_ID.L_ADD_USER,
      new User({
        nickname: 'Add',
        icon_url: PATH.STATIC + '/img/circle_add.svg',
      } as Record<string, unknown>)
    );
  }

  #load(ids: string[]): void {
    if (Env.isWeb3()) {
      this.#web3Load(ids);
    } else {
      this.#web2Load(ids);
    }
  }

  #web2Load(ids: string[]): void {
    if (this.#isLoading) {
      return;
    }
    this.#isLoading = true;
    const url = 'api/user/profiles';
    const fd = new FormData();
    for (const id of ids) {
      fd.append('ids', id);
      // Set to default
      this.#mUsers.set(id, null);
    }
    Api.asyncRawPost(url, fd, (r) => this.#onLoadRRR(ids, r), null);
  }

  #web3Load(ids: string[]): void {
    // Lazy access to web3Resolver to avoid circular dependency
    const web3Resolver = (typeof window !== 'undefined' && (window as { glb?: { web3Resolver?: Web3Resolver } }).glb?.web3Resolver) || null;
    if (!web3Resolver) return;
    for (const id of ids) {
      web3Resolver
        .asResolve(id)
        .then((d) => this.#onWeb3LoadRRR(id, d))
        .catch((e) => console.error(e));
    }
  }

  #onWeb3LoadRRR(userId: string, data: unknown): void {
    const u = new PpUser(data as Record<string, unknown>);
    u.setDataSource(this as unknown as Parameters<typeof u.setDataSource>[0]);
    u.setDelegate(this);
    this.#mUsers.set(userId, u);
    FwkEvents.trigger(PltT_DATA.USER_PUBLIC_PROFILES, [u]);
  }

  #onLoadRRR(_ids: string[], responseText: string): void {
    this.#isLoading = false;
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.profiles) {
        const us: User[] = [];
        for (const p of response.data.profiles) {
          us.push(new User(p as Record<string, unknown>));
        }
        for (const u of us) {
          this.update(u);
        }
        FwkEvents.trigger(PltT_DATA.USER_PUBLIC_PROFILES, us);
      }
    }
  }
}

export const Users = new UserLib();

