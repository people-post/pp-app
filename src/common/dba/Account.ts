/**
 * Account wrapper that provides a unified interface for both Web2 and Web3 accounts.
 * This module exports a singleton Account instance that wraps the underlying
 * Web2Account or Web3 Owner instance.
 */

import { Web2Account } from './Web2Account.js';
import type { User } from '../datatypes/User.js';
import type { CustomerOrder } from '../datatypes/CustomerOrder.js';

// Web3 Owner type from pp-api (imported dynamically in WcWeb3)
interface Web3Owner {
  // Authentication
  isAuthenticated(): boolean;
  getId(): string | null;
  
  // Profile
  getNickname(): string;
  getPublicKey?(): string;
  getIconUrl?(): string;
  getProfile?(): Record<string, unknown>;
  getPreferredLanguage?(): string | null;
  getLiveStreamKey?(): string | null;
  
  // Social
  isFollowing?(userId: string): boolean;
  isIdolOf?(user: User): boolean;
  getUserNickname?(userId: string, defaultNickname?: string): string;
  asyncGetIdolIds?(): Promise<string[]>;
  
  // Web3-specific methods
  setDataSource?(source: unknown): void;
  setDelegate?(delegate: unknown): void;
  loadCheckPoint?(): void;
  saveCheckPoint?(): void;
  reset?(profile?: unknown): void;
  
  // Publishing
  asPublishArticle?(article: unknown): Promise<void>;
  asComment?(threadId: string, article: unknown, asPost: (article: unknown) => Promise<unknown>): Promise<void>;
  asLike?(itemId: string): Promise<void>;
  asUnlike?(itemId: string): Promise<void>;
  asUploadFile?(file: File): Promise<string>;
  asUpdateProfile?(profile: unknown, cids: string[]): Promise<void>;
  asRegister?(agent: unknown, name: string): Promise<void>;
  hasPublished?(): boolean;
  
  // Index signature for additional properties
  [key: string]: unknown;
}

type AccountImplementation = Web2Account | Web3Owner;

/**
 * Idol type representing a followed user
 */
interface Idol {
  user_id: string;
  nickname?: string;
}

/**
 * OutRequest type for pending group/role applications
 */
interface OutRequest {
  target_group_id: string;
}

/**
 * Blog profile type
 */
interface BlogProfile {
  [key: string]: unknown;
}

/**
 * Account wrapper class that provides a unified interface for both Web2 and Web3 accounts.
 */
class AccountWrapper {
  #impl: AccountImplementation;
  #isWeb3: boolean = false;

  constructor() {
    // Initialize with Web2Account by default
    this.#impl = new Web2Account();
    this.#isWeb3 = false;
  }

  /**
   * Set the underlying account implementation.
   * Use this to switch between Web2Account and Web3 Owner.
   */
  setImplementation(impl: AccountImplementation, isWeb3: boolean = false): void {
    this.#impl = impl;
    this.#isWeb3 = isWeb3;
  }

  /**
   * Get the underlying implementation (for cases where direct access is needed)
   */
  getImplementation(): AccountImplementation {
    return this.#impl;
  }

  /**
   * Check if using Web3 implementation
   */
  isWeb3Mode(): boolean {
    return this.#isWeb3;
  }

  // ==================== Authentication Methods ====================

  isAuthenticated(): boolean {
    return this.#impl.isAuthenticated();
  }

  isWebOwner(): boolean {
    if ('isWebOwner' in this.#impl && typeof this.#impl.isWebOwner === 'function') {
      return this.#impl.isWebOwner();
    }
    return false;
  }

  // ==================== Identity Methods ====================

  getId(): string | null {
    return this.#impl.getId();
  }

  setUserId(id: string | null): void {
    if ('setUserId' in this.#impl && typeof this.#impl.setUserId === 'function') {
      this.#impl.setUserId(id);
    }
  }

