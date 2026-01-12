/**
 * Blog-related type definitions
 */

import type { SocialItemId } from './basic.js';

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
