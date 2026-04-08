import type { User as UserType } from '../../types/user.js';
import type { ColorTheme, MarkInfo } from '../../types/basic.js';
import type { BlogConfig } from '../../types/blog.js';
import { User as Web3User, type UserProps } from 'pp-api';

/**
 * Wraps pp-api {@link Web3User} as app {@link UserType} for resolved peer profiles in web3.
 * Pairs conceptually with {@link Web3OwnerAdapter} (owner account / chain facet).
 */
export class Web3UserAdapter implements UserType {
  readonly #user: Web3User;

  constructor(user: Web3User) {
    this.#user = user;
  }

  hasIdol(userId: string): boolean {
    return this.#user.hasIdol(userId);
  }

  get web3User(): Web3User {
    return this.#user;
  }

  getId(): string {
    return this.#user.getId();
  }

  getNickname(): string {
    return this.#user.getNickname();
  }

  getUsername(): string {
    return this.#user.getUsername();
  }

  getIconUrl(): string {
    return this.#user.getIconUrl();
  }

  getLogoUrl(): string {
    return this.#user.getLogoUrl();
  }

  getDomainUrl(): string {
    return this.#user.getDomainUrl();
  }

  getColorTheme(): ColorTheme | null {
    return this.#user.getColorTheme() as ColorTheme | null;
  }

  getBackgroundColor(): string | null {
    return this.#user.getBackgroundColor();
  }

  getCommunityId(): string {
    return this.#user.getCommunityId();
  }

  getShopName(): string {
    return this.#user.getShopName();
  }

  getBlogConfig(): BlogConfig | null {
    return this.#user.getBlogConfig() as BlogConfig | null;
  }

  getNIdols(): number {
    return this.#user.getNIdols();
  }

  getNFollowers(): number {
    return this.#user.getNFollowers();
  }

  getInfoImageUrl(): string {
    return this.#user.getInfoImageUrl();
  }

  getBriefBio(): string {
    return this.#user.getBriefBio();
  }

  getReferrerId(): string | null {
    return null;
  }

  isFollowingUser(): boolean {
    return this.#user.isFollowingUser();
  }

  isWorkshopOpen(): boolean {
    return this.#user.isWorkshopOpen();
  }

  isShopOpen(): boolean {
    return this.#user.isShopOpen();
  }

  isFeed(): boolean {
    return this.#user.isFeed();
  }

  setProps(props: UserProps): void {
    this.#user.setProps(props);
  }

  async asyncFindMark(key: string): Promise<MarkInfo | null> {
    return this.#user.asyncFindMark(key);
  }

  async asyncLoadMorePostInfos(idRecord: { getNextSegmentId(): number }): Promise<unknown[] | void> {
    return this.#user.asyncLoadMorePostInfos(idRecord);
  }
}
