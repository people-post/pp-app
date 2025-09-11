(function(hstn) {
hstn.CF_NS_HOWTO = {
  TOGGLE : Symbol(),
};

const _CF_NS_HOWTO = {
  VENDERS : [
    {
      name : "Google domains",
      ns_entry_src : "dns_google.png",
      ns_src : "ns_google.png",
    },
    {
      name : "Godaddy",
      ns_entry_src : "ns_entry_godaddy.png",
      ns_src : "ns_godaddy.png",
    }
  ]
};

const _CFT_NS_HOWTO = {
  MAIN : `
    <p>1. Find DNS name server settings in your domain management page</p>
    <p>Examples:</p>
    __NS_ENTRIES__
    <p>2. Change name servers</p>
    <p>Examples:</p>
    __NAME_SERVERS__`,
  TOGGLE_BLOCK : `<div>
      <p>
        <span>+</span><a href="javascript:void(0)" onclick="javascript:G.action(hstn.CF_NS_HOWTO.TOGGLE, this.parentNode.parentNode)">__TITLE__</a>
      </p>
      <div hidden>__CONTENT__</div>
    </div>`,
  NS_ENTRY : `<img class="photo" src="static/img/__IMG_SRC__"></img>`,
  NS : `<img class="photo" src="static/img/__IMG_SRC__"></img>`,
};

class FvcNsHowto extends ui.FScrollViewContent {
  action(type, ...args) {
    switch (type) {
    case hstn.CF_NS_HOWTO.TOGGLE:
      this.#onToggle(args[0]);
      break;
    default:
      break;
    }
  }

  _renderContentOnRender(render) {
    let s = _CFT_NS_HOWTO.MAIN;
    s = s.replace("__NS_ENTRIES__", this.#renderNsEntries());
    s = s.replace("__NAME_SERVERS__", this.#renderNameServers());
    render.replaceContent(s);
  }

  #renderNsEntries() {
    let items = [];
    for (let v of _CF_NS_HOWTO.VENDERS) {
      let s = _CFT_NS_HOWTO.NS_ENTRY;
      s = s.replace("__IMG_SRC__", v.ns_entry_src);
      items.push(this.#renderToggleBlock(v.name, s));
    }
    return items.join("");
  }

  #renderNameServers() {
    let items = [];
    for (let v of _CF_NS_HOWTO.VENDERS) {
      let s = _CFT_NS_HOWTO.NS;
      s = s.replace("__IMG_SRC__", v.ns_src);
      items.push(this.#renderToggleBlock(v.name, s));
    }
    return items.join("");
  }

  #renderToggleBlock(title, content) {
    let s = _CFT_NS_HOWTO.TOGGLE_BLOCK;
    s = s.replace("__TITLE__", title);
    s = s.replace("__CONTENT__", content);
    return s;
  }

  #onToggle(rootNode) {
    let eContent = rootNode.lastElementChild;                 // Content
    let eIcon = rootNode.firstElementChild.firstElementChild; // Icon
    eContent.hidden = !eContent.hidden;
    if (eContent.hidden) {
      eIcon.innerHTML = "+";
    } else {
      eIcon.innerHTML = "-";
    }
  }
};

hstn.FvcNsHowto = FvcNsHowto;
}(window.hstn = window.hstn || {}));
