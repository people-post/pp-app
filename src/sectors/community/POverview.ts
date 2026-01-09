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
} as const;

import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class POverview extends Panel {
  #pHeader: PanelWrapper;
  #pName: PanelWrapper;
  #pDescription: PanelWrapper;
  #pCreator: PanelWrapper;
  #pCaptain: PanelWrapper;
  #pNMembers: Panel;
  #pNCoinsDesc: Panel;
  #pNCoins: Panel;
  #pBtnCoin: PanelWrapper;
  #pBalanceDesc: Panel;
  #pBalance: Panel;
  #pBtnBalance: PanelWrapper;
  #pNProposals: Panel;
  #pBtnJoin: PanelWrapper;
  #pBtnPropose: PanelWrapper;
  #pBtnConfig: PanelWrapper;
  #pBtnIssue: PanelWrapper;

  constructor() {
    super();
    this.#pHeader = new PanelWrapper();
    this.#pName = new PanelWrapper();
    this.#pDescription = new PanelWrapper();
    this.#pCreator = new PanelWrapper();
    this.#pCaptain = new PanelWrapper();
    this.#pNMembers = new Panel();
    this.#pNCoinsDesc = new Panel();
    this.#pNCoins = new Panel();
    this.#pBtnCoin = new PanelWrapper();
    this.#pBalanceDesc = new Panel();
    this.#pBalance = new Panel();
    this.#pBtnBalance = new PanelWrapper();
    this.#pNProposals = new Panel();
    this.#pBtnJoin = new PanelWrapper();
    this.#pBtnPropose = new PanelWrapper();
    this.#pBtnConfig = new PanelWrapper();
    this.#pBtnIssue = new PanelWrapper();
  }

  getHeaderPanel(): PanelWrapper { return this.#pHeader; }
  getNamePanel(): PanelWrapper { return this.#pName; }
  getDescriptionPanel(): PanelWrapper { return this.#pDescription; }
  getCreatorPanel(): PanelWrapper { return this.#pCreator; }
  getCaptainPanel(): PanelWrapper { return this.#pCaptain; }
  getNMembersPanel(): Panel { return this.#pNMembers; }
  getNCoinsDescriptionPanel(): Panel { return this.#pNCoinsDesc; }
  getNCoinsPanel(): Panel { return this.#pNCoins; }
  getCoinBtnPanel(): PanelWrapper { return this.#pBtnCoin; }
  getBalanceDescriptionPanel(): Panel { return this.#pBalanceDesc; }
  getBalancePanel(): Panel { return this.#pBalance; }
  getBalanceBtnPanel(): PanelWrapper { return this.#pBtnBalance; }
  getNProposalsPanel(): Panel { return this.#pNProposals; }
  getBtnJoinPanel(): PanelWrapper { return this.#pBtnJoin; }
  getBtnProposePanel(): PanelWrapper { return this.#pBtnPropose; }
  getBtnConfigPanel(): PanelWrapper { return this.#pBtnConfig; }
  getBtnIssueCoinPanel(): PanelWrapper { return this.#pBtnIssue; }

  _renderFramework(): string {
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
