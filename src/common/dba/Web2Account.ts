import { WebConfig } from './WebConfig.js';
import { Users } from './Users.js';
import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { CustomerOrder } from '../datatypes/CustomerOrder.js';
import { Api } from '../plt/Api.js';
import type { User } from '../datatypes/User.js';

interface Idol {
  user_id: string;
  nickname?: string;
}

interface OutRequest {
  target_group_id: string;
}

interface BlogProfile {
  [key: string]: unknown;
}

interface UserProfile {
  uuid: string;
  is_followed?: boolean;
  idols?: Idol[];
  group_ids?: string[];
  journal_ids?: string[];
  blog?: BlogProfile;
  lang?: string;
  representative_id?: string;
  nickname?: string;
  referrer_id?: string;
  community_id?: string;
  applied_community_id?: string;
  is_beta_tester?: boolean;
  domain_name?: string;
  live_stream_key?: string;
  address_ids?: string[];
  o_requests?: OutRequest[];
}

interface ApiResponse {
  error?: unknown;
  data?: {
    profile?: UserProfile;
    address_ids?: string[];
    order?: unknown;
  };
}

export class Web2Account {
  #userId: string | null = null;
  // TODO: Code reorg in web2
  #profile: UserProfile | null = null;
  #guestName = '';
  #guestContact = '';
  #orderLib = new Map<string, CustomerOrder | null>();

  isWebOwner(): boolean {
    const id = this.getId();
    return !!(id && id === WebConfig.getOwnerId());
  }

