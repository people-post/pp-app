import { sys } from 'pp-api';

interface UserInfo {
  id: string;
  peer_id?: string;
  root_cid?: string;
  [key: string]: unknown;
}

export const Web3PeerServerMixin = <T extends new (...args: unknown[]) => { getServer(): { getApiUrl(path: string): string; isRegisterEnabled(): boolean; getPeerId(): string } }>(Base: T) => class extends Base {
  #mUsers = new Map<string, UserInfo>();
  #initUserId: string | null = null;

  isInitUserRegistered(): boolean { return this.#initUserId !== null && this.#mUsers.has(this.#initUserId); }
  isRegisterEnabled(): boolean { return this.getServer().isRegisterEnabled(); }
  isInitUserUsable(): boolean {
    return this.isInitUserRegistered() || this.isRegisterEnabled();
  }

  getInitUserPeerId(): string | null {
    if (!this.#initUserId) return null;
    const u = this.#mUsers.get(this.#initUserId);
    return u ? (u.peer_id as string | undefined) || null : null;
  }

  getInitUserRootCid(): string | null {
    if (!this.#initUserId) return null;
    const u = this.#mUsers.get(this.#initUserId);
    return u ? (u.root_cid as string | undefined) || null : null;
  }

  async asIsNameRegistrable(name: string): Promise<boolean> {
    return !await this.#asFetchUserByName(name);
  }

  async asIsUserRegistered(userId: string): Promise<boolean> {
    return !!await this.#asFetchUserById(userId);
  }

  getInitUserId(): string | null { return this.#initUserId; }
  getHostPeerId(): string { return this.getServer().getPeerId(); }

  async asInitForUser(userId: string): Promise<void> {
    this.#initUserId = userId;
    const c = await this.#asFetchUserById(userId);
    if (c) {
      this.#mUsers.set(userId, c);
    }
  }

  async asRegister(msg: unknown, pubKey: string, sig: string): Promise<void> {
    console.log("Pubkey size", pubKey.length);
    let url = this.getServer().getApiUrl("/api/user/register");
    let options = {
      method : "POST" as const,
      headers : {"Content-Type" : "application/json"},
      body : JSON.stringify({data : msg, public_key : pubKey, signature : sig})
    };
    let res = await sys.ipfs.asFetch(url, options);
    let d = await res.json() as { error?: unknown; data?: { user: UserInfo } };
    if (d.error) {
      throw d.error;
    }
    let u = d.data!.user;
    this.#mUsers.set(u.id, u);
  }

  async #asFetchUserByName(name: string): Promise<UserInfo | null> {
    if (!name) {
      return null;
    }

    const url = this.getServer().getApiUrl("/api/user/get?name=" + name);
    return await this.#asFetchUserInfo(url);
  }

  async #asFetchUserById(userId: string): Promise<UserInfo | null> {
    if (!userId) {
      return null;
    }

    const url = this.getServer().getApiUrl("/api/user/get?id=" + userId);
    return await this.#asFetchUserInfo(url);
  }

  async #asFetchUserInfo(url: string): Promise<UserInfo | null> {
    let options = {
      method : "GET" as const,
      headers : {"Content-Type" : "application/json"}
    };
    let res: Response;
    try {
      res = await sys.ipfs.asFetch(url, options);
    } catch (e) {
      return null;
    }
    let d = await res.json() as { error?: unknown; data?: { user: UserInfo } };
    if (d.error) {
      throw d.error;
    }
    return d.data?.user || null;
  }
};
