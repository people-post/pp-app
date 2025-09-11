(function(ui) {
const _CFT_LONG_LIST = {
  EMPTY : `<div class="center-align">Empty list</div>`,
};

class BufferedList extends ui.Fragment {
  #idOffset = 0;
  #bufferSize = 20; // Buffer at each end
  #cacheSize = 200; // Full size
  #isGridMode = false;
  #isTopBufferReductionEnabled = true;
  #panel;
  #fHead;
  #fTail;
  #fItems = [];

  constructor() {
    super();
    this.#panel = new ui.BufferedListPanel();

    this.#fHead = new ui.FLoading();
    this.setChild("head", this.#fHead);

    this.#fTail = new ui.FLoading();
    this.setChild("tail", this.#fTail);
  }

  getFirstId() { return this.#idOffset; }

  setEnableTopBuffer(b) { this.#isTopBufferReductionEnabled = b; }
  setGridMode(b) { this.#isGridMode = b; }

  onScrollFinished() {
    if (this.#fItems.length) {
      // Have at least this.#bufferSize in reserve
      if (this.#fItems.slice(0, this.#bufferSize - 1)
              .some(f => this.#isFragmentInViewPort(f))) {
        this.#reserveHeadBuffer(this.#bufferSize);
      }
      if (this.#fItems.slice(-this.#bufferSize)
              .some(f => this.#isFragmentInViewPort(f))) {
        this.#reserveTailBuffer(this.#bufferSize);
      }
    } else {
      this.render();
    }
  }

  reload() {
    this.#clearBuffer();
    this.render();
  }

  refresh() {
    for (let f of this.#fItems) {
      f.render();
    }
  }

  scrollTo(id) {
    if (id < this.#idOffset || id > this.#idOffset + this.#fItems.length) {
      this.#idOffset = id;
      this.#fItems = [];
      this.render();
    }
  }

  _getAllChildControllers() {
    let cs = [];
    cs.push(...super._getAllChildControllers());
    cs.push(...this.#fItems);
    return cs;
  }

  _renderOnRender(render) {
    if (this._delegate.shouldBufferedListClearBuffer(this)) {
      this.#clearBuffer();
    }

    render.wrapPanel(this.#panel);

    let pMain = this.#panel.getMainPanel();
    pMain.reset(this.#idOffset);

    // Content items
    if (this.#fItems.length) {
      for (let f of this.#fItems) {
        let p = this.#createItemPanel();
        pMain.pushPanel(p);
        f.attachRender(p);
        f.render();
      }
    } else {
      this.#loadInitialItems();
      if (this.#fItems.length == 0 &&
          !this._dataSource.isBufferedListExpectingMoreHeadItems(this) &&
          !this._dataSource.isBufferedListExpectingMoreTrailingItems(this)) {
        pMain.replaceContent(_CFT_LONG_LIST.EMPTY);
      }
    }
  }

  #createItemPanel() {
    let p = new ui.PanelWrapper();
    if (this.#isGridMode) {
      p.setClassName("inline-block");
    }
    return p;
  }

  #loadInitialItems() {
    this.#reserveHeadBuffer(this.#bufferSize);
    this.#reserveTailBuffer(this.#bufferSize);
  }

  #createFragment(id) {
    let f = this._dataSource.createFragmentForBufferedListItem(this, id);
    if (f) {
      f.setOwner(this);
    }
    return f;
  }

  #reserveHeadBuffer(n) {
    let min = this.#idOffset - n;
    let isResizeBegin = false;
    let pMain = this.#panel.getMainPanel();
    let isAtTop = false;
    do {
      let id = this.#idOffset - 1;
      let f = this.#createFragment(id);
      if (f) {
        this.#idOffset = id;
        this.#fItems.unshift(f);
        let p = this.#createItemPanel();
        if (!isResizeBegin) {
          isResizeBegin = true;
          this._delegate.onContentTopResizeBeginInFragment(this);
        }
        pMain.unshiftPanel(p);
        f.attachRender(p);
        f.render();
      } else {
        isAtTop = true;
        break;
      }
    } while (this.#idOffset > min);

    if (isAtTop) {
      let p = this.#panel.getHeadPanel();
      if (this._dataSource.isBufferedListExpectingMoreHeadItems(this)) {
        this.#fHead.attachRender(p);
        this.#fHead.render();
      } else {
        this.#fHead.detachRender();
        p.clear();
      }
    }

    if (isResizeBegin) {
      this._delegate.onContentTopResizeEndInFragment(this);
    }

    // Reduce overflow elements from end
    while (this.#fItems.length > this.#cacheSize) {
      this.#fItems.pop();
      pMain.pop();
    }
  }

  #reserveTailBuffer(n) {
    let pMain = this.#panel.getMainPanel();

    if (this.#isTopBufferReductionEnabled) {
      // Reduce overflow elements from beginning
      // Notice reduce is done before append new items.
      // The reason is that append will cause item to load, result in fast
      // changing heights. So if do append first, scroll cannot correctly
      // restore to item before resize
      this._delegate.onContentTopResizeBeginInFragment(this);
      while (this.#fItems.length > this.#cacheSize) {
        this.#idOffset += 1;
        this.#fItems.shift();
        pMain.shift();
      }
      this._delegate.onContentTopResizeEndInFragment(this);
    }

    let nextId = this.#idOffset + this.#fItems.length;
    let max = nextId + n - 1;
    let isAtEnd = false;
    while (nextId < max) {
      let f = this.#createFragment(nextId);
      if (f) {
        this.#fItems.push(f);
        let p = this.#createItemPanel();
        pMain.pushPanel(p);
        f.attachRender(p);
        f.render();
        if (p.isInViewPort()) {
          // Increase when added item is still in viewport, buffer count starts
          // from first invisible
          max += 1;
        }
        nextId += 1;
      } else {
        isAtEnd = true;
        break;
      }
    }

    if (isAtEnd) {
      let p = this.#panel.getTailPanel();
      if (this._dataSource.isBufferedListExpectingMoreTrailingItems(this)) {
        this.#fTail.attachRender(p);
        this.#fTail.render();
      } else {
        this.#fTail.detachRender();
        p.clear();
      }
    }
  }

  #isFragmentInViewPort(f) {
    let r = f.getRender();
    return r && r.isInViewPort();
  }

  #clearBuffer() {
    this.#fItems = [];
    this.#idOffset = 0;
  }
};

ui.BufferedList = BufferedList;
}(window.ui = window.ui || {}));
