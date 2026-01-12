/**
 * Blog-related type definitions
 */

/**
 * SocialItemId interface representing the public API of the SocialItemId class
 */
export interface SocialItemId {
  /**
   * Get the value (ID) of the social item
   * @returns The value as a string, or null if not available
   */
  getValue(): string | null;

  /**
   * Get the type of the social item
   * @returns The type as a string, or null if not available
   */
  getType(): string | null;

  /**
   * Set the value (ID) of the social item
   * @param v The value to set
   */
  setValue(v: string | null): void;

  /**
   * Set the type of the social item
   * @param t The type to set
   */
  setType(t: string | null): void;

  /**
   * Convert the social item ID to an encoded string
   * @returns The encoded string representation
   */
  toEncodedStr(): string;
}

/**
 * BlogConfig data structure
 */
export interface BlogConfigData {
  is_social_action_enabled?: boolean;
  pinned_items?: Array<{ id: string; type: string }>;
  item_layout?: { type: string };
  pinned_item_layout?: { type: string };
  [key: string]: unknown;
}

/**
 * BlogConfig interface representing the public API of the BlogConfig class
 */
export interface BlogConfig {
  /**
   * Check if social actions are enabled
   * @returns true if social actions are enabled, false otherwise
   */
  isSocialActionEnabled(): boolean;

  /**
   * Check if a post is pinned
   * @param postId The post ID to check
   * @returns true if the post is pinned, false otherwise
   */
  isPostPinned(postId: string): boolean;

  /**
   * Get the list of pinned post IDs
   * @returns An array of SocialItemId objects representing pinned posts
   */
  getPinnedPostIds(): SocialItemId[];

  /**
   * Get the layout type for regular items
   * @returns The layout type as a string
   */
  getItemLayoutType(): string;

  /**
   * Get the layout type for pinned items
   * @returns The layout type as a string
   */
  getPinnedItemLayoutType(): string;

  /**
   * Get the layout type for a specific post
   * @param postId The post ID to get the layout type for
   * @returns The layout type as a string
   */
  getPostLayoutType(postId: string): string;
}
