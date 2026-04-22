import type { AccountPort, Web3AccountFacet } from './AccountPort.js';
import type { User as UserType } from '../../types/user.js';
import type { MarkInfo } from '../../types/basic.js';
import {
  Owner as Web3Owner,
  type PublisherAgent,
  type OwnerProps,
  dat as Web3Dat,
  StorageAgent,
} from '../plt/PpApiTypes.js';
import type { CustomerOrder } from '../datatypes/CustomerOrder.js';

function uint8ToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

type OwnerResetArg = Parameters<InstanceType<typeof Web3Owner>['reset']>[0];

export class Web3OwnerAdapter implements AccountPort, Web3AccountFacet {
  readonly #owner: Web3Owner;

  constructor(owner: Web3Owner) {
    this.#owner = owner;
  }

  get web3Owner(): Web3Owner {
    return this.#owner;
  }

  isAuthenticated(): boolean {
    return this.#owner.isAuthenticated();
  }

  isWebOwner(): boolean {
    return this.#owner.isWebOwner();
  }

  getId(): string | null {
    const id = this.#owner.getId();
    return id || null;
  }

  setUserId(_id: string | null): void {}

  getNickname(): string {
    return this.#owner.getNickname();
  }

  getPreferredLanguage(): string | null {
    return null;
  }

  isFollowing(userId: string): boolean {
    return this.#owner.isFollowing(userId);
  }

  isIdolOf(user: UserType): boolean {
    return user.hasIdol(this.#owner.getId() ?? '');
  }

  isFollowedByWebOwner(): boolean {
    return false;
  }

  getIdols() {
    return [];
  }

  getUserNickname(userId: string | null, defaultNickname?: string): string {
    if (!userId) {
      return defaultNickname || '';
    }
    return this.#owner.getUserNickname(userId, defaultNickname || '');
  }

  getUserShopName(_userId: string | null, defaultName: string): string {
    return defaultName;
  }

  asyncFollow(userId: string): void {
    this.#owner.asyncFollow(userId);
  }

  asyncUnfollow(userId: string): void {
    this.#owner.asyncUnfollow(userId);
  }

  async asyncGetIdolIds(): Promise<string[]> {
    return this.#owner.asyncGetIdolIds();
  }

  isInGroup(_groupId: string): boolean {
    return false;
  }

  isInCommunity(_communityId: string | null): boolean {
    return false;
  }

  isCommunityApplicationPending(): boolean {
    return false;
  }

  isRoleApplicationPending(_roleId: string): boolean {
    return false;
  }

  getGroupIds(): string[] {
    return [];
  }

  getCommunityId(): string | null {
    return null;
  }

  getRepresentativeId(): string | null {
    return null;
  }

  isBetaTester(): boolean {
    return false;
  }

  hasDomain(): boolean {
    return false;
  }

  getOutRequests() {
    return [];
  }

  getReferrerId(): string {
    return '';
  }

  getJournalIds(): string[] {
    return [];
  }

  getBlogProfile() {
    return null;
  }

  getGuestName(): string {
    return '';
  }

  getGuestContact(): string {
    return '';
  }

  setGuestName(_name: string): void {}

  setGuestContact(_contact: string): void {}

  getAddressIds(): string[] {
    return [];
  }

  resetAddressIds(_ids: string[]): void {}

  getOrder(_id: string) {
    return null;
  }

  updateOrder(_order: CustomerOrder): void {}

  getLiveStreamKey(): string | null {
    return null;
  }

  setLiveStreamKey(_key: string | null): void {}

  reset(profile?: unknown): void {
    this.#owner.reset((profile ?? null) as OwnerResetArg);
  }

  asyncReload(): void {
    this.#owner.asyncReload();
  }

  setProps(props: OwnerProps): void {
    this.#owner.setProps(props);
  }

  loadCheckPoint(): void {
    this.#owner.loadCheckPoint();
  }

  saveCheckPoint(): void {
    this.#owner.saveCheckPoint();
  }

  getPublicKeyDisplay(): string {
    return uint8ToHex(this.#owner.getPublicKey());
  }

  getIconUrl(): string {
    return this.#owner.getIconUrl();
  }

  getProfile(): Record<string, unknown> {
    const p = this.#owner.getProfile();
    return p && typeof p === 'object' ? (p as Record<string, unknown>) : {};
  }

  hasPublished(): boolean {
    return this.#owner.hasPublished();
  }

  async asPublishArticle(article: Web3Dat.OArticle): Promise<void> {
    await this.#owner.asPublishArticle(article);
  }

  async asComment(threadId: string, article: Web3Dat.OArticle, asPost: boolean): Promise<void> {
    await this.#owner.asComment(threadId, article, asPost);
  }

  async asLike(itemId: string): Promise<void> {
    await this.#owner.asLike(itemId);
  }

  async asUnlike(itemId: string): Promise<void> {
    await this.#owner.asUnlike(itemId);
  }

  async asUploadFile(file: File): Promise<string> {
    return this.#owner.asUploadFile(file);
  }

  async asUpdateProfile(profile: unknown, cids: string[]): Promise<void> {
    await this.#owner.asUpdateProfile(profile, cids);
  }

  async asRegister(agent: PublisherAgent, name: string): Promise<void> {
    await this.#owner.asRegister(agent, name);
  }

  setPublishers(agents: PublisherAgent[]): void {
    this.#owner.setPublishers(agents);
  }

  setStorage(agent: StorageAgent): void {
    this.#owner.setStorage(agent);
  }

  async asyncFindMark(itemId: string): Promise<MarkInfo | null> {
    return this.#owner.asyncFindMark(itemId);
  }
}
