import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { SearchBar } from '../gui/SearchBar.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { FSearchResultInfo } from './FSearchResultInfo.js';
import { SearchResult } from '../datatypes/SearchResult.js';

const _CFT_SEARCH = {
  BRIEF : `Results found: __N_RESULTS__`,
  NO_RESULT :
      `We are sorry that we couldn't find any meaningful result, please try again...`,
};

interface SearchCache {
  key: string;
  result: SearchResult;
}

export class FSearch extends Fragment {
  #fBar: SearchBar;
  #fContent: FSimpleFragmentList;
  #tResultLayout: string | null = null;
  #cache: SearchCache | null = null;

  constructor() {
    super();
    this.#fBar = new SearchBar();
    this.#fBar.setFatMode(true);
    this.#fBar.setDelegate(this);
    this.setChild("bar", this.#fBar);

    this.#fContent = new FSimpleFragmentList();
    this.setChild("content", this.#fContent);
  }

  getKey(): string { return this.#fBar.getKey(); }
  getResultLayoutType(): string | null { return this.#tResultLayout; }

  setKey(key: string): void { this.#fBar.setKey(key); }
  setResultLayoutType(t: string | null): void { this.#tResultLayout = t; }

  onClickInSearchResultInfoFragment(_fInfo: FSearchResultInfo, itemType: string, itemId: string): void {
    // @ts-expect-error - delegate may have this method
    this._delegate?.onSearchResultClickedInSearchFragment?.(this, itemType, itemId);
  }

  onGuiSearchBarRequestSearch(_fSearchBar: SearchBar, _key: string): void {
    this.#cache = null;
    this.render();
  }

  _doSearch(_key: string): SearchResult | null { return null; }
  _clearCache(): void { this.#cache = null; }

  _renderOnRender(render: ReturnType<typeof this.getRender>): void {
    let p = new ListPanel();
    render.wrapPanel(p);

    let pp = new PanelWrapper();
    p.pushPanel(pp);
    this.#fBar.attachRender(pp);
    this.#fBar.render();

    pp = new Panel();
    pp.setClassName("s-font5 cdimgray search-result-brief");
    p.pushPanel(pp);

    let r = this.#getResult(this.#fBar.getKey());
    if (r) {
      if (r.size() == 0) {
        pp.replaceContent(_CFT_SEARCH.NO_RESULT);
      } else {
        let s = _CFT_SEARCH.BRIEF;
        s = s.replace("__N_RESULTS__", r.size().toString());
        pp.replaceContent(s);
      }
    }

    pp = new PanelWrapper();
    p.pushPanel(pp);
    this.#fContent.clear();
    if (r) {
      for (let item of r.getItems()) {
        let f = new FSearchResultInfo();
        f.setLayoutType(this.#tResultLayout);
        f.setData(item);
        f.setDelegate(this);
        this.#fContent.append(f);
      }
    }
    this.#fContent.attachRender(pp);
    this.#fContent.render();

    p.pushSpace(3);
  }

  _updateResult(key: string, result: SearchResult): void {
    this.#cache = {key : key, result : result};
    this.render();
  }

  #getResult(key: string): SearchResult | null {
    let d = this.#cache;
    if (d && d.key == key) {
      return d.result;
    }
    let r = this._doSearch(key);
    if (r) {
      this._updateResult(key, r);
    }
    return r;
  }
}

export default FSearch;
