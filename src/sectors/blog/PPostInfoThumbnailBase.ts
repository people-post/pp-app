import { PPostInfoBase } from '../../common/gui/PPostInfoBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { PUserReference } from '../../common/hr/PUserReference.js';

/**
 * Shared base for thumbnail-style post info panels (BigHead, Huge).
 *
 * Layout: featured image at top/background, then title, cross-reference,
 * creation date-time, and optional quote inside an aspect-ratio container.
 *
 * Sub-element ID conventions used by _onFrameworkDidAppear:
 *   "T"  → title
 *   "I"  → image
 *   "R"  → cross-reference (repost source)
 *   "Q"  → quote
 *   "DT" → creation date-time
 */
export abstract class PPostInfoThumbnailBase extends PPostInfoBase {
  #pTitle: Panel;
  #pCrossRef: PUserReference;
  #pQuote: PanelWrapper;
  #pDateTime: Panel;
  #pImage: PanelWrapper;

  constructor() {
    super();
    this.#pTitle = new Panel();
    this.#pCrossRef = new PUserReference();
    this.#pQuote = new PanelWrapper();
    this.#pDateTime = new Panel();
    this.#pImage = new PanelWrapper();
  }

  getTitlePanel(): Panel { return this.#pTitle; }
  getPinPanel(): Panel | null { return null; }
  getCrossRefPanel(): PUserReference { return this.#pCrossRef; }
  getQuotePanel(): PanelWrapper | null { return this.#pQuote; }
  getCreationDateTimePanel(): Panel { return this.#pDateTime; }
  getImagePanel(): PanelWrapper | null { return this.#pImage; }

  enableQuote(): void { this.#pQuote.setClassName("left-pad5 right-pad5"); }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pTitle.attach(this._getSubElementId("T"));
    this.#pImage.attach(this._getSubElementId("I"));
    this.#pCrossRef.attach(this._getSubElementId("R"));
    this.#pQuote.attach(this._getSubElementId("Q"));
    this.#pDateTime.attach(this._getSubElementId("DT"));
  }
}