  getNickname(): string {
    if ('getNickname' in this.#impl && typeof this.#impl.getNickname === 'function') {
      return this.#impl.getNickname();
    }
    return '';
  }

  getPreferredLanguage(): string | null {
    if ('getPreferredLanguage' in this.#impl && typeof this.#impl.getPreferredLanguage === 'function') {
      return this.#impl.getPreferredLanguage();
    }
    return null;
  }

  // ==================== Social Methods ====================

  isFollowing(userId: string): boolean {
    if ('isFollowing' in this.#impl && typeof this.#impl.isFollowing === 'function') {
      return this.#impl.isFollowing(userId);
    }
    return false;
  }

  isIdolOf(user: User): boolean {
    if ('isIdolOf' in this.#impl && typeof this.#impl.isIdolOf === 'function') {
      return this.#impl.isIdolOf(user);
    }
    return false;
  }

  isFollowedByWebOwner(): boolean {
    if ('isFollowedByWebOwner' in this.#impl && typeof this.#impl.isFollowedByWebOwner === 'function') {
      return this.#impl.isFollowedByWebOwner();
    }
    return false;
  }

  getIdols(): Idol[] {
    if ('getIdols' in this.#impl && typeof this.#impl.getIdols === 'function') {
      return this.#impl.getIdols();
    }
    return [];
  }

  getUserNickname(userId: string, defaultNickname?: string): string {
    if ('getUserNickname' in this.#impl && typeof this.#impl.getUserNickname === 'function') {
      return this.#impl.getUserNickname(userId, defaultNickname || '');
    }
    return defaultNickname || '';
  }

  getUserShopName(userId: string, defaultName: string): string {
    if ('getUserShopName' in this.#impl && typeof this.#impl.getUserShopName === 'function') {
      return this.#impl.getUserShopName(userId, defaultName);
    }
    return defaultName;
  }

  asyncFollow(userId: string): void {
    if ('asyncFollow' in this.#impl && typeof this.#impl.asyncFollow === 'function') {
      this.#impl.asyncFollow(userId);
    }
  }

  asyncUnfollow(userId: string): void {
    if ('asyncUnfollow' in this.#impl && typeof this.#impl.asyncUnfollow === 'function') {
      this.#impl.asyncUnfollow(userId);
    }
  }

  async asyncGetIdolIds(): Promise<string[]> {
    if ('asyncGetIdolIds' in this.#impl && typeof this.#impl.asyncGetIdolIds === 'function') {
      return await this.#impl.asyncGetIdolIds();
    }
    return [];
  }

  // ==================== Group/Community Methods ====================

  isInGroup(groupId: string): boolean {
    if ('isInGroup' in this.#impl && typeof this.#impl.isInGroup === 'function') {
      return this.#impl.isInGroup(groupId);
    }
    return false;
  }

  isInCommunity(communityId: string | null): boolean {
    if ('isInCommunity' in this.#impl && typeof this.#impl.isInCommunity === 'function') {
      return this.#impl.isInCommunity(communityId);
    }
    return false;
  }

  isCommunityApplicationPending(): boolean {
    if ('isCommunityApplicationPending' in this.#impl && typeof this.#impl.isCommunityApplicationPending === 'function') {
      return this.#impl.isCommunityApplicationPending();
    }
    return false;
  }

  isRoleApplicationPending(roleId: string): boolean {
    if ('isRoleApplicationPending' in this.#impl && typeof this.#impl.isRoleApplicationPending === 'function') {
      return this.#impl.isRoleApplicationPending(roleId);
    }
    return false;
  }

  getGroupIds(): string[] {
    if ('getGroupIds' in this.#impl && typeof this.#impl.getGroupIds === 'function') {
      return this.#impl.getGroupIds();
    }
    return [];
  }

  getCommunityId(): string | null {
    if ('getCommunityId' in this.#impl && typeof this.#impl.getCommunityId === 'function') {
      return this.#impl.getCommunityId();
    }
    return null;
  }

