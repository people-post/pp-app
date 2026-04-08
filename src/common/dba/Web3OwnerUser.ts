import type { User as UserType } from '../../types/user.js';
import type { ColorTheme, MarkInfo } from '../../types/basic.js';
import type { BlogConfig } from '../../types/blog.js';
import { Owner as Web3Owner, type OwnerProps, type UserProps } from 'pp-api';

/**
 * Adapts a Web3 {@link Web3Owner} to the app-wide {@link UserType} so it can be
 * used wherever web2 {@link User} instances appear (e.g. {@link Users.get}).
 */
export class Web3OwnerUser implements UserType {
  readonly #owner: Web3Owner;

  constructor(owner: Web3Owner) {
    this.#owner = owner;
  }

  getWeb3Owner(): Web3Owner {
    return this.#owner;
  }

  getId(): string {
    return this.#owner.getId();
  }

  getNickname(): string {
    return this.#owner.getNickname();
  }

  getUsername(): string {
    return this.#owner.getUsername();
  }

  getIconUrl(): string {
    return this.#owner.getIconUrl();
  }

  getLogoUrl(): string {
    return this.#owner.getLogoUrl();
  }

  getDomainUrl(): string {
    return this.#owner.getDomainUrl();
  }

  getColorTheme(): ColorTheme | null {
    return this.#owner.getColorTheme() as ColorTheme | null;
  }

  getBackgroundColor(): string | null {
    return this.#owner.getBackgroundColor();
  }

  getCommunityId(): string {
    return this.#owner.getCommunityId();
  }

  getShopName(): string {
    return this.#owner.getShopName();
  }

  getBlogConfig(): BlogConfig | null {
    return this.#owner.getBlogConfig() as BlogConfig | null;
  }

  getNIdols(): number {
    return this.#owner.getNIdols();
  }

  getNFollowers(): number {
    return this.#owner.getNFollowers();
  }

  getInfoImageUrl(): string {
    return this.#owner.getInfoImageUrl();
  }

  getBriefBio(): string {
    return this.#owner.getBriefBio();
  }

  getReferrerId(): string | null {
    return null;
  }

  isFollowingUser(): boolean {
    return this.#owner.isFollowingUser();
  }

  isWorkshopOpen(): boolean {
    return this.#owner.isWorkshopOpen();
  }

  isShopOpen(): boolean {
    return this.#owner.isShopOpen();
  }

  isFeed(): boolean {
    return this.#owner.isFeed();
  }

  setProps(props: UserProps): void {
    this.#owner.setProps(props as OwnerProps);
  }

  async asyncFindMark(key: string): Promise<MarkInfo | null> {
    return this.#owner.asyncFindMark(key);
  }
}
