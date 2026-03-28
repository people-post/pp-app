/**
 * Blog-related type definitions
 */

import type { SocialItem, SocialItemId, RemoteFile } from './basic.js';

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

  getId(): string | null;

  getOwnerId(): string | null;

  getAuthorId(): string | null;

  getLinkTo(): string | null;

  getLinkToSocialId(): SocialItemId | null;

  getSocialId(): SocialItemId;

  getVisibility(): string | null;

  getCommentTags(): string[];

  getHashtagIds(): string[];

  getTaggedCommentIds(tagId: string): SocialItemId[];

  getErrorCode(): string | null;
}

export interface JournalIssueSection {
  getId(): string | null;
  getPostSocialIds(): SocialItemId[];
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

  getJournalId(): string;

  getIssueId(): string | null;

  getAbstract(): string | null;

  getSummary(): string | null;

  getTagIds(): string[];

  getSections(): JournalIssueSection[];
}

/**
 * Article interface for articles
 */
export interface Article extends Post {
  /**
   * Check if this is a draft article
   * @returns true if the article is a draft
   */
  isDraft(): boolean;

  /**
   * Check if this article is a repost
   * @returns true if the article is a repost
   */
  isRepost(): boolean;

  /**
   * Check if this article is editable
   * @returns true if the article is editable
   */
  isEditable(): boolean;

  /**
   * Check if this article is socialable
   * @returns true if the article is socialable
   */
  isSocialable(): boolean;

  /**
   * Check if this article is pinnable
   * @returns true if the article is pinnable
   */
  isPinnable(): boolean;

  /**
   * Check if this article is a quote post
   * @returns true if the article is a quote post
   */
  isQuotePost(): boolean;

  /**
   * Get the link target of the article
   * @returns The link target or null
   */
  getLinkTo(): string | null;

  /**
   * Get the link type of the article
   * @returns The link type or null
   */
  getLinkType(): string | null;

  /**
   * Get the link target as a SocialItemId
   * @returns The SocialItemId
   */
  getLinkToSocialId(): SocialItemId;

  /**
   * Get the social item type
   * @returns The social item type as a string
   */
  getSocialItemType(): string;

  /**
   * Get the title of the article
   * @returns The title or null
   */
  getTitle(): string | null;

  /**
   * Get the content of the article
   * @returns The content or null
   */
  getContent(): string | null;

  /**
   * Get files associated with the article
   * @returns Array of RemoteFile objects
   */
  getFiles(): RemoteFile[];

  /**
   * Get the attachment file
   * @returns The RemoteFile attachment or null
   */
  getAttachment(): RemoteFile | null;

  /**
   * Get the visibility of the article
   * @returns The visibility string or null
   */
  getVisibility(): string | null;

  /**
   * Get the owner ID of the article
   * @returns The owner ID or null
   */
  getOwnerId(): string | null;

  /**
   * Get the author ID of the article
   * @returns The author ID or null
   */
  getAuthorId(): string | null;

  /**
   * Get tag IDs associated with this article
   * @returns Array of tag IDs
   */
  getTagIds(): string[];

  /**
   * Get the publish mode
   * @returns The publish mode
   */
  getPublishMode(): string;

  /**
   * Get pending author tag IDs
   * @returns Array of tag IDs
   */
  getPendingAuthorTagIds(): string[];

  /**
   * Get pending author new tag names
   * @returns Array of tag names
   */
  getPendingAuthorNewTagNames(): string[];

  /**
   * Get pending new tag names
   * @returns Array of tag names
   */
  getPendingNewTagNames(): string[];

  /**
   * Get the classification of the article
   * @returns The classification
   */
  getClassification(): string;

  /**
   * Get the update time of the article
   * @returns The update time as a Date
   */
  getUpdateTime(): Date;

  /**
   * Get the external quote URL
   * @returns The external quote URL
   */
  getExternalQuoteUrl(): string | null;

  /**
   * Get the social ID of this article
   * @returns The SocialItemId
   */
  getSocialId(): SocialItemId;

  /**
   * Get comment tags associated with this article
   * @returns Array of comment tag IDs
   */
  getCommentTags(): string[];

  /**
   * Get hashtag IDs associated with this article
   * @returns Array of hashtag IDs
   */
  getHashtagIds(): string[];

  /**
   * Get tagged comment IDs for a specific tag
   * @param tagId The tag ID to get comments for
   * @returns Array of SocialItemIds for tagged comments
   */
  getTaggedCommentIds(tagId: string): SocialItemId[];

  /**
   * Get OGP data for this article
   * @returns OGP data or null
   */
  getOgpData(): unknown;
}
