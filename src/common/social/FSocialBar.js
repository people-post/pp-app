import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { LContext } from '../../lib/ui/controllers/layers/LContext.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { T_DATA } from '../plt/Events.js';
import { Social } from '../dba/Social.js';
import { Account } from '../dba/Account.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import Utilities from '../Utilities.js';
import UtilitiesExt from '../../lib/ext/Utilities.js';
import { api } from '../plt/Api.js';
import { URL_PARAM } from '../constants/Constants.js';
import { env } from '../plt/Env.js';

export const CF_SOCIAL_BAR = {
  ON_COMMENT_CLICK : Symbol(),
  LIKE : Symbol(),
  UNLIKE : Symbol(),
  LINK : Symbol(),
  UNLINK : Symbol(),
  SHARE : Symbol(),
  SHOW_CONTEXT : Symbol(),
};

const _CPT_SOCIAL_BAR = {
  MAIN : `<div id="__ID_MAIN__" class="social-bar pad5px flex"></div>`,
  ITEM : `<div id="__ID_ICON__" class="s-icon5"></div>
    <div id="__ID_LABEL__" class="s-font7"></div>`,
};

export class PSocialBarItem extends Panel {
  #pIcon = new Panel();
  #pLabel = new Panel();

  getIconPanel() { return this.#pIcon; }
  getLabelPanel() { return this.#pLabel; }

  _renderFramework() {
    let s = _CPT_SOCIAL_BAR.ITEM;
    s = s.replace("__ID_ICON__", this._getSubElementId("I"));
    s = s.replace("__ID_LABEL__", this._getSubElementId("L"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pIcon.attach(this._getSubElementId("I"));
    this.#pLabel.attach(this._getSubElementId("L"));
  }
};

export class PSocialBar extends Panel {
  #pItems = new ListPanel();

  getItemsPanel() { return this.#pItems; }

  _renderFramework() {
    let s = _CPT_SOCIAL_BAR.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pItems.attach(this._getSubElementId("M"));
  }
};

export class FSocialBar extends Fragment {
  static T_ACTION = {
    COMMENT : Symbol(),
    LIKE: Symbol(),
    LINK: Symbol(),
    SHARE: Symbol(),
    CONTEXT: Symbol(),
  };

  #lc;
  #invertColor = false;
  #itemId = null;
  #itemType = null;
  #itemOgpData = null;
  #actions = [];

  constructor() {
    super();
    this.#lc = new LContext();
    this.#lc.setDelegate(this);

    // Default actions
    if (env.isWeb3()) {
      this.#actions = [
        this.constructor.T_ACTION.COMMENT, this.constructor.T_ACTION.LIKE,
        this.constructor.T_ACTION.LINK, this.constructor.T_ACTION.CONTEXT
      ];
    } else {
      this.#actions = [
        this.constructor.T_ACTION.COMMENT, this.constructor.T_ACTION.LIKE,
        this.constructor.T_ACTION.LINK, this.constructor.T_ACTION.SHARE
      ];
    }
  }

  setInvertColor(b) { this.#invertColor = b; }
  setActions(actions) { this.#actions = actions; }
  setItem(item) {
    this.#itemId = item.getId();
    this.#itemType = item.getSocialItemType();
    this.#itemOgpData = item.getOgpData();
  }

  onOptionClickedInContextLayer(lContext, value) {
    switch (value) {
    case "REPOST":
      this.#asyncLink(this.#itemId, this.#itemType);
      break;
    case "UNREPOST":
      this.#asyncUnlink(this.#itemId, this.#itemType);
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

  onQuotePostedInQuoteEditorContentFragment(fvcQuoteEditor) {
    Events.triggerTopAction(T_ACTION.CLOSE_DIALOG, this);
    Events.trigger(T_DATA.NEW_OWNER_POST);
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.SOCIAL_INFO:
      if (data.getId() == this.#itemId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  action(type, ...args) {
    switch (type) {
    case CF_SOCIAL_BAR.ON_COMMENT_CLICK:
      this._delegate.onCommentClickedInSocialBar(this);
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
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
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
    let p;
    for (let t of this.#actions) {
      p = new PSocialBarItem();
      p.setClassName("flex-grow flex flex-center center-align-items clickable");
      pItems.pushPanel(p);
      this.#renderAction(t, p, social);
    }

    if (this.#actions.length > 0) {
      p = pItems.getPanel(0);
      p.setClassName("flex-grow flex flex-start center-align-items clickable");
      if (this.#actions.length > 1) {
        p = pItems.getPanel(this.#actions.length - 1);
        p.setClassName("flex-grow flex flex-end center-align-items clickable");
      }
    }
  }

  #renderAction(type, panel, social) {
    switch (type) {
    case this.constructor.T_ACTION.COMMENT:
      this.#renderComment(panel, social);
      break;
    case this.constructor.T_ACTION.LIKE:
      this.#renderLike(panel, social);
      break;
    case this.constructor.T_ACTION.LINK:
      this.#renderLink(panel, social);
      break;
    case this.constructor.T_ACTION.SHARE:
      this.#renderShare(panel, social);
      break;
    case this.constructor.T_ACTION.CONTEXT:
      this.#renderContext(panel, social);
      break;
    default:
      break;
    }
  }

  #renderComment(panel, social) {
    if (!panel) {
      return;
    }
    panel.setAttribute(
        "onclick", "javascript:G.action(socl.CF_SOCIAL_BAR.ON_COMMENT_CLICK)");
    let p = panel.getIconPanel();
    p.replaceContent(
        Utilities.renderSvgFuncIcon(C.ICON.COMMENT, this.#invertColor));

    p = panel.getLabelPanel();
    p.replaceContent(UtilitiesExt.nToShortString(social.getNComments()));
  }

  #renderLike(panel, social) {
    if (!panel) {
      return;
    }
    let p = panel.getIconPanel();
    if (social.isLiked()) {
      panel.setAttribute("onclick",
                         "javascript:G.action(socl.CF_SOCIAL_BAR.UNLIKE)");
      p.replaceContent(
          Utilities.renderSvgFuncIcon(C.ICON.HEART_SOLID, this.#invertColor));
    } else {
      panel.setAttribute("onclick",
                         "javascript:G.action(socl.CF_SOCIAL_BAR.LIKE)");
      p.replaceContent(
          Utilities.renderSvgFuncIcon(C.ICON.HEART_HOLLOW, this.#invertColor));
    }

    p = panel.getLabelPanel();
    p.replaceContent(UtilitiesExt.nToShortString(social.getNLikes()));
  }

  #renderLink(panel, social) {
    if (!panel) {
      return;
    }
    if (social.isLinked()) {
      panel.setAttribute("onclick",
                         "javascript:G.action(socl.CF_SOCIAL_BAR.UNLINK)");
    } else {
      panel.setAttribute("onclick",
                         "javascript:G.action(socl.CF_SOCIAL_BAR.LINK)");
    }

    let p = panel.getIconPanel();
    if (this.#invertColor) {
      p.replaceContent(Utilities.renderSvgFuncIcon(C.ICON.REFRESH, true));
    } else {
      if (social.isLinked()) {
        p.replaceContent(Utilities.renderSvgFuncIcon(C.ICON.REFRESH));
      } else {
        p.replaceContent(Utilities.renderSvgIcon(C.ICON.REFRESH, "stkdimgray"));
      }
    }
    p = panel.getLabelPanel();
    p.replaceContent(UtilitiesExt.nToShortString(social.getNLinks()));
  }

  #renderShare(panel, social) {
    if (!panel) {
      return;
    }
    panel.setAttribute("onclick",
                       "javascript:G.action(socl.CF_SOCIAL_BAR.SHARE)");
    let p = panel.getIconPanel();
    p.replaceContent(
        Utilities.renderSvgFuncIcon(C.ICON.SHARE, this.#invertColor));
  }

  #renderContext(panel, social) {
    if (!panel) {
      return;
    }
    panel.setAttribute("onclick",
                       "javascript:G.action(socl.CF_SOCIAL_BAR.SHOW_CONTEXT)");
    let p = panel.getIconPanel();
    p.replaceContent(
        Utilities.renderSvgFuncIcon(C.ICON.CIRCLED_MORE, this.#invertColor));
  }

  #onLike() {
    if (Account.isAuthenticated()) {
      this.#asyncLike(this.#itemId, this.#itemType);
    } else {
      this._displayMessage("LOGIN_BEFORE_LIKE");
    }
  }

  #onUnlike() {
    if (Account.isAuthenticated()) {
      this.#asyncUnlike(this.#itemId);
    } else {
      this._displayMessage("LOGIN_BEFORE_LIKE");
    }
  }

  #onLink() {
    if (Account.isAuthenticated()) {
      this.#lc.setTargetName(R.get("repost"));
      this.#lc.setDescription(null);
      this.#lc.clearOptions();
      this.#lc.addOption("Repost", "REPOST", C.ICON.REFRESH);
      this.#lc.addOption("Quote", "QUOTE");
      Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lc,
                                  "Context");
    } else {
      this._displayMessage("LOGIN_BEFORE_LINK");
    }
  }

  #onUnlink() {
    if (Account.isAuthenticated()) {
      this.#lc.setTargetName(R.get("repost"));
      this.#lc.setDescription(null);
      this.#lc.clearOptions();
      this.#lc.addOption("Undo repost", "UNREPOST", C.ICON.REFRESH);
      this.#lc.addOption("Quote", "QUOTE");
      Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lc,
                                  "Context");
    } else {
      this._displayMessage("LOGIN_BEFORE_LINK");
    }
  }

  #onShowContext() {
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
    this.#lc.addOption("添加批注", "AUDIO_COMMENT", C.ICON.MIC);
    Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lc,
                                "Context");
  }

  #onShare() {
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

  #onShareToTwitter() {
    let ogp = this.#itemOgpData;
    let items = [ "https://twitter.com/intent/tweet?" ];
    items.push("text=" + encodeURI(ogp.getTitle()));
    items.push("url=" + encodeURI(ogp.getUrl()));
    let url = items.join("&");
    window.open(url, '_blank').focus();
  }

  #onShareToFacebook() {
    let ogp = this.#itemOgpData;
    let items = [ "https://www.facebook.com/share.php?" ];
    items.push(URL_PARAM.USER + "=" + encodeURI(ogp.getUrl()));
    let url = items.join("&");
    window.open(url, '_blank').focus();
  }

  #onQuickComment() {}

  #onAudioComment() {}

  #onQuote() {
    let itemId = this.#itemId;
    let itemType = this.#itemType;
    let v = new View();
    let f = new blog.FvcQuoteEditor();
    f.setDelegate(this);
    f.setItem(itemId, itemType);
    v.setContentFragment(f);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v, "Quote",
                                false);
  }

  #handleShareError(err) { console.log("Share error", err); }

  #asyncLike(itemId, itemType) {
    if (env.isWeb3()) {
      this.#asyncWeb3Like(itemId).then(() => this.#onSocialRRR());
    } else {
      this.#asyncWeb2Like(itemId, itemType);
    }
  }

  async #asyncWeb3Like(itemId, itemType) { await Account.asLike(itemId); }

  #asyncWeb2Like(itemId, itemType) {
    let url = "api/social/like";
    let fd = new FormData();
    fd.append("item_id", itemId);
    fd.append("item_type", itemType);
    api.asyncFragmentPost(this, url, fd).then(d => this.#onSocialRRR(d));
  }

  #asyncUnlike(itemId) {
    if (env.isWeb3()) {
      this.#asyncWeb3Unlike(itemId).then(() => this.#onSocialRRR());
    } else {
      this.#asyncWeb2Unlike(itemId);
    }
  }

  async #asyncWeb3Unlike(itemId) { await Account.asUnlike(itemId); }

  #asyncWeb2Unlike(itemId) {
    let url = "api/social/unlike";
    let fd = new FormData();
    fd.append("item_id", itemId);
    api.asyncFragmentPost(this, url, fd).then(d => this.#onSocialRRR(d));
  }

  #asyncLink(itemId, itemType) {
    let url = "api/social/link";
    let fd = new FormData();
    fd.append("item_id", itemId);
    fd.append("item_type", itemType);
    api.asyncFragmentPost(this, url, fd).then(d => this.#onSocialRRR(d));
  }

  #asyncUnlink(itemId, itemType) {
    let url = "api/social/unlink";
    let fd = new FormData();
    fd.append("item_id", itemId);
    fd.append("item_type", itemType);
    api.asyncFragmentPost(this, url, fd).then(d => this.#onSocialRRR(d));
  }

  #onSocialRRR(data) { Social.reload(this.#itemId); }
};
