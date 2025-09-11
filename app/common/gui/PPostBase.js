(function(gui) {
class PPostBase extends ui.Panel {
  // Base class for all types of post panels, includes but not limited to:
  // 1. PostInfo at different sizes: Compact, small, middle, large etc.
  // 2. Full page post
  // 3. Embeded post: quote, embed etc.

  // Title
  getTitlePanel() { return null; }

  // Initially added to support journal issue.
  getAbstractPanel() { return null; }

  // Content
  getContentPanel() { return null; }

  // Initially added to support journal issue.
  getSummaryPanel() { return null; }

  // Tags
  getTagsPanel() { return null; }

  // For pin icon to indicate a post is pinned.
  getPinPanel() { return null; }

  // Initially added to support source link of feed articles.
  getSourceLinkPanel() { return null; }

  // Attachment
  getAttachmentPanel() { return null; }

  // Quoted external urls or internal items like products etc.
  getQuotePanel() { return null; }

  // Social bar for comment, like, repost and share.
  getSocialBarPanel() { return null; }

  // Gallery of images, videos.
  getGalleryPanel() { return null; }

  // Label for creation time.
  getTCreateDecorPanel() { return null; }

  // Label for update time.
  getTUpdateDecorPanel() { return null; }

  // Time diff or timestamp.
  getCreationTimeSmartPanel() { return null; }

  // Timestamp of creation time.
  getCreationDateTimePanel() { return null; }

  // Timestamp of update time.
  getUpdateDateTimePanel() { return null; }

  // Initially added to support comment actions
  getContextPanel() { return null; }
};

gui.PPostBase = PPostBase;
}(window.gui = window.gui || {}));
