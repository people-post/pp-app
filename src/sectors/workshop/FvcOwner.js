import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FHeaderMenu } from '../../lib/ui/controllers/fragments/FHeaderMenu.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { Account } from '../../common/dba/Account.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { MainMenu } from '../../common/menu/MainMenu.js';
import { FSearchMenu } from '../../common/search/FSearchMenu.js';
import { FOwnerProjectList } from './FOwnerProjectList.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { ID, URL_PARAM } from '../../common/constants/Constants.js';
import { ICON } from '../../common/constants/Icons.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';

export class FvcOwner extends FScrollViewContent {
  #fmMain;
  #fmSearch;
  #fList;
  #fBtnNew;
  #currentMenuItem = null;

  constructor() {
    super();
    this.#fmMain = new FHeaderMenu();
    this.#fmMain.setIcon(ICON.M_MENU, new MainIconOperator());
    let f = new MainMenu();
    f.setSector(ID.SECTOR.WORKSHOP);
    f.setDelegate(this);
    this.#fmMain.setContentFragment(f);
    this.#fmMain.setExpansionPriority(0);

    this.#fmSearch = new FHeaderMenu();
    this.#fmSearch.setIcon(ICON.M_SEARCH, new SearchIconOperator());
    f = new FSearchMenu();
    f.setDelegate(this);
    this.#fmSearch.setContentFragment(f);
    this.#fmSearch.setExpansionPriority(1);

    this.#fList = new FOwnerProjectList();
    this.#fList.setDataSource(this);
    this.#fList.setDelegate(this);
    this.setChild("list", this.#fList);

    this.#fBtnNew = new ActionButton();
    this.#fBtnNew.setIcon(ActionButton.T_ICON.NEW);
    this.#fBtnNew.setDelegate(this);
  }

  initFromUrl(urlParam) {
    let id = urlParam.get(URL_PARAM.ID);
    if (id) {
      let sid = SocialItemId.fromEncodedStr(id);
      if (sid) {
        this.#fList.switchToItem(sid.getValue());
      }
    }
  }

  getUrlParamString() {
    let id = this.#fList.getCurrentId();
    if (id) {
      let sid = new SocialItemId(id, SocialItem.TYPE.PROJECT);
      return URL_PARAM.ID + "=" + sid.toEncodedStr();
    }
    return "";
  }

  isReloadable() { return true; }
  hasHiddenTopBuffer() { return this.#fList.hasBufferOnTop(); }

  getMenuFragments() { return [ this.#fmMain, this.#fmSearch ]; }

  getActionButton() {
    if (Account.isAuthenticated() && Account.isWebOwner()) {
      return this.#fBtnNew;
    }
    return null;
  }

  getTagIdsForProjectListFragment(fProjectList) {
    return this.#currentMenuItem ? this.#currentMenuItem.getTagIds() : [];
  }

  setOwnerId(ownerId) { this.#fList.setOwnerId(ownerId); }

  reload() { this.#fList.reload(); }

  scrollToTop() { this.#fList.scrollToItemIndex(0); }
  onScrollFinished() { this.#fList.onScrollFinished(); }

  onGuiActionButtonClick(fActionButton) {
    this._delegate.onWorkshopOwnerFragmentRequestCreateProject(this);
  }

  onItemSelectedInGuiMainMenu(fMainMenu, menuItem) {
    this.#prepare(menuItem);
    this.#applyTheme();

    this.#fmMain.close();
    Events.triggerTopAction(T_ACTION.REPLACE_STATE, {}, "Projects");
  }

  _onRenderAttached(render) {
    super._onRenderAttached(render);
    this.#applyTheme();
  }

  _renderContentOnRender(render) {
    this.#fList.attachRender(render);
    this.#fList.render();
  }

  #prepare(menuItem) {
    if (this.#currentMenuItem != menuItem) {
      this.#currentMenuItem = menuItem;
      this.#fList.reload();
    }
  }

  #applyTheme() {
    WebConfig.setThemeId(
        this.#currentMenuItem ? this.#currentMenuItem.getId() : null);
  }
};
