import { Web2Account } from './Web2Account.js';
import type { AccountPort } from './AccountPort.js';
import type { User as UserType } from '../../types/user.js';
import type { UserPrivateProfile } from '../../types/backend2.js';
import type { CustomerOrder } from '../datatypes/CustomerOrder.js';

export class Web2AccountAdapter implements AccountPort {
  readonly #inner: Web2Account;

  constructor(inner: Web2Account) {
    this.#inner = inner;
  }

  get web2Account(): Web2Account {
    return this.#inner;
  }

  isAuthenticated(): boolean {
    return this.#inner.isAuthenticated();
  }

  isWebOwner(): boolean {
    return this.#inner.isWebOwner();
  }

  getId(): string | null {
    return this.#inner.getId();
  }

  setUserId(id: string | null): void {
    this.#inner.setUserId(id);
  }

  getNickname(): string {
    return this.#inner.getNickname();
  }

  getPreferredLanguage(): string | null {
    return this.#inner.getPreferredLanguage();
  }

  isFollowing(userId: string): boolean {
    return this.#inner.isFollowing(userId);
  }

  isIdolOf(user: UserType): boolean {
    return this.#inner.isIdolOf(user);
  }

  isFollowedByWebOwner(): boolean {
    return this.#inner.isFollowedByWebOwner();
  }

  getIdols() {
    return this.#inner.getIdols();
  }

  getUserNickname(userId: string, defaultNickname?: string): string {
    return this.#inner.getUserNickname(userId, defaultNickname || '');
  }

  getUserShopName(userId: string, defaultName: string): string {
    return this.#inner.getUserShopName(userId, defaultName);
  }

  asyncFollow(userId: string): void {
    this.#inner.asyncFollow(userId);
  }

  asyncUnfollow(userId: string): void {
    this.#inner.asyncUnfollow(userId);
  }

  async asyncGetIdolIds(): Promise<string[]> {
    return [];
  }

  isInGroup(groupId: string): boolean {
    return this.#inner.isInGroup(groupId);
  }

  isInCommunity(communityId: string | null): boolean {
    return this.#inner.isInCommunity(communityId);
  }

  isCommunityApplicationPending(): boolean {
    return this.#inner.isCommunityApplicationPending();
  }

  isRoleApplicationPending(roleId: string): boolean {
    return this.#inner.isRoleApplicationPending(roleId);
  }

  getGroupIds(): string[] {
    return this.#inner.getGroupIds();
  }

  getCommunityId(): string | null {
    return this.#inner.getCommunityId();
  }

  getRepresentativeId(): string | null {
    return this.#inner.getRepresentativeId();
  }

  isBetaTester(): boolean {
    return this.#inner.isBetaTester();
  }

  hasDomain(): boolean {
    return this.#inner.hasDomain();
  }

  getOutRequests() {
    return this.#inner.getOutRequests();
  }

  getReferrerId(): string {
    return this.#inner.getReferrerId();
  }

  getJournalIds(): string[] {
    return this.#inner.getJournalIds();
  }

  getBlogProfile() {
    return this.#inner.getBlogProfile();
  }

  getGuestName(): string {
    return this.#inner.getGuestName();
  }

  getGuestContact(): string {
    return this.#inner.getGuestContact();
  }

  setGuestName(name: string): void {
    this.#inner.setGuestName(name);
  }

  setGuestContact(contact: string): void {
    this.#inner.setGuestContact(contact);
  }

  getAddressIds(): string[] {
    return this.#inner.getAddressIds();
  }

  resetAddressIds(ids: string[]): void {
    this.#inner.resetAddressIds(ids);
  }

  getOrder(id: string) {
    return this.#inner.getOrder(id);
  }

  updateOrder(order: CustomerOrder): void {
    this.#inner.updateOrder(order);
  }

  getLiveStreamKey(): string | null {
    return this.#inner.getLiveStreamKey();
  }

  setLiveStreamKey(key: string | null): void {
    this.#inner.setLiveStreamKey(key);
  }

  reset(profile?: unknown): void {
    this.#inner.reset((profile ?? null) as UserPrivateProfile | null);
  }

  asyncReload(): void {
    this.#inner.asyncReload();
  }
}
