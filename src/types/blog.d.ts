/**
 * Blog-related type definitions
 */

import type { SocialItem, SocialItemId } from './basic.js';

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

/**
 * Post interface for social posts
 */
export interface Post extends SocialItem {
  /**
   * Check if this post is a repost
   * @returns true if the post is a repost
   */
  isRepost(): boolean;

  /**
   * Check if this post is editable
   * @returns true if the post is editable
   */
  isEditable(): boolean;

  /**
   * Check if this post is socialable (can be liked, commented, etc.)
   * @returns true if the post is socialable
   */
  isSocialable(): boolean;

  /**
   * Check if this post is pinnable
   * @returns true if the post is pinnable
   */
  isPinnable(): boolean;

  /**
   * Get the owner ID of the post
   * @returns The owner ID or null
   */
  getOwnerId(): string | null;

  /**
   * Get the author ID of the post
   * @returns The author ID or null
   */
  getAuthorId(): string | null;

  /**
   * Get the link target of the post
   * @returns The link target or null
   */
  getLinkTo(): string | null;

  /**
   * Get the link target as a SocialItemId
   * @returns The SocialItemId or null
   */
  getLinkToSocialId(): SocialItemId | null;

  /**
   * Get the social ID of this post
   * @returns The SocialItemId
   */
  getSocialId(): SocialItemId;

  /**
   * Get the visibility of the post
   * @returns The visibility string or null
   */
  getVisibility(): string | null;

  /**
   * Get comment tags associated with this post
   * @returns Array of comment tag IDs
   */
  getCommentTags(): string[];

  /**
   * Get hashtag IDs associated with this post
   * @returns Array of hashtag IDs
   */
  getHashtagIds(): string[];

  /**
   * Get tagged comment IDs for a specific tag
   * @param tagId The tag ID to get comments for
   * @returns Array of SocialItemIds for tagged comments
   */
  getTaggedCommentIds(tagId: string): SocialItemId[];
}

/**
 * JournalIssue interface for journal issues
 */
export interface JournalIssue extends Post {
  /**
   * Check if this is a draft issue
   * @returns true if the issue is a draft
   */
  isDraft(): boolean;

  /**
   * Check if this issue contains a specific post
   * @param id The post ID to check
   * @returns true if the issue contains the post
   */
  containsPost(id: string): boolean;

  /**
   * Get the journal ID
   * @returns The journal ID or undefined
   */
  getJournalId(): string | undefined;

  /**
   * Get the issue ID
   * @returns The issue ID or undefined
   */
  getIssueId(): string | undefined;

  /**
   * Get the abstract of the issue
   * @returns The abstract or undefined
   */
  getAbstract(): string | undefined;

  /**
   * Get the summary of the issue
   * @returns The summary or undefined
   */
  getSummary(): string | undefined;

  /**
   * Get tag IDs associated with this issue
   * @returns Array of tag IDs or undefined
   */
  getTagIds(): string[] | undefined;

  /**
   * Get sections of the journal issue
   * @returns Array of JournalIssueSection objects
   */
  getSections(): unknown[];
}
