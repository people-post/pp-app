import { MenuContent } from '../menu/MenuContent.js';
import { SearchBar } from '../gui/SearchBar.js';
import { Factory, T_OBJ } from '../../lib/framework/Factory.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FSearch } from './FSearch.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export interface FSearchMenuDelegate {
  onMenuFragmentRequestCloseMenu(f: FSearchMenu): void;
}

export class FSearchMenu extends MenuContent {
  #fBar: SearchBar;
  #tResultLayout: symbol | null = null;

  constructor() {
    super();
    this.#fBar = new SearchBar();
    this.#fBar.setMenuRenderMode(true);
    this.#fBar.setDelegate(this);
    this.setChild("searchbar", this.#fBar);
  }

  setResultLayoutType(t: symbol | null): void { this.#tResultLayout = t; }

  onGuiSearchBarRequestSearch(_fSearchBar: SearchBar, value: string): void {
    this.getDelegate<FSearchMenuDelegate>()?.onMenuFragmentRequestCloseMenu(this);
    let cls = Factory.getRequiredCtor<FSearch>(
      T_OBJ.SEARCH_RESULT_VIEW_CONTENT_FRAGMENT);
    let f = new cls();
    f.setKey(value);
    f.setResultLayoutType(this.#tResultLayout);
    let v = new View();
    v.setContentFragment(f);
    this.onFragmentRequestShowView(this, v, "Search result");
  }

  _renderOnRender(render: PanelWrapper): void {
    this.#fBar.setFatMode(!this._isQuickLinkRenderMode);
    this.#fBar.attachRender(render);
    this.#fBar.render();
  }
}

export default FSearchMenu;
