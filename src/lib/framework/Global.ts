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

