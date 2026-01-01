// Wrapper for bip39 - exposes as global bip39 for backward compatibility
import * as bip39Module from 'bip39';

// Expose as global for backward compatibility
if (typeof window !== 'undefined') {
  window.bip39 = bip39Module;
}

// Also export as ES module
export * from 'bip39';
export default bip39Module;
