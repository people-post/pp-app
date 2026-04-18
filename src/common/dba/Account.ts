/**
 * Account facade: delegates to an {@link AccountPort} (web2 or web3).
 * Web3-only APIs live on {@link Account.web3}.
 */

import { Web2Account } from './Web2Account.js';
import { Web2AccountAdapter } from './Web2AccountAdapter.js';
import { Web3OwnerAdapter } from './Web3OwnerAdapter.js';
import type { AccountPort, Web3AccountFacet } from './AccountPort.js';
import type { User as UserType } from '../../types/user.js';
import type { BlogStatisticsData, IdolData, OutRequest } from '../../types/backend2.js';
import type { CustomerOrder } from '../datatypes/CustomerOrder.js';
import { StorageAgent, Owner as Web3Owner, type PublisherAgent } from 'pp-api';

type AccountImplementation = Web2Account | Web3Owner;

class AccountWrapper implements AccountPort {
  #port: Web2AccountAdapter | Web3OwnerAdapter;

  constructor() {
    this.#port = new Web2AccountAdapter(new Web2Account());
  }

  get web3(): Web3AccountFacet | null {
    return this.#port instanceof Web3OwnerAdapter ? this.#port : null;
  }

  setImplementation(impl: AccountImplementation, isWeb3: boolean = false): void {
    if (isWeb3 && !(impl instanceof Web3Owner)) {
      throw new Error('Account.setImplementation: Web3 mode requires Web3Owner');
    }
    if (!isWeb3 && !(impl instanceof Web2Account)) {
      throw new Error('Account.setImplementation: Web2 mode requires Web2Account');
    }
    this.#port = isWeb3 ? new Web3OwnerAdapter(impl as Web3Owner) : new Web2AccountAdapter(impl as Web2Account);
  }

  getImplementation(): AccountImplementation {
    return this.#port instanceof Web3OwnerAdapter ? this.#port.web3Owner : this.#port.web2Account;
  }

  isWeb3Mode(): boolean {
    return this.#port instanceof Web3OwnerAdapter;
  }

  isAuthenticated(): boolean {
    return this.#port.isAuthenticated();
  }

  isWebOwner(): boolean {
    return this.#port.isWebOwner();
  }

  getId(): string | null {
    return this.#port.getId();
  }

  setUserId(id: string | null): void {
    this.#port.setUserId(id);
  }

  getNickname(): string {
    return this.#port.getNickname();
  }

  getPreferredLanguage(): string | null {
    return this.#port.getPreferredLanguage();
  }

  isFollowing(userId: string): boolean {
    return this.#port.isFollowing(userId);
  }

  isIdolOf(user: UserType): boolean {
    return this.#port.isIdolOf(user);
  }

  isFollowedByWebOwner(): boolean {
    return this.#port.isFollowedByWebOwner();
  }

  getIdols(): IdolData[] {
    return this.#port.getIdols();
  }

  getUserNickname(userId: string | null, defaultNickname?: string): string {
    return this.#port.getUserNickname(userId, defaultNickname);
  }

  getUserShopName(userId: string | null, defaultName: string): string {
    return this.#port.getUserShopName(userId, defaultName);
  }

  asyncFollow(userId: string): void {
    this.#port.asyncFollow(userId);
  }

  asyncUnfollow(userId: string): void {
    this.#port.asyncUnfollow(userId);
  }

  async asyncGetIdolIds(): Promise<string[]> {
    return this.#port.asyncGetIdolIds();
  }

  isInGroup(groupId: string): boolean {
    return this.#port.isInGroup(groupId);
  }

  isInCommunity(communityId: string | null): boolean {
    return this.#port.isInCommunity(communityId);
  }

  isCommunityApplicationPending(): boolean {
    return this.#port.isCommunityApplicationPending();
  }

  isRoleApplicationPending(roleId: string): boolean {
    return this.#port.isRoleApplicationPending(roleId);
  }

  getGroupIds(): string[] {
    return this.#port.getGroupIds();
  }

  getCommunityId(): string | null {
    return this.#port.getCommunityId();
  }

  getRepresentativeId(): string | null {
    return this.#port.getRepresentativeId();
  }

  isBetaTester(): boolean {
    return this.#port.isBetaTester();
  }

  hasDomain(): boolean {
    return this.#port.hasDomain();
  }

  getOutRequests(): OutRequest[] {
    return this.#port.getOutRequests();
  }

  getReferrerId(): string {
    return this.#port.getReferrerId();
  }

  getJournalIds(): string[] {
    return this.#port.getJournalIds();
  }

  getBlogProfile(): BlogStatisticsData | null {
    return this.#port.getBlogProfile();
  }

  getGuestName(): string {
    return this.#port.getGuestName();
  }

  getGuestContact(): string {
    return this.#port.getGuestContact();
  }

  setGuestName(name: string): void {
    this.#port.setGuestName(name);
  }

  setGuestContact(contact: string): void {
    this.#port.setGuestContact(contact);
  }

  getAddressIds(): string[] {
    return this.#port.getAddressIds();
  }

  resetAddressIds(ids: string[]): void {
    this.#port.resetAddressIds(ids);
  }

  getOrder(id: string): CustomerOrder | null {
    return this.#port.getOrder(id);
  }

  updateOrder(order: CustomerOrder): void {
    this.#port.updateOrder(order);
  }

  getLiveStreamKey(): string | null {
    return this.#port.getLiveStreamKey();
  }

  setLiveStreamKey(key: string | null): void {
    this.#port.setLiveStreamKey(key);
  }

  reset(profile?: unknown): void {
    this.#port.reset(profile);
  }

  asyncReload(): void {
    this.#port.asyncReload();
  }

  setPublishers(agents: PublisherAgent[]): void {
    this.web3?.setPublishers(agents);
  }

  setStorage(agent: StorageAgent): void {
    this.web3?.setStorage(agent);
  }
}

export const Account = new AccountWrapper();
