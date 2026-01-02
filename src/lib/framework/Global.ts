import type { Env } from '../../common/plt/Env.js';
import type { Api } from '../../common/plt/Api.js';

/**
 * Global namespace object
 * Properties are populated in app.js and WcWeb3.js
 */
export interface GlobalNamespace {
  env?: Env;
  api?: Api;
  // Web3 properties are added dynamically in WcWeb3.js:
  web3Resolver?: unknown;
  web3Publisher?: unknown;
  web3Ledger?: unknown;
  web3Storage?: unknown;
  [key: string]: unknown; // Allow additional dynamic properties
}

export const glb: GlobalNamespace = {
  // env is populated in app.js
  // Web3 properties are added dynamically in WcWeb3.js:
  // web3Resolver, web3Publisher, web3Ledger, web3Storage
};

// Export to window for global access
if (typeof window !== 'undefined') {
  (window as { glb?: GlobalNamespace }).glb = glb;
}

