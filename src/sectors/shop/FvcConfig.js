export const CF_SHOP_CONFIG = {
  ON_NAME_CHANGE : Symbol(),
};

const _CFT_SHOP_CONFIG = {
  SHOP_NAME :
      `<input type="text" class="tight-label-like border-box" placeholder="Your shop name" value="__VALUE__" onchange="javascript:G.action(shop.CF_SHOP_CONFIG.ON_NAME_CHANGE, this.value)">`,
};

import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { OptionSwitch } from '../../lib/ui/controllers/fragments/OptionSwitch.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ButtonGroup } from '../../lib/ui/controllers/fragments/ButtonGroup.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { ID, MAX } from '../../common/constants/Constants.js';
import { MenuConfig } from '../../common/menu/MenuConfig.js';
import { FBranchList } from './FBranchList.js';
import { FProductInfoLayoutPreview } from './FProductInfoLayoutPreview.js';
import { FProduct } from './FProduct.js';
import { FvcBranch } from './FvcBranch.js';
import { FTeam } from './FTeam.js';
import { Shop } from '../../common/dba/Shop.js';
import { Menus } from '../../common/dba/Menus.js';
import { Account } from '../../common/dba/Account.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { T_DATA } from '../../common/plt/Events.js';
import { T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';

export class FvcConfig extends FScrollViewContent {
  #fTeams;
  #fOptions;
  #fMenuConfig;
  #fBranches;
  #fLayout;
  #btnAddTeam;
  #btnClose;
  #selectedTeamId = null;

  constructor() {
    super();
    this.#fTeams = new FSimpleFragmentList();
    this.setChild("teams", this.#fTeams);

    this.#fOptions = new OptionSwitch();
    this.#fOptions.addOption("Set as home page", "HOME");
    this.#fOptions.setDelegate(this);
    this.setChild("options", this.#fOptions);

    this.#fMenuConfig = new MenuConfig();
    this.#fMenuConfig.setDataSource(this);
    this.#fMenuConfig.setDelegate(this);
    this.#fMenuConfig.setSectorId(ID.SECTOR.SHOP);
    this.setChild("mainMenu", this.#fMenuConfig);

    this.#fBranches = new FBranchList();
    this.#fBranches.setEnableEdit(true);
    this.#fBranches.setDelegate(this);
    this.setChild("branches", this.#fBranches);

    this.#btnAddTeam = new Button();
    this.#btnAddTeam.setName("New team...");
    this.#btnAddTeam.setDelegate(this);
    this.setChild("btnAddTeam", this.#btnAddTeam);

    this.#btnClose = new Button();
    this.#btnClose.setName("Close shop...");
    this.#btnClose.setThemeType(Button.T_THEME.DANGER);
    this.#btnClose.setDelegate(this);
    this.setChild("btnClose", this.#btnClose);

    this.#fLayout = new ButtonGroup();
    this.#fLayout.setDelegate(this);
    let f = new FProductInfoLayoutPreview();
    f.setDelegate(this);
    f.setDescription(R.get("INTRO_MEDIUM_SIZE"));
    let fInfo = new FProduct()
    fInfo.setSizeType(SocialItem.T_LAYOUT.MEDIUM);
    f.setInfoFragment(fInfo);
    this.#fLayout.addChoice(
        {name : "Medium", value : SocialItem.T_LAYOUT.MEDIUM, fDetail : f});
    f = new FProductInfoLayoutPreview();
    f.setDelegate(this);
    f.setDescription(R.get("INTRO_LARGE_SIZE"));
    fInfo = new FProduct()
    fInfo.setSizeType(SocialItem.T_LAYOUT.LARGE);
    f.setInfoFragment(fInfo);
    this.#fLayout.addChoice(
        {name : "Large", value : SocialItem.T_LAYOUT.LARGE, fDetail : f});
    this.setChild("layout", this.#fLayout);
  }

  shouldHighlightInTeamFragment(fTeam, teamId) {
    return teamId && (teamId == this.#selectedTeamId);
  }
  getTeamForTeamFragment(fTeam, teamId) { return Shop.getTeam(teamId); }
  getMenuForGuiMenuConfig(fMenuConfig) {
    let menus = Menus.get(ID.SECTOR.SHOP, Account.getId());
    return menus.length ? menus[0] : null;
  }

  onClickInTeamFragment(fTeam) {
    let teamId = fTeam.getTeamId();
    this.#selectedTeamId = teamId;
    this.#onEditTeam(teamId);
    this.#fTeams.render();
  }

  onSimpleButtonClicked(fBtn) {
    switch (fBtn) {
    case this.#btnAddTeam:
      this.#onAddTeam();
      break;
    case this.#btnClose:
      this.#onCloseShop();
      break;
    default:
      break;
    }
  }

  onButtonGroupSelectionChanged(fButtonGroup, value) {}
  onProductInfoPreviewFragmentRequestApplySize(fPreview, sizeType) {
    this.#asyncUpdateInfoViewSizeConfig(sizeType);
  }

  onBranchListFragmentRequestShowView(fBranchList, view, title) {
    this._owner.onFragmentRequestShowView(this, view, title);
  }

  onBranchSelectedInBranchListFragment(fBranchList, branchId) {
    let v = new View();
      let f = new FvcBranch();
    f.setBranchId(branchId);
    f.setEnableEdit(true);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Branch config");
  }

  onOptionChangeInOptionsFragment(fOptions, value, isChecked) {
    if (value == "HOME") {
      WebConfig.asyncSetHomeSector(isChecked ? ID.SECTOR.SHOP
                                                 : ID.SECTOR.BLOG);
    }
  }

  action(type, ...args) {
    switch (type) {
    case shop.CF_SHOP_CONFIG.ON_NAME_CHANGE:
      this.#onNameChange(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case FwkT_DATA.WEB_CONFIG:
    case T_DATA.GROUPS:
    case T_DATA.SHOP_CONFIG:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);

    let config = Shop.getConfig();

    let pp = new SectionPanel("Options");
    p.pushPanel(pp);
    this.#fOptions.setOption("HOME",
                             WebConfig.getHomeSector() == ID.SECTOR.SHOP);
    this.#fOptions.attachRender(pp.getContentPanel());
    this.#fOptions.render();

    if (config) {
      pp = new SectionPanel("Shop name");
      p.pushPanel(pp);
      pp.getContentPanel().replaceContent(this.#renderName(config.name));
    }

    pp = new SectionPanel("Main menu");
    p.pushPanel(pp);
    this.#fMenuConfig.attachRender(pp.getContentPanel());
    this.#fMenuConfig.render();

    p.pushSpace(1);

    pp = new SectionPanel("Layout");
    p.pushPanel(pp);
    this.#fLayout.setSelectedValue(Shop.getItemLayoutType());
    this.#fLayout.attachRender(pp);
    this.#fLayout.render();

    p.pushSpace(1);

    pp = new SectionPanel("Teams");
    p.pushPanel(pp);
    this.#fTeams.clear();
    for (let id of Shop.getTeamIds()) {
      let f = new FTeam();
      f.setTeamId(id);
      f.setDataSource(this);
      f.setDelegate(this);
      this.#fTeams.append(f);
    }
    this.#fTeams.attachRender(pp.getContentPanel());
    this.#fTeams.render();
    p.pushSpace(1);

    if (Shop.getTeamIds().length < MAX.N_TEAMS) {
      pp = new PanelWrapper();
      p.pushPanel(pp);
      this.#btnAddTeam.attachRender(pp);
      this.#btnAddTeam.render();
      p.pushSpace(1);
    }

    pp = new SectionPanel("Branches");
    p.pushPanel(pp);
    this.#fBranches.attachRender(pp.getContentPanel());
    this.#fBranches.render();

    p.pushSpace(1);

    pp = new Panel();
    p.pushPanel(pp);
    this.#btnClose.attachRender(pp);
    this.#btnClose.render();
  }

  #renderName(name) {
    let s = _CFT_SHOP_CONFIG.SHOP_NAME;
    s = s.replace("__VALUE__", name ? name : "");
    return s;
  }

  #onNameChange(newName) {
    let c = Shop.getConfig();
    if (c) {
      c.name = newName;
      Shop.asyncUpdateConfig(c);
    }
  }

  #onAddTeam() { this._delegate.onShopConfigFragmentRequestAddTeam(this); }
  #onEditTeam(teamId) {
    this._delegate.onShopConfigFragmentRequestEditTeam(this, teamId);
  }

  #onCloseShop() {
    this._confirmDangerousOperation(
        R.get("CLOSE_SHOP_PROMPT"),
        () => this._delegate.onShopConfigFragmentRequestCloseShop(this));
  }

  #asyncUpdateInfoViewSizeConfig(sizeType) {
    let fd = new FormData();
    this.#fillItemLayoutType(fd, sizeType);
    // dba.Shop.asyncUpdateConfig(fd)
  }

  #asyncUpdateOptionsConfig() {
    let fd = new FormData();
    this.#fillItemLayoutType(fd);
    // dba.Shop.asyncUpdateConfig(fd)
  }

  #fillItemLayoutType(fd, sType = null) {
    fd.append("item_layout_type", sType ? sType : dba.Shop.getItemLayoutType());
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.CF_SHOP_CONFIG = CF_SHOP_CONFIG;
}