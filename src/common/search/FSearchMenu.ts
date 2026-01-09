import { MenuContent } from '../menu/MenuContent.js';
import { SearchBar } from '../gui/SearchBar.js';
import { Factory, T_CATEGORY, T_OBJ } from '../../lib/framework/Factory.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FSearch } from './FSearch.js';

export class FSearchMenu extends MenuContent {
  #fBar: SearchBar;
  #tResultLayout: string | null = null;

  constructor() {
    super();
    this.#fBar = new SearchBar();
    this.#fBar.setMenuRenderMode(true);
    this.#fBar.setDelegate(this);
    this.setChild("searchbar", this.#fBar);
  }

  setResultLayoutType(t: string | null): void { this.#tResultLayout = t; }

  onGuiSearchBarRequestSearch(_fSearchBar: SearchBar, value: string): void {
    // @ts-expect-error - delegate may have this method
    this._delegate?.onMenuFragmentRequestCloseMenu?.(this);
    let cls = Factory.getClass(
        T_CATEGORY.UI, T_OBJ.SEARCH_RESULT_VIEW_CONTENT_FRAGMENT) as typeof FSearch;
    let f = new cls();
    f.setKey(value);
    f.setResultLayoutType(this.#tResultLayout);
    let v = new View();
    v.setContentFragment(f);
    // @ts-expect-error - owner may have this method
    this._owner?.onFragmentRequestShowView?.(this, v, "Search result");
  }

  _renderOnRender(render: ReturnType<typeof this.getRender>): void {
    this.#fBar.setFatMode(!this._isQuickLinkRenderMode);
    this.#fBar.attachRender(render);
    this.#fBar.render();
  }
}

export default FSearchMenu;
