(function(blog) {
window.CF_POST_STATISTICS_INFO = {
  ONCLICK : "CF_POST_STATISTICS_INFO_1",
}

const _CFT_POST_STATISTICS_INFO = {
  MAIN : `<div class="underline ellipsis">__NAME__</div>
    <div class="small-info-text no-wrap">__COUNT__</div>`,
}

class FPostStatisticsInfo extends ui.Fragment {
  constructor() {
    super();
    this._data = null;
  }

  setData(d) { this._data = d; }

  action(type, ...args) {
    switch (type) {
    case CF_POST_STATISTICS_INFO.ONCLICK:
      this.#onClick();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let p = new ui.Panel();
    p.setClassName("pad5px flex space-between baseline-align-items clickable");
    p.setAttribute("onclick",
                   "javascript:G.action(CF_POST_STATISTICS_INFO.ONCLICK)");

    render.wrapPanel(p);

    p.replaceContent(this.#renderData(this._data));
  }

  #renderData(data) {
    let s = _CFT_POST_STATISTICS_INFO.MAIN;
    let name = this._data.title;
    if (name && name.length) {
      name = blog.Utilities.stripSimpleTag(name, "p");
    } else {
      name = "[empty]";
    }
    s = s.replace("__NAME__", name);
    s = s.replace("__COUNT__", this._data.count);
    return s;
  }

  #onClick() {
    this._delegate.onClickInFPostStatisticsInfo(this, this._data);
  }
};

blog.FPostStatisticsInfo = FPostStatisticsInfo;
}(window.blog = window.blog || {}));
