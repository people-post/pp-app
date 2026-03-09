import type { ColorTheme } from './basic.js';
import type { BlogConfig } from './blog.js';
import type { UserProps } from 'pp-api';

/**
 * Common interface for User objects returned by Users.
 * This interface ensures that both User (from datatypes/User) and PpUser (from pp-api)
 * can be used interchangeably when returned from Users.get() or Users.asyncGet().
 */
export interface User {
  /**
   * Get the unique identifier of the user
   * @returns The user's UUID or ID, or null/undefined if not available
   */
  getId(): string;

  /**
   * Get the user's display nickname
   * @returns The nickname, or username as fallback, or empty string/undefined
   */
  getNickname(): string;

  /**
   * Get the user's username
   * @returns The username, or null/undefined if not available
   */
  getUsername(): string | null;

  /**
   * Get the URL of the user's icon/avatar
   * @returns The icon URL, or empty string/null if not available
   */
  getIconUrl(): string;

  /**
   * Get the URL of the user's logo
   * @returns The logo URL, or null/undefined if not available
   */
  getLogoUrl(): string | null;

  /**
   * Get the user's domain URL
   * @returns The domain URL, or null/undefined if not available
   */
  getDomainUrl(): string | null;

  /**
   * Get the user's color theme
   * @returns The ColorTheme object, or null if not available
   */
  getColorTheme(): ColorTheme | null;

  /**
   * Get the user's background color
   * @returns The background color as a string, or empty string/null/undefined
   */
  getBackgroundColor(): string | null;

  getCommunityId(): string | null;

  getShopName(): string | null;

  getBlogConfig(): BlogConfig | null;

  getNIdols(): number;

  getNFollowers(): number;

  getInfoImageUrl(): string | null;

  getBriefBio(): string | null;

  /**
   * Check if the user is following the current logged-in user
   * @returns true if following, false otherwise
   */
  isFollowingUser(): boolean;

  /**
   * Check if the user's workshop is open
   * @returns true if workshop is open, false otherwise
   */
  isWorkshopOpen(): boolean;

  /**
   * Check if the user's shop is open
   * @returns true if shop is open, false otherwise
   */
  isShopOpen(): boolean;

  /**
   * Check if this is a feed user
   * @returns true if this is a feed, false otherwise
   */
  isFeed(): boolean;

  /**
   * Web3-specific: Set props (callbacks, data) for the user
   */
  setProps?(props: UserProps): void;
}
