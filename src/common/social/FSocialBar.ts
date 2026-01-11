import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { LContext } from '../../lib/ui/controllers/layers/LContext.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { T_DATA } from '../plt/Events.js';
import { Social } from '../dba/Social.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { Utilities } from '../Utilities.js';
import UtilitiesExt from '../../lib/ext/Utilities.js';
import { URL_PARAM } from '../constants/Constants.js';
import { R } from '../constants/R.js';
import { ICON } from '../constants/Icons.js';
import { FvcQuoteEditor } from '../../sectors/blog/FvcQuoteEditor.js';
import { Env } from '../plt/Env.js';
import { Api } from '../plt/Api.js';
import { Account } from '../dba/Account.js';

export const CF_SOCIAL_BAR = {
  ON_COMMENT_CLICK : "CF_SOCIAL_BAR_1",
  LIKE : "CF_SOCIAL_BAR_2",
  UNLIKE : "CF_SOCIAL_BAR_3",
  LINK : "CF_SOCIAL_BAR_4",
  UNLINK : "CF_SOCIAL_BAR_5",
  SHARE : "CF_SOCIAL_BAR_6",
  SHOW_CONTEXT : "CF_SOCIAL_BAR_7",
};

const _CPT_SOCIAL_BAR = {
  MAIN : `<div id="__ID_MAIN__" class="social-bar pad5px flex"></div>`,
  ITEM : `<div id="__ID_ICON__" class="s-icon5"></div>
    <div id="__ID_LABEL__" class="s-font7"></div>`,
};

export class PSocialBarItem extends Panel {
  #pIcon = new Panel();
  #pLabel = new Panel();

