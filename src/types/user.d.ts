import type { ColorTheme } from './basic.js';
import type { BlogConfig } from './blog.js';

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
  getId(): string | null | undefined;

  /**
   * Get the user's display nickname
   * @returns The nickname, or username as fallback, or empty string/undefined
   */
  getNickname(): string | undefined;

  /**
   * Get the user's username
   * @returns The username, or null/undefined if not available
   */
  getUsername(): string | null | undefined;

  /**
   * Get the URL of the user's icon/avatar
   * @returns The icon URL, or empty string/null if not available
   */
  getIconUrl(): string | null;

  /**
   * Get the URL of the user's logo
   * @returns The logo URL, or null/undefined if not available
   */
  getLogoUrl?(): string | null | undefined;

  /**
   * Get the user's domain URL
   * @returns The domain URL, or null/undefined if not available
   */
  getDomainUrl?(): string | null | undefined;

  /**
   * Get the user's color theme
   * @returns The ColorTheme object, or null if not available
   */
  getColorTheme?(): ColorTheme | null;

  /**
   * Get the user's background color
   * @returns The background color as a string, or empty string/null/undefined
   */
  getBackgroundColor?(): string | null | undefined;

  getCommunityId?(): string | undefined;

  getShopName?(): string | undefined;

  getBlogConfig?(): BlogConfig | null;

  getNIdols?(): number | undefined;

  getNFollowers?(): number | undefined;

  getImageUrl?(): string | undefined;

  getBriefBiography?(): string | undefined;

  /**
   * Check if the user is following the current logged-in user
   * @returns true if following, false otherwise
   */
  isFollowingUser?(): boolean;

  /**
   * Check if the user's workshop is open
   * @returns true if workshop is open, false otherwise
   */
  isWorkshopOpen?(): boolean;

  /**
   * Check if the user's shop is open
   * @returns true if shop is open, false otherwise
   */
  isShopOpen?(): boolean;

  /**
   * Check if this is a feed user
   * @returns true if this is a feed, false otherwise
   */
  isFeed?(): boolean;

  /**
   * Web3-specific: Set the data source for the user
   * @param source The data source object
   */
  setDataSource?(source: unknown): void;

  /**
   * Web3-specific: Set the delegate for the user
   * @param delegate The delegate object
   */
  setDelegate?(delegate: unknown): void;
}
