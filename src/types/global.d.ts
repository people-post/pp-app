/**
 * Global type declarations for pp-app
 * These types are available throughout the project without explicit imports
 */

/**
 * Global namespace for the application
 */
declare global {
  /**
   * Global application instance
   */
  var G: {
    initAsWeb3: (dConfig: any) => void;
    initAsMain: (userId: string, primaryColor: string, secondaryColor: string, lang: string) => void;
    initAsGadget: (userId: string, primaryColor: string, secondaryColor: string, lang: string) => void;
    initAsSub: (userId: string, primaryColor: string, secondaryColor: string, lang: string) => void;
    initAsPortal: (userId: string, primaryColor: string, secondaryColor: string, lang: string) => void;
    action: (...args: any[]) => void;
    anchorClick: () => boolean;
  };

  /**
   * Global event object (browser environment)
   */
  var event: Event | undefined;
}

export {};

