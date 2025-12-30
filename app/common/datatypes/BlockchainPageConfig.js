export class BlockchainPageConfig extends dat.FrontPageTemplateConfig {};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.BlockchainPageConfig = BlockchainPageConfig;
}
