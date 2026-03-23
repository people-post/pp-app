import type { User as UserType } from '../../types/user.js';
import type { MarkInfo } from '../../types/basic.js';
import type { IdolData, OutRequest, BlogStatisticsData } from '../../types/backend2.js';
import type { OwnerProps, PublisherAgent } from 'pp-api';
import type { dat as Web3Dat } from 'pp-api';
import type { CustomerOrder } from '../datatypes/CustomerOrder.js';

/**
 * Cross-mode account operations shared by web2 (server-backed session) and web3 (owner).
 */
export interface AccountPort {
  isAuthenticated(): boolean;
  isWebOwner(): boolean;
  getId(): string | null;
  setUserId(id: string | null): void;
  getNickname(): string;
  getPreferredLanguage(): string | null;
  isFollowing(userId: string): boolean;
  isIdolOf(user: UserType): boolean;
  isFollowedByWebOwner(): boolean;
  getIdols(): IdolData[];
  getUserNickname(userId: string, defaultNickname?: string): string;
  getUserShopName(userId: string, defaultName: string): string;
  asyncFollow(userId: string): void;
  asyncUnfollow(userId: string): void;
  asyncGetIdolIds(): Promise<string[]>;
  isInGroup(groupId: string): boolean;
  isInCommunity(communityId: string | null): boolean;
  isCommunityApplicationPending(): boolean;
  isRoleApplicationPending(roleId: string): boolean;
  getGroupIds(): string[];
  getCommunityId(): string | null;
  getRepresentativeId(): string | null;
  isBetaTester(): boolean;
  hasDomain(): boolean;
  getOutRequests(): OutRequest[];
  getReferrerId(): string;
  getJournalIds(): string[];
  getBlogProfile(): BlogStatisticsData | null;
  getGuestName(): string;
  getGuestContact(): string;
  setGuestName(name: string): void;
  setGuestContact(contact: string): void;
  getAddressIds(): string[];
  resetAddressIds(ids: string[]): void;
  getOrder(id: string): CustomerOrder | null;
  updateOrder(order: CustomerOrder): void;
  getLiveStreamKey(): string | null;
  setLiveStreamKey(key: string | null): void;
  /** Web2: private profile; web3: owner checkpoint JSON / resolved data (opaque). */
  reset(profile?: unknown): void;
  asyncReload(): void;
}

/**
 * Chain / Owner-only capabilities. Exposed as {@link AccountWrapper.web3}; null in web2 mode.
 */
export interface Web3AccountFacet {
  setProps(props: OwnerProps): void;
  loadCheckPoint(): void;
  saveCheckPoint(): void;
  /** Human-readable encoding of the posting public key (for UI). */
  getPublicKeyDisplay(): string;
  getIconUrl(): string;
  getProfile(): Record<string, unknown>;
  hasPublished(): boolean;
  asPublishArticle(article: Web3Dat.OArticle): Promise<void>;
  asComment(threadId: string, article: Web3Dat.OArticle, asPost: boolean): Promise<void>;
  asLike(itemId: string): Promise<void>;
  asUnlike(itemId: string): Promise<void>;
  asUploadFile(file: File): Promise<string>;
  asUpdateProfile(profile: unknown, cids: string[]): Promise<void>;
  asRegister(agent: PublisherAgent, name: string): Promise<void>;
  /** Owner marks for an item (like / comments index); delegates to pp-api Owner.asyncFindMark. */
  asyncFindMark(itemId: string): Promise<MarkInfo | null>;
}
