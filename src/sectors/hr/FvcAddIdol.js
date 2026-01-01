import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { SearchConfig } from '../../common/datatypes/SearchConfig.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { T_ACTION } from '../../common/plt/Events.js';
import { Events } from '../../lib/framework/Events.js';

export class FvcAddIdol extends FScrollViewContent {
  #fSearch;

  constructor() {
    super();
    let c = new SearchConfig();
    if (glb.env.isWeb3()) {
      this.#fSearch = new srch.FWeb3Search();
      c.setCategories([ SocialItem.TYPE.USER ]);
    } else {
      this.#fSearch = new srch.FGeneralSearch();
      this.#fSearch.enableAddFeed();
      c.setCategories([ SocialItem.TYPE.USER, SocialItem.TYPE.FEED ]);
    }
    this.#fSearch.setConfig(c);
    this.#fSearch.setDelegate(this);
    this.setChild("search", this.#fSearch);
  }

  onSearchResultClickedInSearchFragment(fSearch, itemType, itemId) {
    switch (itemType) {
    case SocialItem.TYPE.USER:
    case SocialItem.TYPE.FEED:
      this.#showUser(itemId);
      break;
    default:
      break;
    }
  }

  _renderContentOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p)
    let pp = new Panel();
    p.pushPanel(pp);
    if (glb.env.isWeb3()) {
      pp.replaceContent(R.get("ADD_WEB3_IDOL_HINT"));
    } else {
      pp.replaceContent(R.get("ADD_IDOL_HINT"));
    }

    pp = new PanelWrapper();
    p.pushPanel(pp);
    this.#fSearch.attachRender(pp);
    this.#fSearch.render();
  }

  #showUser(userId) {
    Events.triggerTopAction(T_ACTION.SHOW_USER_INFO, userId);
  }
};
