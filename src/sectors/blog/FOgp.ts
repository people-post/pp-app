export const CF_OGP = {
  ON_CLICK : "CF_OGP_1",
} as const;

// Export to window for HTML string templates
declare global {
  interface Window {
    CF_OGP?: typeof CF_OGP;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_OGP = CF_OGP;
}

const _CFT_OGP = {
  URL :
      `<span class="small-info-text tw-inline-block tw-h-[12pt] tw-overflow-hidden clickable" onclick="javascript:G.action(CF_OGP.ON_CLICK)">&#x1f517;__URL__</span>`,
  IMG :
      `<span class="thumbnail-grid thumbnail-grid-1-1" style="background-image:url('__URL__')" onclick="javascript:G.action(CF_OGP.ON_CLICK)"></span>`,
} as const;

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ThumbnailPanelWrapper } from '../../lib/ui/renders/panels/ThumbnailPanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Ogp } from '../../common/dba/Ogp.js';
import { POgpSmall } from './POgpSmall.js';
import { POgpLarge } from './POgpLarge.js';
import { OgpData } from '../../common/datatypes/OgpData.js';

export class FOgp extends Fragment {
  protected _url: string | null = null;
  protected _sizeType: string | null = null;

  constructor() {
    super();
  }

  setUrl(url: string | null): void { this._url = url; }
  setSizeType(t: string | null): void { this._sizeType = t; }

  action(type: string | symbol, ..._args: unknown[]): void {
    switch (type) {
    case CF_OGP.ON_CLICK:
      this.#onClick();
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: string | symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.OGP:
      const ogpData = data as OgpData;
      if (ogpData.getUrl() == this._url) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: PanelWrapper): void {
    if (!this._url) {
      return;
    }

    let ogp = Ogp.get(this._url);
    if (!ogp) {
      return;
    }

    let p = this.#createPanel();
    p.setClassName("clickable");
    p.setAttribute("onclick", "G.action(CF_OGP.ON_CLICK)");
    render.wrapPanel(p);

    let pp;
    pp = p.getAuthorPanel();
    pp.replaceContent(this.#renderUrl(ogp.getUrl()));

    if (this.#hasImage(ogp)) {
      pp = p.getImagePanel();
      let pThumbnail = new ThumbnailPanelWrapper();
      if (this._sizeType == SocialItem.T_LAYOUT.EXT_QUOTE_SMALL) {
        pp.setClassName("quote-element-image-thumbnail-wrapper tw-flex-shrink-0");
        pThumbnail.setClassName("aspect-1-1-frame");
      }
      pp.wrapPanel(pThumbnail);

      pp = new Panel();
      pp.setClassName("thumbnail-grid-wrapper");
      pThumbnail.wrapPanel(pp);
      pp.replaceContent(this.#renderImage(ogp.getImageUrl()));
    }

    pp = p.getTitlePanel();
    pp.replaceContent(ogp.getTitle() || "");

    pp = p.getDescriptionPanel();
    pp.setAttribute("onclick", "G.action(CF_OGP.ON_CLICK)");
    pp.replaceContent(ogp.getDescription() || "");
  }

  #hasImage(ogp: OgpData): boolean { return !!ogp.getImageUrl(); }

  #createPanel(): POgpSmall | POgpLarge {
    let p: POgpSmall | POgpLarge;
    switch (this._sizeType) {
    case SocialItem.T_LAYOUT.EXT_QUOTE_SMALL:
      p = new POgpSmall();
      break;
    default:
      p = new POgpLarge();
      break;
    }
    return p;
  }

  #renderImage(url: string): string {
    let s = _CFT_OGP.IMG as string;
    s = s.replace("__URL__", url);
    return s;
  }

  #renderUrl(url: string): string {
    let s = _CFT_OGP.URL as string;
    s = s.replace("__URL__", url);
    return s;
  }

  #onClick(): void {
    if (this._url) {
      window.open(this._url, "_blank");
    }
  }
}
