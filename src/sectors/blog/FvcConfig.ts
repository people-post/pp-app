(window as any).CF_BLOG_CONFIG = {
  ADD_ROLE : "CF_BLOG_CONFIG_1",
};

const _CFT_BLOG_CONFIG_CONTENT = {
  ROLE_NAME_CELL : `__NAME__(__TOTAL__)`,
  BTN_NEW_ROLE : `<br>
    <a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(CF_BLOG_CONFIG.ADD_ROLE)">New writer group...</a>
    <br>`,
} as const;

import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FTabbedPane } from '../../lib/ui/controllers/fragments/FTabbedPane.js';
import { OptionSwitch } from '../../lib/ui/controllers/fragments/OptionSwitch.js';
import { ButtonGroup } from '../../lib/ui/controllers/fragments/ButtonGroup.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import type { Panel as PanelType } from '../../lib/ui/renders/panels/Panel.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ID, MAX } from '../../common/constants/Constants.js';
import { ICON } from '../../common/constants/Icons.js';
import { MenuConfig } from '../../common/menu/MenuConfig.js';
import { Blog } from '../../common/dba/Blog.js';
import { Menus } from '../../common/dba/Menus.js';
import { FRoleList } from './FRoleList.js';
import { FPostInfo } from './FPostInfo.js';
import { FPostInfoLayoutPreview } from './FPostInfoLayoutPreview.js';
import { FvcRoleEditor } from './FvcRoleEditor.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { BlogRole } from '../../common/datatypes/BlogRole.js';
import { T_DATA } from '../../common/plt/Events.js';
import { R } from '../../common/constants/R.js';
import { Api } from '../../common/plt/Api.js';

export class FvcConfig extends FScrollViewContent {
  private _fInsiders: FRoleList;
  private _fPartnerships: FRoleList;
  private _fRoles: FTabbedPane;
  private _fMenuConfig: MenuConfig;
  private _fOptions: OptionSwitch;
  private _fLayout: ButtonGroup;

  constructor() {
    super();
    this._fInsiders = new FRoleList();
    this._fInsiders.setRoleType(BlogRole.T_ROLE.EXCLUSIVE);
    this._fInsiders.setDelegate(this);
    this._fPartnerships = new FRoleList();
    this._fPartnerships.setRoleType(BlogRole.T_ROLE.PARTNERSHIP);
    this._fPartnerships.setDelegate(this);
    this._fRoles = new FTabbedPane();
    this._fRoles.addPane(
        {name : "Insiders", value : "INSIDER", icon : ICON.EMPLOYEE},
        this._fInsiders);
    this._fRoles.addPane({
      name : "Coalitionists",
      value : "PARTNERSHIP",
      icon : ICON.PARTNERSHIP
    },
                         this._fPartnerships);
    this._fRoles.setDefaultPane("INSIDER");
    this.setChild("roles", this._fRoles);

    this._fMenuConfig = new MenuConfig();
    this._fMenuConfig.setDataSource(this);
    this._fMenuConfig.setDelegate(this);
    this._fMenuConfig.setSectorId(ID.SECTOR.BLOG);
    this.setChild("mainMenu", this._fMenuConfig);

    this._fOptions = new OptionSwitch();
    this._fOptions.addOption("Enable social action", "SOCIAL");
    this._fOptions.addOption("Use \"big head\" style for pinned",
                             "PIN_BIG_HEAD");
    this._fOptions.setDelegate(this);
    this.setChild("options", this._fOptions);

    let f = new FPostInfoLayoutPreview();
    f.setDelegate(this);
    f.setDescription(R.get("INTRO_COMPACT_SIZE"));
    let fInfo = new FPostInfo();
    fInfo.setSizeType(SocialItem.T_LAYOUT.COMPACT);
    f.setInfoFragment(fInfo);
    this._fLayout = new ButtonGroup();
    this._fLayout.addChoice({
      name : "Compact",
      value : SocialItem.T_LAYOUT.COMPACT,
      fDetail : f
    });
    f = new FPostInfoLayoutPreview();
    f.setDelegate(this);
    f.setDescription(R.get("INTRO_SMALL_SIZE"));
    fInfo = new FPostInfo();
    fInfo.setSizeType(SocialItem.T_LAYOUT.SMALL);
    f.setInfoFragment(fInfo);
    this._fLayout.addChoice(
        {name : "Small", value : SocialItem.T_LAYOUT.SMALL, fDetail : f});
    f = new FPostInfoLayoutPreview();
    f.setDelegate(this);
    f.setDescription(R.get("INTRO_MEDIUM_SIZE"));
    fInfo = new FPostInfo();
    fInfo.setSizeType(SocialItem.T_LAYOUT.MEDIUM);
    f.setInfoFragment(fInfo);
    this._fLayout.addChoice(
        {name : "Medium", value : SocialItem.T_LAYOUT.MEDIUM, fDetail : f});
    f = new FPostInfoLayoutPreview();
    f.setDelegate(this);
    f.setDescription(R.get("INTRO_LARGE_SIZE"));
    fInfo = new FPostInfo();
    fInfo.setSizeType(SocialItem.T_LAYOUT.LARGE);
    f.setInfoFragment(fInfo);
    this._fLayout.addChoice(
        {name : "Large", value : SocialItem.T_LAYOUT.LARGE, fDetail : f});
    f = new FPostInfoLayoutPreview();
    f.setDelegate(this);
    f.setDescription(R.get("INTRO_BIG_HEAD_SIZE"));
    fInfo = new FPostInfo();
    fInfo.setSizeType(SocialItem.T_LAYOUT.BIG_HEAD);
    f.setInfoFragment(fInfo);
    this._fLayout.addChoice({
      name : "Big head",
      value : SocialItem.T_LAYOUT.BIG_HEAD,
      fDetail : f
    });
    this._fLayout.setDelegate(this);
    this.setChild("layout", this._fLayout);
  }

