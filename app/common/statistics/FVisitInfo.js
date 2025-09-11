(function(stat) {
window.CF_VISIT_SUMMARY_INFO = {
  ONCLICK : "CF_VISIT_SUMMARY_INFO_1",
}

const _CFT_VISIT_SUMMARY_INFO = {
  MAIN : `<div>__NAME__</div>
    <div>__N_VISITS__</div>`,
}

class FVisitInfo extends ui.Fragment {
  constructor() {
    super();
    this._data = null;
  }

  setData(d) { this._data = d; }

  action(type, ...args) {
    switch (type) {
    case CF_VISIT_SUMMARY_INFO.ONCLICK:
      this.#onClick();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let p = new ui.Panel();
    let names = [ "pad5", "flex", "space-between", "visit-summary-info" ];
    if (this._data.getSubQueryKey()) {
      names.push("clickable");
      p.setAttribute("onclick",
                     "javascript:G.action(CF_VISIT_SUMMARY_INFO.ONCLICK)");
    }
    p.setClassName(names.join(" "));

    render.wrapPanel(p);

    p.replaceContent(this.#renderData(this._data));
  }

  #renderData(data) {
    let s = _CFT_VISIT_SUMMARY_INFO.MAIN;
    let name = data.getName();
    if (data.getSubQueryKey() == "COUNTRY") {
      let c = Utilities.getCountryByCode(name);
      if (c) {
        name = Utilities.renderFlagIcon(name) + c.getName();
      }
    }
    s = s.replace("__NAME__", name);
    s = s.replace("__N_VISITS__", data.getTotal());
    return s;
  }

  #onClick() {
    this._delegate.onClickInVisitSummaryInfoFragment(this, this._data);
  }
};

stat.FVisitInfo = FVisitInfo;
}(window.stat = window.stat || {}));
