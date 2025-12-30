
window.CF_OGP = {
  ON_CLICK : "CF_OGP_1",
}

const _CFT_OGP = {
  URL :
      `<span class="small-info-text inline-block h12pt hide-overflow clickable" onclick="javascript:G.action(CF_OGP.ON_CLICK)">&#x1f517;__URL__</span>`,
  IMG :
      `<span class="thumbnail-grid thumbnail-grid-1-1" style="background-image:url('__URL__')" onclick="javascript:G.action(CF_OGP.ON_CLICK)"></span>`,
}

export class FOgp extends ui.Fragment {
  constructor() {
    super();
    this._url = null;
    this._sizeType = null;
  }

  setUrl(url) { this._url = url; }
  setSizeType(t) { this._sizeType = t; }

  action(type, ...args) {
    switch (type) {
    case CF_OGP.ON_CLICK:
      this.#onClick();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.OGP:
      if (data.getId() == this._url) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let ogp = dba.Ogp.get(this._url);
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
      let pThumbnail = new ui.ThumbnailPanelWrapper();
      if (this._sizeType == dat.SocialItem.T_LAYOUT.EXT_QUOTE_SMALL) {
        pp.setClassName("quote-element-image-thumbnail-wrapper flex-noshrink");
        pThumbnail.setClassName("aspect-1-1-frame");
      }
      pp.wrapPanel(pThumbnail);

      pp = new ui.Panel();
      pp.setClassName("thumbnail-grid-wrapper");
      pThumbnail.wrapPanel(pp);
      pp.replaceContent(this.#renderImage(ogp.getImageUrl()));
    }

    pp = p.getTitlePanel();
    pp.replaceContent(ogp.getTitle());

    pp = p.getDescriptionPanel();
    pp.setAttribute("onclick", "G.action(CF_OGP.ON_CLICK)");
    pp.replaceContent(ogp.getDescription());
  }

  #hasImage(ogp) { return !!ogp.getImageUrl(); }

  #createPanel() {
    let p;
    switch (this._sizeType) {
    case dat.SocialItem.T_LAYOUT.EXT_QUOTE_SMALL:
      p = new blog.POgpSmall();
      break;
    default:
      p = new blog.POgpLarge();
      break;
    }
    return p;
  }

  #renderImage(url) {
    let s = _CFT_OGP.IMG;
    s = s.replace("__URL__", url);
    return s;
  }

  #renderUrl(url) {
    let s = _CFT_OGP.URL;
    s = s.replace("__URL__", url);
    return s;
  }

  #onClick() { window.open(this._url, "_blank"); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FOgp = FOgp;
}
