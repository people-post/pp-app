import { FrontPageTemplateConfig } from './FrontPageTemplateConfig.js';

export class BlockchainPageConfig extends FrontPageTemplateConfig {};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.BlockchainPageConfig = BlockchainPageConfig;
}