  getIconPanel(): Panel { return this.#pIcon; }
  getLabelPanel(): Panel { return this.#pLabel; }

  _renderFramework(): string {
    let s = _CPT_SOCIAL_BAR.ITEM;
    s = s.replace("__ID_ICON__", this._getSubElementId("I"));
    s = s.replace("__ID_LABEL__", this._getSubElementId("L"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pIcon.attach(this._getSubElementId("I"));
    this.#pLabel.attach(this._getSubElementId("L"));
  }
}

export class PSocialBar extends Panel {
  #pItems = new ListPanel();

  getItemsPanel(): ListPanel { return this.#pItems; }

  _renderFramework(): string {
    let s = _CPT_SOCIAL_BAR.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pItems.attach(this._getSubElementId("M"));
  }
}

interface SocialItem {
  getId(): string;
  getSocialItemType(): string;
  getOgpData(): { getTitle(): string; getUrl(): string } | null;
}

interface OgpData {
  getTitle(): string;
  getUrl(): string;
}

export class FSocialBar extends Fragment {
  static T_ACTION = {
    COMMENT : Symbol(),
    LIKE: Symbol(),
    LINK: Symbol(),
    SHARE: Symbol(),
    CONTEXT: Symbol(),
  };

  #lc: LContext;
  #invertColor = false;
  #itemId: string | null = null;
  #itemType: string | null = null;
  #itemOgpData: OgpData | null = null;
  #actions: symbol[] = [];

  constructor() {
    super();
    this.#lc = new LContext();
    this.#lc.setDelegate(this);

    // Default actions
    if (Env.isWeb3()) {
      this.#actions = [
        FSocialBar.T_ACTION.COMMENT, FSocialBar.T_ACTION.LIKE,
        FSocialBar.T_ACTION.LINK, FSocialBar.T_ACTION.CONTEXT
      ];
    } else {
      this.#actions = [
        FSocialBar.T_ACTION.COMMENT, FSocialBar.T_ACTION.LIKE,
        FSocialBar.T_ACTION.LINK, FSocialBar.T_ACTION.SHARE
      ];
    }
  }

  setInvertColor(b: boolean): void { this.#invertColor = b; }
  setActions(actions: symbol[]): void { this.#actions = actions; }
  setItem(item: SocialItem): void {
    this.#itemId = item.getId();
    this.#itemType = item.getSocialItemType();
    this.#itemOgpData = item.getOgpData();
  }

  onOptionClickedInContextLayer(_lContext: LContext, value: string): void {
    switch (value) {
    case "REPOST":
      this.#asyncLink(this.#itemId || "", this.#itemType || "");
      break;
    case "UNREPOST":
      this.#asyncUnlink(this.#itemId || "", this.#itemType || "");
      break;
    case "QUOTE":
      this.#onQuote();
      break;
    case "FACEBOOK":
      this.#onShareToFacebook();
      break;
    case "TWITTER":
      this.#onShareToTwitter();
      break;
    case "QUICK_COMMENT":
      this.#onQuickComment();
      break;
    case "AUDIO_COMMENT":
      this.#onAudioComment();
      break;
    default:
      break;
    }
  }

  onQuotePostedInQuoteEditorContentFragment(_fvcQuoteEditor: Fragment): void {
    Events.triggerTopAction(T_ACTION.CLOSE_DIALOG, this);
    Events.trigger(T_DATA.NEW_OWNER_POST, this);
  }

  handleSessionDataUpdate(dataType: symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.SOCIAL_INFO:
      if ((data as { getId(): string }).getId() == this.#itemId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_SOCIAL_BAR.ON_COMMENT_CLICK:
      // @ts-expect-error - delegate may have this method
      this._delegate?.onCommentClickedInSocialBar?.(this);
      break;
    case CF_SOCIAL_BAR.LIKE:
      this.#onLike();
      break;
    case CF_SOCIAL_BAR.UNLIKE:
      this.#onUnlike();
      break;
    case CF_SOCIAL_BAR.LINK:
      this.#onLink();
      break;
    case CF_SOCIAL_BAR.UNLINK:
      this.#onUnlink();
      break;
    case CF_SOCIAL_BAR.SHARE:
      this.#onShare();
      break;
    case CF_SOCIAL_BAR.SHOW_CONTEXT:
      this.#onShowContext();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderOnRender(render: PanelWrapper): void {
    if (!this.#itemId) {
      return;
    }
    let social = Social.get(this.#itemId);
    if (!social) {
      return;
    }
    let panel = new PSocialBar();
    render.wrapPanel(panel);

    let pItems = panel.getItemsPanel();
    let p: PSocialBarItem;
    for (let t of this.#actions) {
      p = new PSocialBarItem();
      p.setClassName("flex-grow flex flex-center center-align-items clickable");
      pItems.pushPanel(p);
      this.#renderAction(t, p, social);
    }

    if (pItems.size() > 0) {
      p = pItems.getPanel(0) as PSocialBarItem;
      p.setClassName("flex-grow flex flex-start center-align-items clickable");
      if (pItems.size() > 1) {
        p = pItems.getPanel(pItems.size() - 1) as PSocialBarItem;
        p.setClassName("flex-grow flex flex-end center-align-items clickable");
      }
    }
  }

  #renderAction(type: symbol, panel: PSocialBarItem, social: ReturnType<typeof Social.get>): void {
    switch (type) {
    case FSocialBar.T_ACTION.COMMENT:
      this.#renderComment(panel, social);
      break;
    case FSocialBar.T_ACTION.LIKE:
      this.#renderLike(panel, social);
      break;
    case FSocialBar.T_ACTION.LINK:
      this.#renderLink(panel, social);
      break;
    case FSocialBar.T_ACTION.SHARE:
      this.#renderShare(panel, social);
      break;
    case FSocialBar.T_ACTION.CONTEXT:
      this.#renderContext(panel, social);
      break;
    default:
      break;
    }
  }

  #renderComment(panel: PSocialBarItem, social: ReturnType<typeof Social.get>): void {
    if (!panel) {
      return;
    }
    panel.setAttribute(
        "onclick", "javascript:G.action('" + CF_SOCIAL_BAR.ON_COMMENT_CLICK + "')");
    let p = panel.getIconPanel();
    p.replaceContent(
        Utilities.renderSvgFuncIcon(ICON.COMMENT, this.#invertColor));

    p = panel.getLabelPanel();
    p.replaceContent(UtilitiesExt.nToShortString(social?.getNComments() || 0));
  }

  #renderLike(panel: PSocialBarItem, social: ReturnType<typeof Social.get>): void {
    if (!panel) {
      return;
    }
    let p = panel.getIconPanel();
    if (social?.isLiked()) {
      panel.setAttribute("onclick",
                         "javascript:G.action('" + CF_SOCIAL_BAR.UNLIKE + "')");
      p.replaceContent(
          Utilities.renderSvgFuncIcon(ICON.HEART_SOLID, this.#invertColor));
    } else {
      panel.setAttribute("onclick",
                         "javascript:G.action('" + CF_SOCIAL_BAR.LIKE + "')");
      p.replaceContent(
          Utilities.renderSvgFuncIcon(ICON.HEART_HOLLOW, this.#invertColor));
    }

    p = panel.getLabelPanel();
    p.replaceContent(UtilitiesExt.nToShortString(social?.getNLikes() || 0));
  }

  #renderLink(panel: PSocialBarItem, social: ReturnType<typeof Social.get>): void {
    if (!panel) {
      return;
    }
    if (social?.isLinked()) {
      panel.setAttribute("onclick",
                         "javascript:G.action('" + CF_SOCIAL_BAR.UNLINK + "')");
    } else {
      panel.setAttribute("onclick",
                         "javascript:G.action('" + CF_SOCIAL_BAR.LINK + "')");
    }

    let p = panel.getIconPanel();
    if (this.#invertColor) {
      p.replaceContent(Utilities.renderSvgFuncIcon(ICON.REFRESH, true));
    } else {
      if (social?.isLinked()) {
        p.replaceContent(Utilities.renderSvgFuncIcon(ICON.REFRESH));
      } else {
        p.replaceContent(Utilities.renderSvgIcon(ICON.REFRESH, "stkdimgray"));
      }
    }
    p = panel.getLabelPanel();
    p.replaceContent(UtilitiesExt.nToShortString(social?.getNLinks() || 0));
  }

  #renderShare(panel: PSocialBarItem, _social: ReturnType<typeof Social.get>): void {
    if (!panel) {
      return;
    }
    panel.setAttribute("onclick",
                       "javascript:G.action('" + CF_SOCIAL_BAR.SHARE + "')");
    let p = panel.getIconPanel();
    p.replaceContent(
        Utilities.renderSvgFuncIcon(ICON.SHARE, this.#invertColor));
  }

  #renderContext(panel: PSocialBarItem, _social: ReturnType<typeof Social.get>): void {
    if (!panel) {
      return;
    }
    panel.setAttribute("onclick",
                       "javascript:G.action('" + CF_SOCIAL_BAR.SHOW_CONTEXT + "')");
    let p = panel.getIconPanel();
    p.replaceContent(
        Utilities.renderSvgFuncIcon(ICON.CIRCLED_MORE, this.#invertColor));
  }

  #onLike(): void {
    if (Account.isAuthenticated()) {
      this.#asyncLike(this.#itemId || "", this.#itemType || "");
    } else {
      this._displayMessage("LOGIN_BEFORE_LIKE");
    }
  }

  #onUnlike(): void {
    if (Account.isAuthenticated()) {
      this.#asyncUnlike(this.#itemId || "");
    } else {
      this._displayMessage("LOGIN_BEFORE_LIKE");
    }
  }

  #onLink(): void {
    if (Account.isAuthenticated()) {
      this.#lc.setTargetName(R.get("repost"));
      this.#lc.setDescription("");
      this.#lc.clearOptions();
      this.#lc.addOption("Repost", "REPOST", ICON.REFRESH);
      this.#lc.addOption("Quote", "QUOTE");
      Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lc,
                                  "Context");
    } else {
      this._displayMessage("LOGIN_BEFORE_LINK");
    }
  }

  #onUnlink(): void {
    if (Account.isAuthenticated()) {
      this.#lc.setTargetName(R.get("repost"));
      this.#lc.setDescription("");
      this.#lc.clearOptions();
      this.#lc.addOption("Undo repost", "UNREPOST", ICON.REFRESH);
      this.#lc.addOption("Quote", "QUOTE");
      Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lc,
                                  "Context");
    } else {
      this._displayMessage("LOGIN_BEFORE_LINK");
    }
  }

  #onShowContext(): void {
    this.#lc.setTargetName(R.get("feedback"));
    this.#lc.setDescription("Customized feedback");
    this.#lc.clearOptions();
    // TODO: Make the list customizable per user
    this.#lc.addOption("热点跟进", "QUICK_COMMENT");
    this.#lc.addOption("持续跟进", "QUICK_COMMENT");
    this.#lc.addOption("需要专题", "QUICK_COMMENT");
    this.#lc.addOption("停止关注", "QUICK_COMMENT");
    this.#lc.addOption("提供图片", "QUICK_COMMENT");
    this.#lc.addOption("提供视频", "QUICK_COMMENT");
    this.#lc.addOption("添加批注", "AUDIO_COMMENT", ICON.MIC);
    Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lc,
                                "Context");
  }

  #onShare(): void {
    let ogp = this.#itemOgpData;
    if (!ogp) {
      return;
    }
    if (navigator.share) {
      navigator.share({title : ogp.getTitle(), url : ""})
          .then(() => {})
          .catch(err => this.#handleShareError(err));
    } else {
      let s = `<p class="word-break-all">Url is: __URL__</p>`;
      s = s.replace("__URL__", ogp.getUrl());
      this.#lc.setTargetName(R.get("share"));
      this.#lc.setDescription(s);
      this.#lc.clearOptions();
      this.#lc.addOption("Facebook", "FACEBOOK");
      this.#lc.addOption("Twitter", "TWITTER");
      Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lc,
                                  "Context");
    }
  }

  #onShareToTwitter(): void {
    let ogp = this.#itemOgpData;
    if (!ogp) {
      return;
    }
    let items = [ "https://twitter.com/intent/tweet?" ];
    items.push("text=" + encodeURI(ogp.getTitle()));
    items.push("url=" + encodeURI(ogp.getUrl()));
    let url = items.join("&");
    window.open(url, '_blank')?.focus();
  }

  #onShareToFacebook(): void {
    let ogp = this.#itemOgpData;
    if (!ogp) {
      return;
    }
    let items = [ "https://www.facebook.com/share.php?" ];
    items.push(URL_PARAM.USER + "=" + encodeURI(ogp.getUrl()));
    let url = items.join("&");
    window.open(url, '_blank')?.focus();
  }