  getMenuForGuiMenuConfig(_fMenuConfig: MenuConfig): unknown {
    let menus = Menus.get(ID.SECTOR.BLOG, window.dba.Account.getId());
    return menus.length ? menus[0] : null;
  }

  onButtonGroupSelectionChanged(_fButtonGroup: ButtonGroup, _value: string): void {}
  onOptionChangeInOptionsFragment(_fOptions: OptionSwitch, _value: string, _isChecked: boolean): void {
    this.#asyncUpdateOptionsConfig();
  }
  onPostInfoPreviewFragmentRequestApplySize(_fPreview: FPostInfoLayoutPreview, sizeType: string): void {
    this.#asyncUpdateInfoViewSizeConfig(sizeType);
  }
  onRoleListFragmentRequestEditRole(_fRoleList: FRoleList, roleId: string): void {
    let v = new View();
    let f = new FvcRoleEditor();
    f.setRoleId(roleId);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Blog role");
  }

  handleSessionDataUpdate(dataType: symbol, _data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PROFILE:
      this._owner.onContentFragmentRequestUpdateHeader(this);
      this.render();
      break;
    case T_DATA.GROUPS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, _data);
  }

  action(type: symbol, ..._args: unknown[]): void {
    switch (type) {
    case (window as any).CF_BLOG_CONFIG.ADD_ROLE:
      this.#onAddRole();
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  _renderContentOnRender(render: PanelType): void {
    let p = new ListPanel();
    render.wrapPanel(p);

    let pp = new SectionPanel("Layout");
    p.pushPanel(pp);
    this._fLayout.setSelectedValue(Blog.getItemLayoutType());
    this._fLayout.attachRender(pp);
    this._fLayout.render();

    pp = new SectionPanel("Main menu");
    p.pushPanel(pp);
    this._fMenuConfig.attachRender(pp.getContentPanel());
    this._fMenuConfig.render();

    pp = new SectionPanel("Options");
    p.pushPanel(pp);
    this._fOptions.setOption("SOCIAL", Blog.isSocialEnabled());
    this._fOptions.setOption("PIN_BIG_HEAD",
                             Blog.getPinnedItemLayoutType() ==
                                 SocialItem.T_LAYOUT.BIG_HEAD);
    this._fOptions.attachRender(pp.getContentPanel());
    this._fOptions.render();

    pp = new SectionPanel("Collaborations");
    p.pushPanel(pp);
    this._fRoles.attachRender(pp.getContentPanel());
    this._fRoles.render();
    if (Blog.getRoleIds().length < MAX.N_ROLES) {
      pp = new Panel();
      p.pushPanel(pp);
      pp.replaceContent(_CFT_BLOG_CONFIG_CONTENT.BTN_NEW_ROLE);
    }
  }

  #onAddRole(): void {
    let v = new View();
    v.setContentFragment(new FvcRoleEditor());
    this._owner.onFragmentRequestShowView(this, v, "Blog role");
  }

  #asyncUpdateInfoViewSizeConfig(sizeType: string): void {
    let fd = new FormData();
    this.#fillItemLayoutType(fd, sizeType);
    this.#fillOptionsData(fd);
    this.#asyncUpdateConfig(fd);
  }

  #asyncUpdateOptionsConfig(): void {
    let fd = new FormData();
    this.#fillItemLayoutType(fd);
    this.#fillOptionsData(fd);
    this.#asyncUpdateConfig(fd);
  }

  #fillItemLayoutType(fd: FormData, sType: string | null = null): void {
    fd.append("item_layout_type", sType ? sType : Blog.getItemLayoutType());
  }

  #fillOptionsData(fd: FormData): void {
    if (this._fOptions.isOptionOn("SOCIAL")) {
      fd.append("enable_social_action", "1");
    }
    if (this._fOptions.isOptionOn("PIN_BIG_HEAD")) {
      fd.append("pinned_item_layout_type", SocialItem.T_LAYOUT.BIG_HEAD);
    } else {
      let itemLayoutType = fd.get("item_layout_type");
      if (itemLayoutType) {
        fd.append("pinned_item_layout_type", String(itemLayoutType));
      }
    }
  }

  #asyncUpdateConfig(fd: FormData): void {
    let url = "api/blog/update_config";
    Api.asFragmentPost(this, url, fd)
        .then((d: {config: unknown}) => this.#onUpdateConfigRRR(d));
  }

  #onUpdateConfigRRR(data: {config: unknown}): void {
    Blog.resetConfig(data.config);
    this.render();
  }
};
