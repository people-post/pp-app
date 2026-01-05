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

  /**
   * Global Cardano object (from ext/cardano.min.js)
   */
  var Cardano: {
    Bip32PrivateKey: {
      from_bip39_entropy(entropy: Uint8Array, password: Uint8Array): unknown;
      from_bytes(bytes: Uint8Array): unknown;
    };
    PrivateKey: {
      from_hex(hex: string): unknown;
    };
    FixedTransaction: {
      from_hex(hex: string): unknown;
    };
    TransactionWitnessSet: {
      new(): unknown;
    };
    Vkeywitnesses: {
      new(): unknown;
    };
    Transaction: {
      new(fixedTx: unknown, witnesses: unknown): unknown;
    };
    NetworkInfo: {
      testnet_preview(): { network_id: number };
    };
    Credential: {
      from_keyhash(hash: Uint8Array): unknown;
      new?(): unknown;
    };
    BaseAddress: {
      new(networkId: number, payment: unknown, staking: unknown): {
        to_address(): unknown;
      };
    };
    make_vkey_witness(message: Uint8Array, key: unknown): unknown;
  };

  /**
   * Database access objects
   */
  interface Window {
    dba?: {
      Account?: {
        isAuthenticated(): boolean;
        getId(): string | null;
        setUserId(userId: string): void;
        getPreferredLanguage(): string | null;
        getLiveStreamKey(): string | null;
        setLiveStreamKey(key: string): void;
        reset(profile?: unknown): void;
        setDataSource?(source: unknown): void;
        setDelegate?(delegate: unknown): void;
        loadCheckPoint?(): void;
        saveCheckPoint?(): void;
        setPublishers?(agents: unknown): void;
        setStorage?(agent: unknown): void;
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
  }
}

export {};