  #onQuickComment(): void {}

  #onAudioComment(): void {}

  #onQuote(): void {
    let itemId = this.#itemId;
    let itemType = this.#itemType;
    if (!itemId || !itemType) {
      return;
    }
    let v = new View();
    let f = new FvcQuoteEditor();
    f.setDelegate(this);
    f.setItem(itemId, itemType);
    v.setContentFragment(f);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v, "Quote",
                                false);
  }

  #handleShareError(err: unknown): void { console.log("Share error", err); }

  #asyncLike(itemId: string, itemType: string): void {
    if (Env.isWeb3()) {
      this.#asyncWeb3Like(itemId).then(() => this.#onSocialRRR());
    } else {
      this.#asyncWeb2Like(itemId, itemType);
    }
  }

  async #asyncWeb3Like(itemId: string): Promise<void> { await Account.asLike(itemId); }

  #asyncWeb2Like(itemId: string, itemType: string): void {
    let url = "api/social/like";
    let fd = new FormData();
    fd.append("item_id", itemId);
    fd.append("item_type", itemType);
    Api.asFragmentPost(this, url, fd).then(d => this.#onSocialRRR(d));
  }

  #asyncUnlike(itemId: string): void {
    if (Env.isWeb3()) {
      this.#asyncWeb3Unlike(itemId).then(() => this.#onSocialRRR());
    } else {
      this.#asyncWeb2Unlike(itemId);
    }
  }

  async #asyncWeb3Unlike(itemId: string): Promise<void> { await Account.asUnlike(itemId); }

  #asyncWeb2Unlike(itemId: string): void {
    let url = "api/social/unlike";
    let fd = new FormData();
    fd.append("item_id", itemId);
    Api.asFragmentPost(this, url, fd).then(d => this.#onSocialRRR(d));
  }

  #asyncLink(itemId: string, itemType: string): void {
    let url = "api/social/link";
    let fd = new FormData();
    fd.append("item_id", itemId);
    fd.append("item_type", itemType);
    Api.asFragmentPost(this, url, fd).then(d => this.#onSocialRRR(d));
  }

  #asyncUnlink(itemId: string, itemType: string): void {
    let url = "api/social/unlink";
    let fd = new FormData();
    fd.append("item_id", itemId);
    fd.append("item_type", itemType);
    Api.asFragmentPost(this, url, fd).then(d => this.#onSocialRRR(d));
  }

  #onSocialRRR(_data?: unknown): void { if (this.#itemId) Social.reload(this.#itemId); }
}

export default FSocialBar;
