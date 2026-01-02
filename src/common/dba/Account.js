import { WebConfig } from './WebConfig.js';
import { Users } from './Users.js';
import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { CustomerOrder } from '../datatypes/CustomerOrder.js';

export class Web2Account {
  #userId = null;
  // TODO: Code reorg in web2
  #profile = null;
  #guestName = "";
  #guestContact = "";
  #orderLib = new Map();

  isWebOwner() {
    let id = this.getId();
    return id && id == WebConfig.getOwnerId();
  }

  isAuthenticated() { return this.#profile || this.#userId; }

  isFollowedByWebOwner() { return this.#profile && this.#profile.is_followed; }

  isFollowing(userId) { return this.getIdols().some(i => i.user_id == userId); }

  isIdolOf(user) {
    return this.isAuthenticated() && this.getId() != user.getId() &&
           user.isFollowingUser();
  }

  isInGroup(groupId) {
    return this.#profile && this.#profile.group_ids.indexOf(groupId) >= 0;
  }

  isInCommunity(communityId) {
    return communityId && this.getCommunityId() == communityId;
  }

  isCommunityApplicationPending() {
    return this.#profile && this.#profile.applied_community_id;
  }

  isRoleApplicationPending(roleId) {
    return this.getOutRequests().some(r => r.target_group_id == roleId);
  }

  isBetaTester() { return this.#profile && this.#profile.is_beta_tester; }
  hasDomain() { return this.#profile && this.#profile.domain_name; }

  getId() { return this.#profile ? this.#profile.uuid : this.#userId; }
  getGuestName() { return this.#guestName; }
  getGuestContact() { return this.#guestContact; }
  getIdols() { return this.#profile ? this.#profile.idols : []; }
  getGroupIds() { return this.#profile ? this.#profile.group_ids : []; }
  getJournalIds() { return this.#profile ? this.#profile.journal_ids : []; }
  getBlogProfile() { return this.#profile ? this.#profile.blog : null; }
  getPreferredLanguage() { return this.#profile ? this.#profile.lang : null; }
  getRepresentativeId() {
    return this.#profile ? this.#profile.representative_id : null;
  }
  getNickname() { return this.#profile ? this.#profile.nickname : ""; }
  getReferrerId() { return this.#profile ? this.#profile.referrer_id : ""; }
  getCommunityId() { return this.#profile ? this.#profile.community_id : null; }
  getUserShopName(userId, defaultName) {
    let n = defaultName;
    let u = Users.get(userId);
    if (u) {
      n = u.getShopName();
      if (!n) {
        n = this.getUserNickname(userId, defaultName);
      }
    }
    return n;
  }
  getUserNickname(userId, defaultNickname) {
    let idol = this.#getIdol(userId);
    if (idol && idol.nickname && idol.nickname.length) {
      return idol.nickname;
    }

    let u = Users.get(userId);
    if (u) {
      return u.getNickname();
    }
    return defaultNickname;
  }

  getOutRequests() { return this.#profile ? this.#profile.o_requests : []; }

  getAddressIds() {
    if (this.#profile && this.#profile.address_ids) {
      return this.#profile.address_ids;
    } else {
      if (this.#profile) {
        this.#asyncLoadAddressIds();
      }
      return [];
    }
  }

  getOrder(id) {
    if (this.#orderLib.has(id)) {
      return this.#orderLib.get(id);
    } else {
      this.#asyncLoadOrder(id);
    }
    return null;
  }

  getLiveStreamKey() {
    return this.#profile ? this.#profile.live_stream_key : null;
  }
  setUserId(id) { this.#userId = id; }
  setGuestName(name) { this.#guestName = name; }
  setGuestContact(contact) { this.#guestContact = contact; }
  setLiveStreamKey(key) {
    if (this.#profile) {
      this.#profile.live_stream_key = key;
    }
  }

  reset(profile) {
    this.#profile = profile;
    this.#orderLib.clear();
    FwkEvents.trigger(PltT_DATA.USER_PROFILE);
  }

  updateOrder(order) {
    this.#orderLib.set(order.getId(), order);
    FwkEvents.trigger(PltT_DATA.CUSTOMER_ORDER, order);
  }

  resetAddressIds(ids) {
    this.#profile.address_ids = ids;
    FwkEvents.trigger(PltT_DATA.USER_ADDRESS_IDS);
  }

  asyncFollow(userId) {
    let url = "api/user/follow";
    let fd = new FormData();
    fd.append("userId", userId);
    glb.api.asyncRawPost(url, fd, r => this.#onFollowRRR(r));
  }

  asyncUnfollow(userId) {
    let url = "api/user/unfollow";
    let fd = new FormData();
    fd.append("userId", userId);
    glb.api.asyncRawPost(url, fd, r => this.#onFollowRRR(r));
  }

  asyncReload() {
    if (this.isAuthenticated()) {
      this.#asyncLoadProfile();
    }
  }

  #getIdol(userId) {
    for (let i of this.getIdols()) {
      if (i.user_id == userId) {
        return i;
      }
    }
    return null;
  }

  #onFollowRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      this.reset(response.data.profile);
    }
  }

  #asyncLoadProfile() {
    let url = "/api/user/profile";
    glb.api.asyncRawCall(url, r => this.#onProfileRRR(r));
  }

  #onProfileRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      this.reset(response.data.profile);
    }
  }

  #asyncLoadAddressIds() {
    let url = "/api/user/address_ids";
    api.asyncRawCall(url, r => this.#onAddressIdsRRR(r));
  }

  #onAddressIdsRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      this.resetAddressIds(response.data.address_ids);
    }
  }

  #asyncLoadOrder(id) {
    let url = "/api/user/order?id=" + id;
    api.asyncRawCall(url, r => this.#onOrderRRR(r, id));
  }

  #onOrderRRR(responseText, id) {
    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data.order) {
        this.updateOrder(new CustomerOrder(response.data.order));
      } else {
        this.#orderLib.set(id, null);
        FwkEvents.trigger(PltT_DATA.CUSTOMER_ORDER, null);
      }
    }
  }
};

export const Account = new Web2Account();
