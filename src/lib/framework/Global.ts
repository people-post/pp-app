/**
 * Interface for script information
 */
export interface ScriptInfo {
  id: string;
  src: string;
}

/**
 * Interface for scripts configuration
 */
export interface ScriptsConfig {
  EDITOR: ScriptInfo;
  PLAYER: ScriptInfo;
  SIGNAL: ScriptInfo;
  QR_CODE: ScriptInfo;
  PAYMENT: ScriptInfo;
  BRAINTREE: ScriptInfo;
}

/**
 * Interface for the Env class public API
 * This allows better type checking when using Env
 */
export interface IEnv {
  readonly SCRIPT: ScriptsConfig;
  hasHost(): boolean;
  isScriptLoaded(id: string): boolean;
  isTrustedSite(): boolean;
  isWeb3(): boolean;
  getWindowType(): string | null;
  getPreferredLanguage(): string | null;
  getLanguage(): string | null;
  getSmartTimeDiffThreshold(): number;
  setSmartTimeDiffThreshold(thSec: number): number;
  setWindowType(t: string): void;
  setPreferredLanguage(lang: string): void;
  setDefaultLanguage(lang: string): void;
  checkLoadAddonScript(info: ScriptInfo): void;
}

/**
 * Interface for fragment delegates that handle remote errors
 */
export interface FragmentDelegate {
  onRemoteErrorInFragment(f: unknown, e: unknown): void;
}

/**
 * Interface for the Api class public API
 * This allows better type checking when using Api
 */
export interface IApi {
  asCall(url: string): Promise<unknown>;
  asPost(url: string, data: unknown, onProg?: ((loaded: number) => void) | null): Promise<unknown>;
  asFragmentCall(f: FragmentDelegate, url: string): Promise<unknown>;
  asFragmentJsonPost(
    f: FragmentDelegate,
    url: string,
    data: unknown,
    onProg?: ((loaded: number) => void) | null
  ): Promise<unknown>;
  asFragmentPost(
    f: FragmentDelegate,
    url: string,
    data: unknown,
    onProg?: ((loaded: number) => void) | null
  ): Promise<unknown>;
  asyncRawCall(url: string, onOk: ((txt: string) => void) | null, onErr: ((txt: string) => void) | null): void;
  asyncRawPost(
    url: string,
    data: unknown,
    onOk: ((txt: string) => void) | null,
    onErr: ((txt: string) => void) | null,
    onProg?: ((loaded: number) => void) | null
  ): void;
}

/**
 * Global namespace object
 * Properties are populated in WcWeb3.js
 * Note: env and api are now imported directly, not stored in glb
 */
export interface GlobalNamespace {
  // Web3 properties are added dynamically in WcWeb3.js:
  web3Resolver?: unknown;
  web3Publisher?: unknown;
  web3Ledger?: unknown;
  web3Storage?: unknown;
  [key: string]: unknown; // Allow additional dynamic properties
}

export const glb: GlobalNamespace = {
  // Web3 properties are added dynamically in WcWeb3.js:
  // web3Resolver, web3Publisher, web3Ledger, web3Storage
};

// Export to window for global access
if (typeof window !== 'undefined') {
  (window as { glb?: GlobalNamespace }).glb = glb;
}

