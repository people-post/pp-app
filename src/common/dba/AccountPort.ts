import type { User as UserType } from '../../types/user.js';
import type { MarkInfo } from '../../types/basic.js';
import type { IdolData, OutRequest, BlogStatisticsData } from '../../types/backend2.js';
import type { OwnerProps, PublisherAgent, StorageAgent } from '../plt/PpApiTypes.js';
import type { dat as Web3Dat } from '../plt/PpApiTypes.js';
import type { CustomerOrder } from '../datatypes/CustomerOrder.js';

/**
 * Cross-mode account operations shared by web2 (server-backed session) and web3 (owner).
 */
export interface AccountPort {
  isAuthenticated(): boolean;
  isWebOwner(): boolean;
  isFollowing(userId: string): boolean;
  isIdolOf(user: UserType): boolean;
  isFollowedByWebOwner(): boolean;
  isInGroup(groupId: string): boolean;
  isInCommunity(communityId: string | null): boolean;
  isCommunityApplicationPending(): boolean;
  isRoleApplicationPending(roleId: string): boolean;
  isBetaTester(): boolean;

  hasDomain(): boolean;

  getId(): string | null;
  getNickname(): string;
  getPreferredLanguage(): string | null;
  getIdols(): IdolData[];
  getUserNickname(userId: string, defaultNickname?: string): string;
  getUserShopName(userId: string, defaultName: string): string;
  getGroupIds(): string[];
  getCommunityId(): string | null;
  getRepresentativeId(): string | null;
  getOutRequests(): OutRequest[];
  getReferrerId(): string;
  getJournalIds(): string[];
  getBlogProfile(): BlogStatisticsData | null;
  getGuestName(): string;
  getGuestContact(): string;
  getAddressIds(): string[];
  getOrder(id: string): CustomerOrder | null;
  getLiveStreamKey(): string | null;

  setUserId(id: string | null): void;
  setGuestName(name: string): void;
  setGuestContact(contact: string): void;
  setLiveStreamKey(key: string | null): void;

  asyncFollow(userId: string): void;
  asyncUnfollow(userId: string): void;
  asyncGetIdolIds(): Promise<string[]>;
  asyncReload(): void;

  resetAddressIds(ids: string[]): void;
  updateOrder(order: CustomerOrder): void;
  /** Web2: private profile; web3: owner checkpoint JSON / resolved data (opaque). */
  reset(profile?: unknown): void;
}

/**
 * Chain / Owner-only capabilities. Exposed as {@link AccountWrapper.web3}; null in web2 mode.
 */
export interface Web3AccountFacet {
  hasPublished(): boolean;

  /** Human-readable encoding of the posting public key (for UI). */
  getPublicKeyDisplay(): string;
  getIconUrl(): string;
  getProfile(): Record<string, unknown>;

  setProps(props: OwnerProps): void;
  /** Selected publisher agents used for publishing (Owner internal list). */
  setPublishers(agents: PublisherAgent[]): void;
  setStorage(agent: StorageAgent): void;

  asPublishArticle(article: Web3Dat.OArticle): Promise<void>;
  asComment(threadId: string, article: Web3Dat.OArticle, asPost: boolean): Promise<void>;
  asLike(itemId: string): Promise<void>;
  asUnlike(itemId: string): Promise<void>;
  asUploadFile(file: File): Promise<string>;
  asUpdateProfile(profile: unknown, cids: string[]): Promise<void>;
  asRegister(agent: PublisherAgent, name: string): Promise<void>;
  /** Owner marks for an item (like / comments index); delegates to pp-api Owner.asyncFindMark. */
  asyncFindMark(itemId: string): Promise<MarkInfo | null>;

  loadCheckPoint(): void;
  saveCheckPoint(): void;
}