  getRepresentativeId(): string | null {
    if ('getRepresentativeId' in this.#impl && typeof this.#impl.getRepresentativeId === 'function') {
      return this.#impl.getRepresentativeId();
    }
    return null;
  }

  // ==================== Profile/Settings Methods ====================

  isBetaTester(): boolean {
    if ('isBetaTester' in this.#impl && typeof this.#impl.isBetaTester === 'function') {
      return this.#impl.isBetaTester();
    }
    return false;
  }

  hasDomain(): boolean {
    if ('hasDomain' in this.#impl && typeof this.#impl.hasDomain === 'function') {
      return this.#impl.hasDomain();
    }
    return false;
  }

  getOutRequests(): OutRequest[] {
    if ('getOutRequests' in this.#impl && typeof this.#impl.getOutRequests === 'function') {
      return this.#impl.getOutRequests();
    }
    return [];
  }

  getReferrerId(): string {
    if ('getReferrerId' in this.#impl && typeof this.#impl.getReferrerId === 'function') {
      return this.#impl.getReferrerId();
    }
    return '';
  }

  // ==================== Blog Methods ====================

  getJournalIds(): string[] {
    if ('getJournalIds' in this.#impl && typeof this.#impl.getJournalIds === 'function') {
      return this.#impl.getJournalIds();
    }
    return [];
  }

  getBlogProfile(): BlogProfile | null {
    if ('getBlogProfile' in this.#impl && typeof this.#impl.getBlogProfile === 'function') {
      return this.#impl.getBlogProfile();
    }
    return null;
  }

  // ==================== Guest Methods ====================

  getGuestName(): string {
    if ('getGuestName' in this.#impl && typeof this.#impl.getGuestName === 'function') {
      return this.#impl.getGuestName();
    }
    return '';
  }

  getGuestContact(): string {
    if ('getGuestContact' in this.#impl && typeof this.#impl.getGuestContact === 'function') {
      return this.#impl.getGuestContact();
    }
    return '';
  }

  setGuestName(name: string): void {
    if ('setGuestName' in this.#impl && typeof this.#impl.setGuestName === 'function') {
      this.#impl.setGuestName(name);
    }
  }

  setGuestContact(contact: string): void {
    if ('setGuestContact' in this.#impl && typeof this.#impl.setGuestContact === 'function') {
      this.#impl.setGuestContact(contact);
    }
  }

  // ==================== Address Methods ====================

  getAddressIds(): string[] {
    if ('getAddressIds' in this.#impl && typeof this.#impl.getAddressIds === 'function') {
      return this.#impl.getAddressIds();
    }
    return [];
  }

  resetAddressIds(ids: string[]): void {
    if ('resetAddressIds' in this.#impl && typeof this.#impl.resetAddressIds === 'function') {
      this.#impl.resetAddressIds(ids);
    }
  }

  // ==================== Order Methods ====================

  getOrder(id: string): CustomerOrder | null {
    if ('getOrder' in this.#impl && typeof this.#impl.getOrder === 'function') {
      return this.#impl.getOrder(id);
    }
    return null;
  }

  updateOrder(order: CustomerOrder): void {
    if ('updateOrder' in this.#impl && typeof this.#impl.updateOrder === 'function') {
      this.#impl.updateOrder(order);
    }
  }

  // ==================== Live Stream Methods ====================

  getLiveStreamKey(): string | null {
    if ('getLiveStreamKey' in this.#impl && typeof this.#impl.getLiveStreamKey === 'function') {
      return this.#impl.getLiveStreamKey();
    }
    return null;
  }

  setLiveStreamKey(key: string | null): void {
    if ('setLiveStreamKey' in this.#impl && typeof this.#impl.setLiveStreamKey === 'function') {
      this.#impl.setLiveStreamKey(key);
    }
  }

