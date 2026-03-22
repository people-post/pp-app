import { PPostInfoBase } from '../../common/gui/PPostInfoBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { PUserReference } from '../../common/hr/PUserReference.js';

/**
 * Shared base for quote-style post info panels (SmallQuote, LargeQuote).
 *
 * Both layouts embed a quoted post with: cross-reference header, author name,
 * creation time, title, content body, and an optional image thumbnail.
 *
 * Sub-element ID conventions used by _onFrameworkDidAppear:
 *   "R"  → cross-reference (source post)
 *   "A"  → author name
 *   "TM" → creation time
 *   "T"  → title
 *   "C"  → content
 *   "I"  → image
 */
export abstract class PPostInfoQuoteBase extends PPostInfoBase {
  #pCrossRef: PUserReference;
  #pAuthorName: PanelWrapper;
  #pTime: Panel;
  #pTitle: Panel;
  #pContent: PanelWrapper;
  #pImage: PanelWrapper;

  constructor() {
    super();
    this.#pCrossRef = new PUserReference();
    this.#pAuthorName = new PanelWrapper();
    this.#pTime = new Panel();
    this.#pTitle = new Panel();
    this.#pContent = new PanelWrapper();
    this.#pImage = new PanelWrapper();
  }

  getCrossRefPanel(): PUserReference { return this.#pCrossRef; }
  getOwnerNamePanel(): PanelWrapper | null { return null; }
  getAuthorNamePanel(): PanelWrapper { return this.#pAuthorName; }
  getCreationTimeSmartPanel(): Panel { return this.#pTime; }
  getTitlePanel(): Panel { return this.#pTitle; }
  getContentPanel(): PanelWrapper { return this.#pContent; }
  getImagePanel(): PanelWrapper | null { return this.#pImage; }

  enableImage(): void {
    this.#pImage.setClassName(
        "quote-element-image-thumbnail-wrapper tw:flex-shrink-0");
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pCrossRef.attach(this._getSubElementId("R"));
    this.#pAuthorName.attach(this._getSubElementId("A"));
    this.#pTime.attach(this._getSubElementId("TM"));
    this.#pTitle.attach(this._getSubElementId("T"));
    this.#pContent.attach(this._getSubElementId("C"));
    this.#pImage.attach(this._getSubElementId("I"));
  }
}
