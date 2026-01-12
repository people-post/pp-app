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