  // ==================== State Management Methods ====================

  reset(profile?: unknown): void {
    if ('reset' in this.#impl && typeof this.#impl.reset === 'function') {
      this.#impl.reset(profile);
    }
  }

  asyncReload(): void {
    if ('asyncReload' in this.#impl && typeof this.#impl.asyncReload === 'function') {
      this.#impl.asyncReload();
    }
  }

  // ==================== Web3-specific Methods ====================

  setDataSource(source: unknown): void {
    if ('setDataSource' in this.#impl && typeof this.#impl.setDataSource === 'function') {
      this.#impl.setDataSource(source);
    }
  }

  setDelegate(delegate: unknown): void {
    if ('setDelegate' in this.#impl && typeof this.#impl.setDelegate === 'function') {
      this.#impl.setDelegate(delegate);
    }
  }

  loadCheckPoint(): void {
    if ('loadCheckPoint' in this.#impl && typeof this.#impl.loadCheckPoint === 'function') {
      this.#impl.loadCheckPoint();
    }
  }

  saveCheckPoint(): void {
    if ('saveCheckPoint' in this.#impl && typeof this.#impl.saveCheckPoint === 'function') {
      this.#impl.saveCheckPoint();
    }
  }

  getPublicKey(): string {
    if ('getPublicKey' in this.#impl && typeof this.#impl.getPublicKey === 'function') {
      return this.#impl.getPublicKey();
    }
    return '';
  }

  getIconUrl(): string {
    if ('getIconUrl' in this.#impl && typeof this.#impl.getIconUrl === 'function') {
      return this.#impl.getIconUrl();
    }
    return '';
  }

  getProfile(): Record<string, unknown> {
    if ('getProfile' in this.#impl && typeof this.#impl.getProfile === 'function') {
      return this.#impl.getProfile() || {};
    }
    return {};
  }

  hasPublished(): boolean {
    if ('hasPublished' in this.#impl && typeof this.#impl.hasPublished === 'function') {
      return this.#impl.hasPublished();
    }
    return false;
  }

  async asPublishArticle(article: unknown): Promise<void> {
    if ('asPublishArticle' in this.#impl && typeof this.#impl.asPublishArticle === 'function') {
      await this.#impl.asPublishArticle(article);
    }
  }

  async asComment(threadId: string, article: unknown, asPost: (article: unknown) => Promise<unknown>): Promise<void> {
    if ('asComment' in this.#impl && typeof this.#impl.asComment === 'function') {
      await this.#impl.asComment(threadId, article, asPost);
    }
  }

  async asLike(itemId: string): Promise<void> {
    if ('asLike' in this.#impl && typeof this.#impl.asLike === 'function') {
      await this.#impl.asLike(itemId);
    }
  }

  async asUnlike(itemId: string): Promise<void> {
    if ('asUnlike' in this.#impl && typeof this.#impl.asUnlike === 'function') {
      await this.#impl.asUnlike(itemId);
    }
  }

  async asUploadFile(file: File): Promise<string> {
    if ('asUploadFile' in this.#impl && typeof this.#impl.asUploadFile === 'function') {
      return await this.#impl.asUploadFile(file);
    }
    return '';
  }

  async asUpdateProfile(profile: unknown, cids: string[]): Promise<void> {
    if ('asUpdateProfile' in this.#impl && typeof this.#impl.asUpdateProfile === 'function') {
      await this.#impl.asUpdateProfile(profile, cids);
    }
  }

  async asRegister(agent: unknown, name: string): Promise<void> {
    if ('asRegister' in this.#impl && typeof this.#impl.asRegister === 'function') {
      await this.#impl.asRegister(agent, name);
    }
  }
}

/**
 * Singleton Account instance.
 * Import and use this directly instead of window.dba.Account.
 */
export const Account = new AccountWrapper();

/**
 * Export the AccountWrapper class for type declarations
 */
export type { AccountWrapper };
