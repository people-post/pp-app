import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PPostBase extends Panel {
  // Base class for all types of post panels, includes but not limited to:
  // 1. PostInfo at different sizes: Compact, small, middle, large etc.
  // 2. Full page post
  // 3. Embeded post: quote, embed etc.

  // Title
  getTitlePanel(): Panel | null { return null; }

  // Initially added to support journal issue.
  getAbstractPanel(): Panel | null { return null; }

  // Content
  getContentPanel(): Panel | null { return null; }

  // Initially added to support journal issue.
  getSummaryPanel(): Panel | null { return null; }

  // Tags
  getTagsPanel(): Panel | null { return null; }

  // For pin icon to indicate a post is pinned.
  getPinPanel(): Panel | null { return null; }

  // Initially added to support source link of feed articles.
  getSourceLinkPanel(): Panel | null { return null; }

  // Attachment
  getAttachmentPanel(): Panel | null { return null; }

  // Quoted external urls or internal items like products etc.
  getQuotePanel(): Panel | null { return null; }

  // Social bar for comment, like, repost and share.
  getSocialBarPanel(): Panel | null { return null; }

  // Gallery of images, videos.
  getGalleryPanel(): Panel | null { return null; }

  // Label for creation time.
  getTCreateDecorPanel(): Panel | null { return null; }

  // Label for update time.
  getTUpdateDecorPanel(): Panel | null { return null; }

  // Time diff or timestamp.
  getCreationTimeSmartPanel(): Panel | null { return null; }

  // Timestamp of creation time.
  getCreationDateTimePanel(): Panel | null { return null; }

  // Timestamp of update time.
  getUpdateDateTimePanel(): Panel | null { return null; }

  // Initially added to support comment actions
  getContextPanel(): Panel | null { return null; }
}

export default PPostBase;

