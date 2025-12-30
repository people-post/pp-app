
const _CPT_OVERVIEW = {
  MAIN : `<div class="community-overview">
  <div id="__ID_HEADER__"></div>
  <div id="__ID_NAME__" class="center-align bold"></div>
  <div id="__ID_DESCRIPTION__" class="center-align"></div>
  <div class="flex">
    <div class="w40 right-align small-info-text">Creator:</div>
    <div id="__ID_CREATOR__" class="left-pad5px"></div>
  </div>
  <div class="flex">
    <div class="w40 right-align small-info-text">Captain:</div>
    <div id="__ID_CAPTAIN__" class="left-pad5px"></div>
  </div>
  <div class="flex">
    <div class="w40 right-align small-info-text">Members:</div>
    <div id="__ID_N_MEMBERS__" class="left-pad5px"></div>
  </div>
  <div class="flex">
    <div id="__ID_N_COINS_DESC__" class="w40 right-align small-info-text"></div>
    <div id="__ID_N_COINS__" class="left-pad5px"></div>
    <div id="__ID_BTN_COIN__"></div>
  </div>
  <div class="flex">
    <div id="__ID_BALANCE_DESC__" class="w40 right-align small-info-text"></div>
    <div id="__ID_BALANCE__" class="left-pad5px"></div>
    <div id="__ID_BTN_BALANCE__"></div>
  </div>
  <div class="flex">
    <div class="w40 right-align small-info-text">Active proposals:</div>
    <div id="__ID_N_PROPOSALS__" class="left-pad5px"></div>
  </div>
  <br>
  <div id="__ID_BTN_JOIN__"></div>
  <br>
  <div id="__ID_BTN_PROPOSE__"></div>
  <br>
  <div id="__ID_BTN_CONFIG__"></div>
  <br>
  <div id="__ID_BTN_ISSUE_COIN__"></div>
  </div>`,
};

class POverview extends ui.Panel {
  #pHeader;
  #pName;
  #pDescription;
  #pCreator;
  #pCaptain;
  #pNMembers;
  #pNCoinsDesc;
  #pNCoins;
  #pBtnCoin;
  #pBalanceDesc;
  #pBalance;
  #pBtnBalance;
  #pNProposals;
  #pBtnJoin;
  #pBtnPropose;
  #pBtnConfig;
  #pBtnIssue;

  constructor() {
    super();
    this.#pHeader = new ui.PanelWrapper();
    this.#pName = new ui.PanelWrapper();
    this.#pDescription = new ui.PanelWrapper();
    this.#pCreator = new ui.PanelWrapper();
    this.#pCaptain = new ui.PanelWrapper();
    this.#pNMembers = new ui.Panel();
    this.#pNCoinsDesc = new ui.Panel();
    this.#pNCoins = new ui.Panel();
    this.#pBtnCoin = new ui.PanelWrapper();
    this.#pBalanceDesc = new ui.Panel();
    this.#pBalance = new ui.Panel();
    this.#pBtnBalance = new ui.PanelWrapper();
    this.#pNProposals = new ui.Panel();
    this.#pBtnJoin = new ui.PanelWrapper();
    this.#pBtnJoin = new ui.PanelWrapper();
    this.#pBtnPropose = new ui.PanelWrapper();
    this.#pBtnConfig = new ui.PanelWrapper();
    this.#pBtnIssue = new ui.PanelWrapper();
  }

  getHeaderPanel() { return this.#pHeader; }
  getNamePanel() { return this.#pName; }
  getDescriptionPanel() { return this.#pDescription; }
  getCreatorPanel() { return this.#pCreator; }
  getCaptainPanel() { return this.#pCaptain; }
  getNMembersPanel() { return this.#pNMembers; }
  getNCoinsDescriptionPanel() { return this.#pNCoinsDesc; }
  getNCoinsPanel() { return this.#pNCoins; }
  getCoinBtnPanel() { return this.#pBtnCoin; }
  getBalanceDescriptionPanel() { return this.#pBalanceDesc; }
  getBalancePanel() { return this.#pBalance; }
  getBalanceBtnPanel() { return this.#pBtnBalance; }
  getNProposalsPanel() { return this.#pNProposals; }
  getBtnJoinPanel() { return this.#pBtnJoin; }
  getBtnProposePanel() { return this.#pBtnPropose; }
  getBtnConfigPanel() { return this.#pBtnConfig; }
  getBtnIssueCoinPanel() { return this.#pBtnIssue; }

  _renderFramework() {
    let s = _CPT_OVERVIEW.MAIN;
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

  _onFrameworkDidAppear() {
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
};

cmut.POverview = POverview;
}(window.cmut = window.cmut || {}));
