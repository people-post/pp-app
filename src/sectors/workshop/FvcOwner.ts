import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FHeaderMenu } from '../../lib/ui/controllers/fragments/FHeaderMenu.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { MainMenu } from '../../common/menu/MainMenu.js';
import { FSearchMenu } from '../../common/search/FSearchMenu.js';
import { FOwnerProjectList } from './FOwnerProjectList.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { ID, URL_PARAM } from '../../common/constants/Constants.js';
import { ICON } from '../../common/constants/Icons.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { MainIconOperator } from '../../lib/ui/animators/MainIconOperator.js';
import { SearchIconOperator } from '../../lib/ui/animators/SearchIconOperator.js';
import type { MenuItem } from '../../common/menu/MenuItem.js';
import type Render from '../../lib/ui/renders/Render.js';

interface WorkshopOwnerDelegate {
  onWorkshopOwnerFragmentRequestCreateProject(f: FvcOwner): void;
}

export class FvcOwner extends FScrollViewContent {
  #fmMain: FHeaderMenu;
  #fmSearch: FHeaderMenu;
  #fList: FOwnerProjectList;
  #fBtnNew: ActionButton;
  #currentMenuItem: MenuItem | null = null;
  protected _delegate!: WorkshopOwnerDelegate;

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

  initFromUrl(urlParam: Map<string, string>): void {
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

  getMenuFragments(): FHeaderMenu[] { return [ this.#fmMain, this.#fmSearch ]; }

  getActionButton(): ActionButton | null {
    if (window.dba.Account.isAuthenticated() && window.dba.Account.isWebOwner()) {
      return this.#fBtnNew;
    }
    return null;
  }

  getTagIdsForProjectListFragment(_fProjectList: unknown): string[] {
    return this.#currentMenuItem ? this.#currentMenuItem.getTagIds() : [];
  }

  setOwnerId(ownerId: string | null): void { this.#fList.setOwnerId(ownerId); }

  reload(): void { this.#fList.reload(); }

  scrollToTop(): void { this.#fList.scrollToItemIndex(0); }
  onScrollFinished(): void { this.#fList.onScrollFinished(); }

  onGuiActionButtonClick(_fActionButton: ActionButton): void {
    this._delegate.onWorkshopOwnerFragmentRequestCreateProject(this);
  }

  onItemSelectedInGuiMainMenu(_fMainMenu: MainMenu, menuItem: MenuItem): void {
    this.#prepare(menuItem);
    this.#applyTheme();

    this.#fmMain.close();
    Events.triggerTopAction(T_ACTION.REPLACE_STATE, {}, "Projects");
  }

  _onRenderAttached(render: Render): void {
    super._onRenderAttached(render);
    this.#applyTheme();
  }

  _renderContentOnRender(render: Render): void {
    this.#fList.attachRender(render);
    this.#fList.render();
  }

  #prepare(menuItem: MenuItem): void {
    if (this.#currentMenuItem != menuItem) {
      this.#currentMenuItem = menuItem;
      this.#fList.reload();
    }
  }

  #applyTheme(): void {
    WebConfig.setThemeId(
        this.#currentMenuItem ? this.#currentMenuItem.getId() : null);
  }
}
