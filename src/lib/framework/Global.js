// Global namespace object
// Properties are populated in app.js and WcWeb3.js
export const glb = {
  // env is populated in app.js
  // Web3 properties are added dynamically in WcWeb3.js:
  // web3Resolver, web3Publisher, web3Ledger, web3Storage
};

// Export to window for global access
if (typeof window !== 'undefined') {
  window.glb = glb;
}

