/**
 * Basic type definitions for common data structures
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
 * Color theme data structure
 */
export interface ColorThemeData {
  primary_color: string;
  secondary_color: string;
}

/**
 * ColorTheme interface representing the public API of the ColorTheme class
 */
export interface ColorTheme {
  /**
   * Get the primary color
   * @returns The primary color as a hex string
   */
  getPrimaryColor(): string;

  /**
   * Get the secondary color
   * @returns The secondary color as a hex string
   */
  getSecondaryColor(): string;

  /**
   * Get the appropriate text color based on contrast
   * @param eTest Optional HTML element for testing contrast
   * @returns The text color as a hex string
   */
  getTextColor(eTest: HTMLElement | null): string;

  /**
   * Get the appropriate info text color based on contrast
   * @param eTest Optional HTML element for testing contrast
   * @returns The info text color as a hex string
   */
  getInfoTextColor(eTest: HTMLElement | null): string;

  /**
   * Get the appropriate menu color based on contrast
   * @param eTest Optional HTML element for testing contrast
   * @returns The menu color as a hex string
   */
  getMenuColor(eTest: HTMLElement | null): string;

  /**
   * Get the appropriate function color based on contrast
   * @param eTest Optional HTML element for testing contrast
   * @returns The function color as a hex string
   */
  getFuncColor(eTest: HTMLElement | null): string;

  /**
   * Get the primary decoration color
   * @param eTest Optional HTML element for testing contrast
   * @returns The primary decoration color as a hex string
   */
  getPrimeDecorColor(eTest: HTMLElement | null): string;

  /**
   * Get the secondary decoration color
   * @param eTest Optional HTML element for testing contrast
   * @returns The secondary decoration color as a hex string
   */
  getSecondaryDecorColor(eTest: HTMLElement | null): string;

/**
 * Get the separation color
 * @param eTest Optional HTML element for testing contrast
 * @returns The separation color as a hex string, or null if no separation is needed
 */
  getSeparationColor(eTest: HTMLElement | null): string | null;
}

/**
 * SocialItem interface for social actions like comment, like, repost or quote
 */
export interface SocialItem {
  /**
   * Get the type of the social item
   * @returns The type as a string
   */
  getSocialItemType(): string;

  /**
   * Get OGP (Open Graph Protocol) data for the social item
   * @returns OGP data or null
   */
  getOgpData(): unknown;
}

/**
 * SocialItem namespace containing static constants and utility functions
 */
export namespace SocialItem {
  // Synced with backend
  export const TYPE: {
    readonly ARTICLE: 'ARTICLE';
    readonly JOURNAL_ISSUE: 'JOURNAL_ISSUE';
    readonly PROJECT: 'PROJECT';
    readonly PRODUCT: 'PRODUCT';
    readonly ORDER: 'ORDER';
    readonly URL: 'URL';
    readonly FEED_ARTICLE: 'FEED_ARTICLE';
    readonly USER: 'USER';
    readonly FEED: 'FEED';
    readonly GROUP: 'GROUP';
    readonly COMMENT: 'COMMENT';
    readonly HASHTAG: 'HASHTAG';
    readonly INVALID: 'INVALID'; // Local, not synced
  };

  export const T_LAYOUT: {
    readonly COMPACT: 'COMPACT'; // Synced with backend
    readonly SMALL: 'SMALL'; // Synced with backend
    readonly MEDIUM: 'MEDIUM'; // Synced with backend
    readonly LARGE: 'LARGE'; // Synced with backend
    readonly BIG_HEAD: 'BIG_HEAD'; // Synced with backend
    readonly EXT_QUOTE_SMALL: '_Q_SMALL';
    readonly EXT_QUOTE_LARGE: '_Q_LARGE';
    readonly EXT_BRIEF: '_BRIEF';
    readonly EXT_CARD: '_CARD';
    readonly EXT_HUGE: '_HUGE';
    readonly EXT_EMBED: '_EMBED';
    readonly EXT_COMMENT: '_COMMENT';
    readonly EXT_FULL_PAGE: '_FULL_PAGE';
  };

  /**
   * Get the icon for a given social item type
   * @param type The type of the social item
   * @returns The icon string
   */
  export function getIcon(type: string | symbol): string;
}