
/*
 * +--------------+
 * |     TEXT     |
 * +--------------+
 */

const _CPT_POST_INFO_EMBED = {
  MAIN : `<div class="post-info embed">
    <div id="__ID_TITLE__" class="u-font3"></div>
  </div>`,
}

export class PPostInfoEmbed extends gui.PPostInfoBase {
  #pTitle;
  constructor() {
    super();
    this.#pTitle = new ui.Panel();
  }

  getTitlePanel() { return this.#pTitle; }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pTitle.attach(this._getSubElementId("T"));
  }

  _renderFramework() {
    let s = _CPT_POST_INFO_EMBED.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    return s;
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.PPostInfoEmbed = PPostInfoEmbed;
}