  isAuthenticated(): boolean {
    return !!(this.#profile || this.#userId);
  }

  isFollowedByWebOwner(): boolean {
    return !!(this.#profile && this.#profile.is_followed);
  }

  isFollowing(userId: string): boolean {
    return this.getIdols().some((i) => i.user_id === userId);
  }

  isIdolOf(user: User): boolean {
    return (
      this.isAuthenticated() &&
      this.getId() !== user.getId() &&
      user.isFollowingUser()
    );
  }

  isInGroup(groupId: string): boolean {
    return !!(this.#profile && this.#profile.group_ids && this.#profile.group_ids.indexOf(groupId) >= 0);
  }

  isInCommunity(communityId: string | null): boolean {
    return !!(communityId && this.getCommunityId() === communityId);
  }

  isCommunityApplicationPending(): boolean {
    return !!(this.#profile && this.#profile.applied_community_id);
  }

  isRoleApplicationPending(roleId: string): boolean {
    return this.getOutRequests().some((r) => r.target_group_id === roleId);
  }

  isBetaTester(): boolean {
    return !!(this.#profile && this.#profile.is_beta_tester);
  }

  hasDomain(): boolean {
    return !!(this.#profile && this.#profile.domain_name);
  }

  getId(): string | null {
    return this.#profile ? this.#profile.uuid : this.#userId;
  }

  getGuestName(): string {
    return this.#guestName;
  }

  getGuestContact(): string {
    return this.#guestContact;
  }

  getIdols(): Idol[] {
    return this.#profile ? this.#profile.idols || [] : [];
  }

  getGroupIds(): string[] {
    return this.#profile ? this.#profile.group_ids || [] : [];
  }

  getJournalIds(): string[] {
    return this.#profile ? this.#profile.journal_ids || [] : [];
  }

  getBlogProfile(): BlogProfile | null {
    return this.#profile ? this.#profile.blog || null : null;
  }

  getPreferredLanguage(): string | null {
    return this.#profile ? this.#profile.lang || null : null;
  }

  getRepresentativeId(): string | null {
    return this.#profile ? this.#profile.representative_id || null : null;
  }

  getNickname(): string {
    return this.#profile ? this.#profile.nickname || '' : '';
  }

  getReferrerId(): string {
    return this.#profile ? this.#profile.referrer_id || '' : '';
  }

  getCommunityId(): string | null {
    return this.#profile ? this.#profile.community_id || null : null;
  }

  getUserShopName(userId: string, defaultName: string): string {
    let n = defaultName;
    const u = Users.get(userId);
    if (u && 'getShopName' in u && typeof u.getShopName === 'function') {
      const shopName = u.getShopName();
      if (shopName) {
        n = shopName;
      } else {
        n = this.getUserNickname(userId, defaultName);
      }
    }
    return n;
  }

  getUserNickname(userId: string, defaultNickname: string): string {
    const idol = this.#getIdol(userId);
    if (idol && idol.nickname && idol.nickname.length) {
      return idol.nickname;
    }

    const u = Users.get(userId);
    if (u && 'getNickname' in u && typeof u.getNickname === 'function') {
      const nickname = u.getNickname();
      if (nickname) {
        return nickname;
      }
    }
    return defaultNickname;
  }

  getOutRequests(): OutRequest[] {
    return this.#profile ? this.#profile.o_requests || [] : [];
  }

  getAddressIds(): string[] {
    if (this.#profile && this.#profile.address_ids) {
      return this.#profile.address_ids;
    } else {
      if (this.#profile) {
        this.#asyncLoadAddressIds();
      }
      return [];
    }
  }

  getOrder(id: string): CustomerOrder | null {
    if (this.#orderLib.has(id)) {
      return this.#orderLib.get(id) || null;
    } else {
      this.#asyncLoadOrder(id);
    }
    return null;
  }

  getLiveStreamKey(): string | null {
    return this.#profile ? this.#profile.live_stream_key || null : null;
  }

  setUserId(id: string | null): void {
    this.#userId = id;
  }

  setGuestName(name: string): void {
    this.#guestName = name;
  }

  setGuestContact(contact: string): void {
    this.#guestContact = contact;
  }

  setLiveStreamKey(key: string | null): void {
    if (this.#profile) {
      this.#profile.live_stream_key = key || undefined;
    }
  }

  reset(profile: UserProfile | null): void {
    this.#profile = profile;
    this.#orderLib.clear();
    FwkEvents.trigger(PltT_DATA.USER_PROFILE, null);
  }

  updateOrder(order: CustomerOrder): void {
    const id = order.getId();
    if (id !== undefined) {
      this.#orderLib.set(String(id), order);
      FwkEvents.trigger(PltT_DATA.CUSTOMER_ORDER, order);
    }
  }

  resetAddressIds(ids: string[]): void {
    if (this.#profile) {
      this.#profile.address_ids = ids;
      FwkEvents.trigger(PltT_DATA.USER_ADDRESS_IDS, ids);
    }
  }

  asyncFollow(userId: string): void {
    const url = 'api/user/follow';
    const fd = new FormData();
    fd.append('userId', userId);
    Api.asyncRawPost(url, fd, (r) => this.#onFollowRRR(r), null);
  }

  asyncUnfollow(userId: string): void {
    const url = 'api/user/unfollow';
    const fd = new FormData();
    fd.append('userId', userId);
    Api.asyncRawPost(url, fd, (r) => this.#onFollowRRR(r), null);
  }

  asyncReload(): void {
    if (this.isAuthenticated()) {
      this.#asyncLoadProfile();
    }
  }

  #getIdol(userId: string): Idol | null {
    for (const i of this.getIdols()) {
      if (i.user_id === userId) {
        return i;
      }
    }
    return null;
  }

  #onFollowRRR(responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.profile) {
        this.reset(response.data.profile);
      }
    }
  }

  #asyncLoadProfile(): void {
    const url = '/api/user/profile';
    Api.asyncRawCall(url, (r) => this.#onProfileRRR(r), null);
  }

  #onProfileRRR(responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.profile) {
        this.reset(response.data.profile);
      }
    }
  }

  #asyncLoadAddressIds(): void {
    const url = '/api/user/address_ids';
    Api.asyncRawCall(url, (r) => this.#onAddressIdsRRR(r), null);
  }

  #onAddressIdsRRR(responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.address_ids) {
        this.resetAddressIds(response.data.address_ids);
      }
    }
  }

  #asyncLoadOrder(id: string): void {
    const url = '/api/user/order?id=' + id;
    Api.asyncRawCall(url, (r) => this.#onOrderRRR(r, id), null);
  }

  #onOrderRRR(responseText: string, id: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.order) {
        const orderData = response.data.order as Record<string, unknown>;
        this.updateOrder(new CustomerOrder(orderData));
      } else {
        this.#orderLib.set(id, null);
        FwkEvents.trigger(PltT_DATA.CUSTOMER_ORDER, null);
      }
    }
  }
}