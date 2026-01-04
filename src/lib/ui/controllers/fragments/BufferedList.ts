import { Fragment } from './Fragment.js';
import { BufferedListPanel } from '../../renders/panels/BufferedListPanel.js';
import { FLoading } from './FLoading.js';
import { PanelWrapper } from '../../renders/panels/PanelWrapper.js';

const _CFT_LONG_LIST = {
  EMPTY : `<div class="center-align">Empty list</div>`,
} as const;

interface BufferedListDataSource {
  createFragmentForBufferedListItem(f: BufferedList, id: number): Fragment | null;
  isBufferedListExpectingMoreHeadItems(f: BufferedList): boolean;
  isBufferedListExpectingMoreTrailingItems(f: BufferedList): boolean;
}

interface BufferedListDelegate {
  shouldBufferedListClearBuffer(f: BufferedList): boolean;
  onContentTopResizeBeginInFragment(f: Fragment): void;
  onContentTopResizeEndInFragment(f: Fragment): void;
}

export class BufferedList extends Fragment {
  #idOffset: number = 0;
  #bufferSize: number = 20; // Buffer at each end
  #cacheSize: number = 200; // Full size
  #isGridMode: boolean = false;
  #isTopBufferReductionEnabled: boolean = true;
  #panel: BufferedListPanel;
  #fHead: FLoading;
  #fTail: FLoading;
  #fItems: Fragment[] = [];

  protected declare _dataSource: BufferedListDataSource;
  protected declare _delegate: BufferedListDelegate;

  constructor() {
    super();
    this.#panel = new BufferedListPanel();

    this.#fHead = new FLoading();
    this.setChild("head", this.#fHead);

    this.#fTail = new FLoading();
    this.setChild("tail", this.#fTail);
  }

  getFirstId(): number { return this.#idOffset; }

  setEnableTopBuffer(b: boolean): void { this.#isTopBufferReductionEnabled = b; }
  setGridMode(b: boolean): void { this.#isGridMode = b; }

  onScrollFinished(): void {
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

  reload(): void {
    this.#clearBuffer();
    this.render();
  }

  refresh(): void {
    for (let f of this.#fItems) {
      f.render();
    }
  }

  scrollTo(id: number): void {
    if (id < this.#idOffset || id > this.#idOffset + this.#fItems.length) {
      this.#idOffset = id;
      this.#fItems = [];
      this.render();
    }
  }

  _getAllChildControllers(): any[] {
    let cs: any[] = [];
    cs.push(...super._getAllChildControllers());
    cs.push(...this.#fItems);
    return cs;
  }

  _renderOnRender(render: any): void {
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

  #createItemPanel(): PanelWrapper {
    let p = new PanelWrapper();
    if (this.#isGridMode) {
      p.setClassName("inline-block");
    }
    return p;
  }

  #loadInitialItems(): void {
    this.#reserveHeadBuffer(this.#bufferSize);
    this.#reserveTailBuffer(this.#bufferSize);
  }

  #createFragment(id: number): Fragment | null {
    let f = this._dataSource.createFragmentForBufferedListItem(this, id);
    if (f) {
      f.setOwner(this);
    }
    return f;
  }

  #reserveHeadBuffer(n: number): void {
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

  #reserveTailBuffer(n: number): void {
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

  #isFragmentInViewPort(f: Fragment): boolean {
    let r = f.getRender();
    return r ? r.isInViewPort() : false;
  }

  #clearBuffer(): void {
    this.#fItems = [];
    this.#idOffset = 0;
  }
}

