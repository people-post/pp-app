// Wrapper for @scure/bip32 - exposes as global scureBip32 for backward compatibility
import * as scureBip32Module from '@scure/bip32';

// Create an object that matches the old structure (scureBip32.HDKey)
const scureBip32 = {
  HDKey: scureBip32Module.HDKey,
  HARDENED_OFFSET: scureBip32Module.HARDENED_OFFSET
};

// Expose as global for backward compatibility
if (typeof window !== 'undefined') {
  window.scureBip32 = scureBip32;
}

// Also export as ES module
export * from '@scure/bip32';
export { scureBip32 };
export default scureBip32Module;
