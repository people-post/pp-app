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
   * These are JavaScript classes with static methods
   */
  var Cardano: {
    Bip32PrivateKey: {
      from_bip39_entropy(entropy: Uint8Array, password: Uint8Array): CardanoBip32PrivateKey;
      from_bytes(bytes: Uint8Array): CardanoBip32PrivateKey;
    };
    PrivateKey: {
      from_hex(hex: string): CardanoPrivateKey;
    };
    FixedTransaction: {
      from_hex(hex: string): CardanoFixedTransaction;
    };
    TransactionWitnessSet: {
      new: () => CardanoTransactionWitnessSet;
    };
    Vkeywitnesses: {
      new: () => CardanoVkeywitnesses;
    };
    Transaction: {
      new: (body: unknown, witnesses: CardanoTransactionWitnessSet, metadata?: unknown) => CardanoTransaction;
    };
    NetworkInfo: {
      testnet_preview(): { network_id: number };
    };
    Credential: {
      from_keyhash(hash: Uint8Array): CardanoCredential;
    };
    BaseAddress: {
      new(networkId: number, payment: CardanoCredential, staking: CardanoCredential): CardanoBaseAddress;
    };
    make_vkey_witness(message: Uint8Array, key: CardanoPrivateKey): CardanoVkeyWitness;
  };

  /**
   * Cardano Bip32PrivateKey instance
   */
  interface CardanoBip32PrivateKey {
    deriveSeed(): Uint8Array;
    sign(msgStr: string): Uint8Array;
    signUint8Array(msg: Uint8Array): Uint8Array;
    toPublic(): Uint8Array;
    to_raw_key(): CardanoPrivateKey;
    derive(index: number): CardanoBip32PrivateKey;
    to_public(): Uint8Array;
  }

  /**
   * CardanoKey interface for keys that can be used with Cardano operations
   */
  interface CardanoKey {
    to_raw_key(): {
      hash(): Uint8Array;
    };
  }

  /**
   * Cardano PrivateKey instance
   * Used by make_vkey_witness and returned by to_raw_key()
   */
  interface CardanoPrivateKey {
    hash(): Uint8Array;
  }

  /**
   * Cardano FixedTransaction instance
   */
  interface CardanoFixedTransaction {
    body(): unknown;
    transaction_hash(): {
      to_hex: string;
    };
  }

  /**
   * Cardano TransactionWitnessSet instance
   */
  interface CardanoTransactionWitnessSet {
    set_vkeys(vkeyWitnesses: CardanoVkeywitnesses): void;
  }

  /**
   * Cardano Vkeywitnesses instance
   */
  interface CardanoVkeywitnesses {
    add(vkeyWitness: CardanoVkeyWitness): void;
  }

  /**
   * Cardano Transaction instance
   */
  interface CardanoTransaction {
    to_json(): string;
    to_hex(): string;
  }

  /**
   * Cardano Credential instance
   */
  interface CardanoCredential {
    // Credential is used as a parameter type, no methods accessed directly
  }

  /**
   * Cardano BaseAddress instance
   */
  interface CardanoBaseAddress {
    to_address(): CardanoAddress;
  }

  /**
   * Cardano Address instance
   */
  interface CardanoAddress {
    to_bech32(): string;
  }

  /**
   * Cardano VkeyWitness instance
   */
  interface CardanoVkeyWitness {
    // VkeyWitness is used as a parameter type, no methods accessed directly
  }

  /**
   * Database access objects
   */
  interface Window {
    Cardano?: typeof Cardano;
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

