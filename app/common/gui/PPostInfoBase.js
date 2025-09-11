(function(gui) {
class PPostInfoBase extends gui.PPostBase {
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

gui.PPostInfoBase = PPostInfoBase;
}(window.gui = window.gui || {}));
