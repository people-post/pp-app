import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { TextArea } from '../../lib/ui/controllers/fragments/TextArea.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { NumberInput } from '../../lib/ui/controllers/fragments/NumberInput.js';
import { CommunityProfile } from '../../common/datatypes/CommunityProfile.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { FHeaderEditor, type HeaderEditorDelegate } from './FHeaderEditor.js';
import { FvcCoinHistory } from './FvcCoinHistory.js';
import { FvcFinanceHistory } from './FvcFinanceHistory.js';
import { FvcConfigEditor, type CommunityConfigDelegate } from './FvcConfigEditor.js';
import { FvcProposalEditor } from './FvcProposalEditor.js';
import { FUserInfo } from '../../common/hr/FUserInfo.js';
import { FvcUserInput } from '../../common/hr/FvcUserInput.js';
import { Communities } from '../../common/dba/Communities.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { R } from '../../common/constants/R.js';
import { Api } from '../../common/plt/Api.js';
import { Account } from '../../common/dba/Account.js';
import type { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { CommunityProfileData, UserPrivateProfile } from '../../types/backend2.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper as PWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

const _CFT_COMMUNITY_OVERVIEW_N_COINS: string = `__N_ACTIVE_COINS__ active/__N_TOTAL_COINS__ total`;

const _CPT_OVERVIEW = {
  MAIN: `<div class="community-overview tw:w-full tw:max-w-[720px] tw:mx-auto tw:px-2">
  <div class="tw:rounded-2xl tw:border tw:border-slate-200/70 dark:tw:border-slate-700/70 tw:bg-white/80 dark:tw:bg-slate-900/60 tw:backdrop-blur tw:shadow-sm tw:overflow-hidden">
    <div id="__ID_HEADER__"></div>

    <div class="tw:px-4 tw:pt-3 tw:pb-4">
      <div id="__ID_NAME__" class="tw:text-center tw:font-semibold tw:text-lg tw:tracking-tight tw:text-slate-900 dark:tw:text-slate-100"></div>
      <div id="__ID_DESCRIPTION__" class="tw:mt-1 tw:text-center tw:text-sm tw:text-slate-600 dark:tw:text-slate-300"></div>

      <div class="tw:mt-4 tw:grid tw:grid-cols-1 sm:tw:grid-cols-2 tw:gap-3">
        <div class="tw:flex tw:items-center tw:justify-between tw:rounded-xl tw:border tw:border-slate-200/60 dark:tw:border-slate-700/60 tw:bg-slate-50/70 dark:tw:bg-slate-900/30 tw:px-3 tw:py-2">
          <div class="tw:text-xs tw:uppercase tw:tracking-wide tw:text-slate-500 dark:tw:text-slate-400">Creator</div>
          <div id="__ID_CREATOR__" class="tw:ml-3 tw:flex tw:justify-end"></div>
        </div>

        <div class="tw:flex tw:items-center tw:justify-between tw:rounded-xl tw:border tw:border-slate-200/60 dark:tw:border-slate-700/60 tw:bg-slate-50/70 dark:tw:bg-slate-900/30 tw:px-3 tw:py-2">
          <div class="tw:text-xs tw:uppercase tw:tracking-wide tw:text-slate-500 dark:tw:text-slate-400">Captain</div>
          <div id="__ID_CAPTAIN__" class="tw:ml-3 tw:flex tw:justify-end"></div>
        </div>

        <div class="tw:flex tw:items-center tw:justify-between tw:rounded-xl tw:border tw:border-slate-200/60 dark:tw:border-slate-700/60 tw:bg-slate-50/70 dark:tw:bg-slate-900/30 tw:px-3 tw:py-2">
          <div class="tw:text-xs tw:uppercase tw:tracking-wide tw:text-slate-500 dark:tw:text-slate-400">Members</div>
          <div id="__ID_N_MEMBERS__" class="tw:ml-3 tw:text-sm tw:font-medium tw:text-slate-800 dark:tw:text-slate-200"></div>
        </div>

        <div class="tw:flex tw:items-center tw:justify-between tw:rounded-xl tw:border tw:border-slate-200/60 dark:tw:border-slate-700/60 tw:bg-slate-50/70 dark:tw:bg-slate-900/30 tw:px-3 tw:py-2">
          <div class="tw:text-xs tw:uppercase tw:tracking-wide tw:text-slate-500 dark:tw:text-slate-400">Active proposals</div>
          <div id="__ID_N_PROPOSALS__" class="tw:ml-3 tw:text-sm tw:font-medium tw:text-slate-800 dark:tw:text-slate-200"></div>
        </div>

        <div class="tw:flex tw:items-center tw:justify-between tw:rounded-xl tw:border tw:border-slate-200/60 dark:tw:border-slate-700/60 tw:bg-slate-50/70 dark:tw:bg-slate-900/30 tw:px-3 tw:py-2">
          <div id="__ID_N_COINS_DESC__" class="tw:text-xs tw:uppercase tw:tracking-wide tw:text-slate-500 dark:tw:text-slate-400"></div>
          <div class="tw:ml-3 tw:flex tw:items-center tw:gap-2 tw:justify-end">
            <div id="__ID_N_COINS__" class="tw:text-sm tw:font-medium tw:text-slate-800 dark:tw:text-slate-200"></div>
            <div id="__ID_BTN_COIN__"></div>
          </div>
        </div>

        <div class="tw:flex tw:items-center tw:justify-between tw:rounded-xl tw:border tw:border-slate-200/60 dark:tw:border-slate-700/60 tw:bg-slate-50/70 dark:tw:bg-slate-900/30 tw:px-3 tw:py-2">
          <div id="__ID_BALANCE_DESC__" class="tw:text-xs tw:uppercase tw:tracking-wide tw:text-slate-500 dark:tw:text-slate-400"></div>
          <div class="tw:ml-3 tw:flex tw:items-center tw:gap-2 tw:justify-end">
            <div id="__ID_BALANCE__" class="tw:text-sm tw:font-medium tw:text-slate-800 dark:tw:text-slate-200"></div>
            <div id="__ID_BTN_BALANCE__"></div>
          </div>
        </div>
      </div>

      <div class="tw:mt-5 tw:flex tw:flex-col tw:items-stretch tw:gap-2">
        <div id="__ID_BTN_JOIN__"></div>
        <div id="__ID_BTN_PROPOSE__"></div>
        <div id="__ID_BTN_CONFIG__"></div>
        <div id="__ID_BTN_ISSUE_COIN__"></div>
      </div>
    </div>
  </div>
</div>`,
} as const;

class POverview extends Panel {
  #pHeader: PWrapper;
  #pName: PWrapper;
  #pDescription: PWrapper;
  #pCreator: PWrapper;
  #pCaptain: PWrapper;
  #pNMembers: Panel;
  #pNCoinsDesc: Panel;
  #pNCoins: Panel;
  #pBtnCoin: PWrapper;
  #pBalanceDesc: Panel;
  #pBalance: Panel;
  #pBtnBalance: PWrapper;
  #pNProposals: Panel;
  #pBtnJoin: PWrapper;
  #pBtnPropose: PWrapper;
  #pBtnConfig: PWrapper;
  #pBtnIssue: PWrapper;

  constructor() {
    super();
    this.#pHeader = new PWrapper();
    this.#pName = new PWrapper();
    this.#pDescription = new PWrapper();
    this.#pCreator = new PWrapper();
    this.#pCaptain = new PWrapper();
    this.#pNMembers = new Panel();
    this.#pNCoinsDesc = new Panel();
    this.#pNCoins = new Panel();
    this.#pBtnCoin = new PWrapper();
    this.#pBalanceDesc = new Panel();
    this.#pBalance = new Panel();
    this.#pBtnBalance = new PWrapper();
    this.#pNProposals = new Panel();
    this.#pBtnJoin = new PWrapper();
    this.#pBtnPropose = new PWrapper();
    this.#pBtnConfig = new PWrapper();
    this.#pBtnIssue = new PWrapper();
  }

  getHeaderPanel(): PWrapper { return this.#pHeader; }
  getNamePanel(): PWrapper { return this.#pName; }
  getDescriptionPanel(): PWrapper { return this.#pDescription; }
  getCreatorPanel(): PWrapper { return this.#pCreator; }
  getCaptainPanel(): PWrapper { return this.#pCaptain; }
  getNMembersPanel(): Panel { return this.#pNMembers; }
  getNCoinsDescriptionPanel(): Panel { return this.#pNCoinsDesc; }
  getNCoinsPanel(): Panel { return this.#pNCoins; }
  getCoinBtnPanel(): PWrapper { return this.#pBtnCoin; }
  getBalanceDescriptionPanel(): Panel { return this.#pBalanceDesc; }
  getBalancePanel(): Panel { return this.#pBalance; }
  getBalanceBtnPanel(): PWrapper { return this.#pBtnBalance; }
  getNProposalsPanel(): Panel { return this.#pNProposals; }
  getBtnJoinPanel(): PWrapper { return this.#pBtnJoin; }
  getBtnProposePanel(): PWrapper { return this.#pBtnPropose; }
  getBtnConfigPanel(): PWrapper { return this.#pBtnConfig; }
  getBtnIssueCoinPanel(): PWrapper { return this.#pBtnIssue; }

  _renderFramework(): string {
    let s: string = _CPT_OVERVIEW.MAIN;
    s = s.replace("__ID_HEADER__", this._getSubElementId("H"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_DESCRIPTION__", this._getSubElementId("D"));
    s = s.replace("__ID_CREATOR__", this._getSubElementId("CR"));
    s = s.replace("__ID_CAPTAIN__", this._getSubElementId("CP"));
    s = s.replace("__ID_N_MEMBERS__", this._getSubElementId("NM"));
    s = s.replace("__ID_N_COINS_DESC__", this._getSubElementId("CD"));
    s = s.replace("__ID_N_COINS__", this._getSubElementId("NC"));
    s = s.replace("__ID_BTN_COIN__", this._getSubElementId("BC"));
    s = s.replace("__ID_BALANCE_DESC__", this._getSubElementId("BD"));
    s = s.replace("__ID_BALANCE__", this._getSubElementId("B"));
    s = s.replace("__ID_BTN_BALANCE__", this._getSubElementId("BB"));
    s = s.replace("__ID_N_PROPOSALS__", this._getSubElementId("NP"));
    s = s.replace("__ID_BTN_JOIN__", this._getSubElementId("J"));
    s = s.replace("__ID_BTN_PROPOSE__", this._getSubElementId("P"));
    s = s.replace("__ID_BTN_CONFIG__", this._getSubElementId("C"));
    s = s.replace("__ID_BTN_ISSUE_COIN__", this._getSubElementId("I"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pHeader.attach(this._getSubElementId("H"));
    this.#pName.attach(this._getSubElementId("N"));
    this.#pDescription.attach(this._getSubElementId("D"));
    this.#pCreator.attach(this._getSubElementId("CR"));
    this.#pCaptain.attach(this._getSubElementId("CP"));
    this.#pNMembers.attach(this._getSubElementId("NM"));
    this.#pNCoinsDesc.attach(this._getSubElementId("CD"));
    this.#pNCoins.attach(this._getSubElementId("NC"));
    this.#pBtnCoin.attach(this._getSubElementId("BC"));
    this.#pBalanceDesc.attach(this._getSubElementId("BD"));
    this.#pBalance.attach(this._getSubElementId("B"));
    this.#pBtnBalance.attach(this._getSubElementId("BB"));
    this.#pNProposals.attach(this._getSubElementId("NP"));
    this.#pBtnJoin.attach(this._getSubElementId("J"));
    this.#pBtnPropose.attach(this._getSubElementId("P"));
    this.#pBtnConfig.attach(this._getSubElementId("C"));
    this.#pBtnIssue.attach(this._getSubElementId("I"));
  }
}

export interface FOverviewDelegate {
  onNewProposalRequestAcceptedInOverviewFragment(f: FOverview): void;
  onCommunityOverviewFragmentRequestShowView(f: FOverview, view: View, title: string): void;
}

interface ApiCommunityProfileResponse {
  profile: CommunityProfileData;
}

interface ApiUserProfileResponse {
  profile: UserPrivateProfile;
}

export class FOverview extends Fragment implements HeaderEditorDelegate, CommunityConfigDelegate {
  #fHeaderEditor: FHeaderEditor;
  #fCreator: FUserInfo;
  #fCaptain: FUserInfo;
  #fNameEditor: TextInput;
  #fDescriptionEditor: TextArea;
  #btnCoinInfo: Button;
  #btnCashInfo: Button;
  #btnJoin: Button;
  #btnPropose: Button;
  #btnConfig: Button;
  #btnIssue: Button;
  #communityId: string | null = null;

  constructor() {
    super();
    this.#fHeaderEditor = new FHeaderEditor();
    this.#fHeaderEditor.setDelegate(this);
    this.setChild("header", this.#fHeaderEditor);

    this.#fCreator = new FUserInfo();
    this.#fCreator.setLayoutType(FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("creator", this.#fCreator);

    this.#fCaptain = new FUserInfo();
    this.#fCaptain.setLayoutType(FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("captain", this.#fCaptain);

    this.#fNameEditor = new TextInput();
    this.#fNameEditor.setClassName("no-border center-align s-csecondarybg");
    this.#fNameEditor.setDelegate(this);
    this.setChild("name", this.#fNameEditor);

    this.#fDescriptionEditor = new TextArea();
    this.#fDescriptionEditor.setClassName("w100 small-info-text implicit center-align s-csecondarybg");
    this.#fDescriptionEditor.setDelegate(this);
    this.setChild("description", this.#fDescriptionEditor);

    this.#btnCoinInfo = new Button();
    this.#btnCoinInfo.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this.#btnCoinInfo.setValue("COIN_INFO");
    this.#btnCoinInfo.setName("Details");
    this.#btnCoinInfo.setDelegate(this);
    this.setChild("btnCoinInfo", this.#btnCoinInfo);

    this.#btnCashInfo = new Button();
    this.#btnCashInfo.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this.#btnCashInfo.setValue("CASH_INFO");
    this.#btnCashInfo.setName("Details");
    this.#btnCashInfo.setDelegate(this);
    this.setChild("btnCashInfo", this.#btnCashInfo);

    this.#btnJoin = new Button();
    this.#btnJoin.setValue("APPLY");
    this.#btnJoin.setName("Apply membership...");
    this.#btnJoin.setDelegate(this);
    this.setChild("btnJoin", this.#btnJoin);

    this.#btnPropose = new Button();
    this.#btnPropose.setValue("PROPOSE");
    this.#btnPropose.setName("New proposal...");
    this.#btnPropose.setDelegate(this);
    this.setChild("btnPropose", this.#btnPropose);

    this.#btnConfig = new Button();
    this.#btnConfig.setValue("CONFIG");
    this.#btnConfig.setName("Settings...");
    this.#btnConfig.setDelegate(this);
    this.setChild("btnConfig", this.#btnConfig);

    this.#btnIssue = new Button();
    this.#btnIssue.setValue("ISSUE");
    this.#btnIssue.setName("Issue coins...");
    this.#btnIssue.setDelegate(this);
    this.setChild("btnIssue", this.#btnIssue);
  }

  setCommunityId(id: string | null): void {
    this.#communityId = id;
    this.render();
  }

  onSimpleButtonClicked(fBtn: Button): void {
    switch (String(fBtn.getValue())) {
    case "COIN_INFO":
      this.#onShowCoins();
      break;
    case "CASH_INFO":
      this.#onShowFinance();
      break;
    case "APPLY":
      this.#onApplyClicked();
      break;
    case "PROPOSE":
      this.#onProposeClicked();
      break;
    case "CONFIG":
      this.#onConfigClicked();
      break;
    case "ISSUE":
      this.#onIssueCoinClicked();
      break;
    default:
      break;
    }
  }

  onImageChangedInHeaderEditorFragment(_f: FHeaderEditor): void {
    if (this.#validateInput()) {
      this.#asyncUpdateProfile();
    }
  }

  onNewProposalRequestAcceptedInConfigEditorContentFragmet(_fvc: FvcConfigEditor): void {
    this.getDelegate<FOverviewDelegate>()?.onNewProposalRequestAcceptedInOverviewFragment(this);
  }

  onInputChangeInTextInputFragment(_fTextInput: TextInput, _text: string): void {
    if (this.#validateInput()) {
      this.#asyncUpdateProfile();
    }
  }

  onInputChangeInTextArea(_fTextArea: TextArea, _text: string): void {
    if (this.#validateInput()) {
      this.#asyncUpdateProfile();
    }
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PUBLIC_PROFILES:
    case T_DATA.COMMUNITY_PROFILE: {
      const profile = data instanceof CommunityProfile ? data : null;
      if (!profile || profile.getId() === this.#communityId) {
        this.render();
      }
      break;
    }
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: PanelWrapper): void {
    const profile = Communities.get(this.#communityId);
    if (!profile) {
      return;
    }

    const pMain = new POverview();
    render.wrapPanel(pMain);

    const isEditor = this.#isEditor(profile);
    this.#fHeaderEditor.setEnableEdit(isEditor);

    let p = pMain.getHeaderPanel();
    this.#fHeaderEditor.setIconUrl(profile.getIconUrl() || "");
    this.#fHeaderEditor.setImageUrl(profile.getImageUrl() || "");
    this.#fHeaderEditor.attachRender(p);
    this.#fHeaderEditor.render();

    p = pMain.getNamePanel();
    if (isEditor) {
      this.#fNameEditor.setConfig({
        hint: "Community name",
        value: profile.getName() || "",
        isRequired: true,
        title: "",
      });
      this.#fNameEditor.attachRender(p);
      this.#fNameEditor.render();
    } else {
      p.replaceContent(this.#renderName(profile.getName()));
    }

    p = pMain.getDescriptionPanel();
    if (isEditor) {
      this.#fDescriptionEditor.setConfig({
        hint: "Community description",
        value: profile.getDescription() || "",
        isRequired: false,
        title: "",
      } as any);
      this.#fDescriptionEditor.attachRender(p);
      this.#fDescriptionEditor.render();
    } else {
      p.replaceContent(this.#renderDescription(profile.getDescription()));
    }

    p = pMain.getCreatorPanel();
    this.#fCreator.setUserId(profile.getCreatorId());
    this.#fCreator.attachRender(p);
    this.#fCreator.render();

    p = pMain.getCaptainPanel();
    this.#fCaptain.setUserId(profile.getCaptainId());
    this.#fCaptain.attachRender(p);
    this.#fCaptain.render();

    pMain.getNMembersPanel().replaceContent(String(profile.getNMembers()));

    if (Account.isBetaTester()) {
      pMain.getNCoinsDescriptionPanel().replaceContent("Coins:");
      pMain.getNCoinsPanel().replaceContent(this.#renderNCoins(profile));

      if (Account.isInCommunity(this.#communityId)) {
        this.#btnCoinInfo.attachRender(pMain.getCoinBtnPanel());
        this.#btnCoinInfo.render();
      }

      pMain.getBalanceDescriptionPanel().replaceContent("Cash:");
      pMain.getBalancePanel().replaceContent(String(profile.getCashBalance()));
      if (Account.isInCommunity(this.#communityId)) {
        this.#btnCashInfo.attachRender(pMain.getBalanceBtnPanel());
        this.#btnCashInfo.render();
      }
    }

    pMain.getNProposalsPanel().replaceContent(String(profile.getNProposals()));

    if (Account.isAuthenticated() && !Account.getCommunityId() && !Account.isCommunityApplicationPending()) {
      this.#btnJoin.attachRender(pMain.getBtnJoinPanel());
      this.#btnJoin.render();
    }

    if (profile.getCreatorId() && profile.getCreatorId() == Account.getId()) {
      this.#btnPropose.attachRender(pMain.getBtnProposePanel());
      this.#btnPropose.render();

      this.#btnConfig.attachRender(pMain.getBtnConfigPanel());
      this.#btnConfig.render();

      if (WebConfig.isDevSite()) {
        this.#btnIssue.attachRender(pMain.getBtnIssueCoinPanel());
        this.#btnIssue.render();
      }
    }
  }

  #isEditor(profile: CommunityProfile): boolean {
    const captainId = profile.getCaptainId();
    return Account.getId() == captainId && WebConfig.getOwnerId() == captainId;
  }

  #renderName(name: string | null): string { return name ? name : "Unnamed community"; }
  #renderDescription(description: string | null): string {
    return description ? description : "No description";
  }

  #renderNCoins(profile: CommunityProfile): string {
    let s: string = _CFT_COMMUNITY_OVERVIEW_N_COINS;
    s = s.replace("__N_TOTAL_COINS__", String(profile.getNTotalCoins()));
    s = s.replace("__N_ACTIVE_COINS__", String(profile.getNActiveCoins()));
    return s;
  }

  #onShowCoins(): void {
    const v = new View();
    const f = new FvcCoinHistory();
    f.setCommunityId(this.#communityId);
    v.setContentFragment(f);
    this.getDelegate<FOverviewDelegate>()?.onCommunityOverviewFragmentRequestShowView(this, v, "Coins");
  }

  #onShowFinance(): void {
    const v = new View();
    const f = new FvcFinanceHistory();
    f.setCommunityId(this.#communityId);
    v.setContentFragment(f);
    this.getDelegate<FOverviewDelegate>()?.onCommunityOverviewFragmentRequestShowView(this, v, "Finance");
  }

  #onConfigClicked(): void {
    const v = new View();
    const f = new FvcConfigEditor();
    f.setCommunityId(this.#communityId);
    f.setDelegate(this);
    v.setContentFragment(f);
    this.getDelegate<FOverviewDelegate>()?.onCommunityOverviewFragmentRequestShowView(this, v, "Config");
  }

  #onProposeClicked(): void {
    const v = new View();
    v.setContentFragment(new FvcProposalEditor());
    this.getDelegate<FOverviewDelegate>()?.onCommunityOverviewFragmentRequestShowView(this, v, "Proposal");
  }

  #onApplyClicked(): void {
    const v = new View();
    const fvc = new FvcUserInput();
    const f = new TextArea();
    f.setDelegate(this);
    f.setClassName("w100 h120px");
    f.setConfig({
      title: R.get("PROMPT_APPLY_COMMUNITY_MEMBERSHIP"),
      hint: "Message",
      value: "",
      isRequired: false,
    } as any);
    fvc.addInputCollector(f);
    fvc.setConfig({
      fcnValidate: () => f.validate(),
      fcnOK: () => this.#applyMembership(f.getValue()),
    });
    v.setContentFragment(fvc);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v, "Application message", false);
  }

  #onIssueCoinClicked(): void {
    const v = new View();
    const fvc = new FvcUserInput();
    const f = new NumberInput();
    f.setConfig({
      title: R.get("CONFIRM_ISSUE_COINS"),
      min: 1,
      max: 100,
      step: 1,
      value: 10,
      unit: "M",
    } as any);
    fvc.addInputCollector(f);
    fvc.setConfig({
      fcnValidate: () => f.validate(),
      fcnOK: () => this.#onIssueCoin(parseInt(f.getValue())),
    });
    v.setContentFragment(fvc);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v, "Input", false);
  }

  #applyMembership(message: string): void {
    if (!this.#communityId) {
      return;
    }
    const url = "/api/community/join";
    const fd = new FormData();
    fd.append("id", this.#communityId);
    fd.append("msg", message);
    Api.asFragmentPost<ApiUserProfileResponse>(this, url, fd).then((d) => this.#onApplyRRR(d));
  }

  #onApplyRRR(data: ApiUserProfileResponse): void {
    Account.reset(data.profile);
    this.getDelegate<FOverviewDelegate>()?.onNewProposalRequestAcceptedInOverviewFragment(this);
  }

  #onIssueCoin(nCoins: number): void {
    const fd = new FormData();
    fd.append("total", String(nCoins));
    const url = "api/community/propose_issue_coins";
    Api.asFragmentPost(this, url, fd).then((d) => this.#onIssueCoinRRR(d));
  }

  #onIssueCoinRRR(_data: unknown): void {
    if (this.#communityId) {
      Communities.reload(this.#communityId);
    }
    this.getDelegate<FOverviewDelegate>()?.onNewProposalRequestAcceptedInOverviewFragment(this);
  }

  #validateInput(): boolean {
    let b = true;
    b = b && this.#fNameEditor.validate();
    b = b && this.#fDescriptionEditor.validate();
    b = b && !this.#fHeaderEditor.isBusy();
    return b;
  }

  #asyncUpdateProfile(): void {
    const url = "/api/community/update";
    const fd = new FormData();
    fd.append('name', this.#fNameEditor.getValue());
    fd.append('description', this.#fDescriptionEditor.getValue());

    const iconInfo = this.#fHeaderEditor.getIconCacheFileInfo() as any;
    fd.append('icon', JSON.stringify({
      id: iconInfo?.id,
      type: iconInfo?.mimeType,
      cover_id: iconInfo?.coverId,
    }));
    const imageInfo = this.#fHeaderEditor.getImageCacheFileInfo() as any;
    fd.append('image', JSON.stringify({
      id: imageInfo?.id,
      type: imageInfo?.mimeType,
      cover_id: imageInfo?.coverId,
    }));
    Api.asFragmentPost<ApiCommunityProfileResponse>(this, url, fd).then(d => this.#onUpdateProfileRRR(d));
  }

  #onUpdateProfileRRR(data: ApiCommunityProfileResponse): void {
    Communities.updateProfile(new CommunityProfile(data.profile));
  }
}

export default FOverview;
