import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FHeaderMenu } from '../../lib/ui/controllers/fragments/FHeaderMenu.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { FSearchMenu } from '../../common/search/FSearchMenu.js';
import { FIdolProjectList } from './FIdolProjectList.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { URL_PARAM } from '../../common/constants/Constants.js';
import { ICON } from '../../common/constants/Icons.js';
import { SearchIconOperator } from '../../lib/ui/animators/SearchIconOperator.js';
import type Render from '../../lib/ui/renders/Render.js';

interface ExplorerDelegate {
  onWorkshopExplorerFragmentRequestCreateProject(f: FvcExplorer): void;
}

export class FvcExplorer extends FScrollViewContent {
  #fmSearch: FHeaderMenu;
  #fList: FIdolProjectList;
  #fBtnNew: ActionButton;
  protected _delegate!: ExplorerDelegate;

  constructor() {
    super();
    this.#fmSearch = new FHeaderMenu();
    this.#fmSearch.setIcon(ICON.M_SEARCH, new SearchIconOperator());
    let f = new FSearchMenu();
    f.setDelegate(this);
    this.#fmSearch.setContentFragment(f);

    this.#fList = new FIdolProjectList();
    this.#fList.setDelegate(this);
    this.setChild("list", this.#fList);

    this.#fBtnNew = new ActionButton();
    this.#fBtnNew.setIcon(ActionButton.T_ICON.NEW);
    this.#fBtnNew.setDelegate(this);
  }

  initFromUrl(urlParam: URLSearchParams): void {
    let id = urlParam.get(URL_PARAM.ID);
    if (id) {
      let sid = SocialItemId.fromEncodedStr(id);
      if (sid) {
        this.#fList.switchToItem(sid.getValue());
      }
    }
  }

  getUrlParamString(): string {
    let id = this.#fList.getCurrentId();
    if (id) {
      let sid = new SocialItemId(id, SocialItem.TYPE.PROJECT);
      return URL_PARAM.ID + "=" + sid.toEncodedStr();
    }
    return "";
  }

  isReloadable(): boolean { return true; }
  hasHiddenTopBuffer(): boolean { return this.#fList.hasBufferOnTop(); }

  getActionButton(): ActionButton | null {
    if (window.dba.Account.isAuthenticated() && window.dba.Account.isWebOwner()) {
      return this.#fBtnNew;
    }
    return null;
  }

  getMenuFragments(): FHeaderMenu[] { return [ this.#fmSearch ]; }

  reload(): void { this.#fList.reload(); }

  scrollToTop(): void { this.#fList.scrollToItemIndex(0); }
  onScrollFinished(): void { this.#fList.onScrollFinished(); }

  onGuiActionButtonClick(fActionButton: ActionButton): void {
    this._delegate.onWorkshopExplorerFragmentRequestCreateProject(this);
  }

  _renderContentOnRender(render: Render): void {
    this.#fList.attachRender(render);
    this.#fList.render();
  }
};
