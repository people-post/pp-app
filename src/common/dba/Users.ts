import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { User } from '../datatypes/User.js';
import type { User as UserType } from '../../types/user.js';
import { PATH } from '../constants/Constants.js';
import { Env } from '../plt/Env.js';
import { Api } from '../plt/Api.js';
import { User as Web3User, Owner as Web3Owner } from '../plt/PpApiTypes.js';
import { Account } from './Account.js';
import { Web3OwnerUser } from './Web3OwnerUser.js';
import { Web3UserAdapter } from './Web3UserAdapter.js';
import { UserPublicProfile as Web2UserPublicProfileData } from '../../types/backend2.js';

interface ApiResponse {
  error?: unknown;
  data?: {
    profiles?: Web2UserPublicProfileData[];
  };
}

interface Web3Resolver {
  asResolve(id: string): Promise<unknown>;
}

// Public users' information
export class UserLib {
  #isLoading = false;
  #mUsers = new Map<string, UserType | null>();
  #web3Resolver: Web3Resolver | null = null;

  constructor() {
    this.#initMap();
  }

  onWeb3UserIdolsLoaded(user: Web3User): void {
    const id = user.getId();
    if (id !== undefined) {
      FwkEvents.trigger(PltT_DATA.USER_IDOLS, String(id));
    }
  }

  onWeb3UserProfileLoaded(user: Web3User): void {
    const id = user.getId();
    if (id !== undefined) {
      FwkEvents.trigger(PltT_DATA.USER_PUBLIC_PROFILE, String(id));
    }
  }

  setWeb3Resolver(resolver: Web3Resolver | null): void {
    this.#web3Resolver = resolver;
  }

  get(id: string | null): UserType | null {
    if (!id) {
      return null;
    }

    if (Env.isWeb3() && Account.isAuthenticated() && Account.getId() === id) {
      const impl = Account.getImplementation();
      if (impl instanceof Web3Owner) {
        return new Web3OwnerUser(impl);
      }
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
      const impl = Account.getImplementation();
      if (impl instanceof Web3Owner) {
        return new Web3OwnerUser(impl);
      }
    }

    if (!this.#mUsers.has(id)) {
      const web3Resolver = this.#web3Resolver;
      const d = web3Resolver ? await web3Resolver.asResolve(id) : null;
      const raw = new Web3User(d as Record<string, unknown>);
      raw.setProps({
        callbacks: {
          onWeb3UserIdolsLoaded: (user) => this.onWeb3UserIdolsLoaded(user),
          onWeb3UserProfileLoaded: (user) => this.onWeb3UserProfileLoaded(user),
        },
      });
      this.#mUsers.set(id, new Web3UserAdapter(raw));
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
      new User({ nickname: 'G-Cabin', icon_url: 'file/gcabin_favicon' } as Web2UserPublicProfileData)
    );
    this.#mUsers.set(
      User.C_ID.L_ADD_USER,
      new User({
        nickname: 'Add',
        icon_url: PATH.STATIC + '/img/circle_add.svg',
      } as Web2UserPublicProfileData)
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
    const web3Resolver = this.#web3Resolver;
    if (!web3Resolver) return;
    for (const id of ids) {
      web3Resolver
        .asResolve(id)
        .then((d) => this.#onWeb3LoadRRR(id, d))
        .catch((e) => console.error(e));
    }
  }

  #onWeb3LoadRRR(userId: string, data: unknown): void {
    const raw = new Web3User(data as Record<string, unknown>);
    raw.setProps({
      callbacks: {
        onWeb3UserIdolsLoaded: (user) => this.onWeb3UserIdolsLoaded(user),
        onWeb3UserProfileLoaded: (user) => this.onWeb3UserProfileLoaded(user),
      },
    });
    const u = new Web3UserAdapter(raw);
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
          us.push(new User(p));
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

