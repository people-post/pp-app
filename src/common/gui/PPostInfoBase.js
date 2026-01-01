import { PPostBase } from './PPostBase.js';

export class PPostInfoBase extends PPostBase {
  isColorInvertible() { return false; }
  isClickable() { return true; }

  getCrossRefPanel() { return null; }   // For reposts
  getOwnerIconPanel() { return null; }  // Owner icon
  getOwnerNamePanel() { return null; }  // Owner name
  getAuthorNamePanel() { return null; } // Author name
  getImagePanel() { return null; }      // Thumbnails

  setVisibilityClassName(name) {}

  enableImage() {}
  enableQuote() {}
  invertColor() {}
};

