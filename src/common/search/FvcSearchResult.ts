import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FGeneralSearch } from './FGeneralSearch.js';
import { SocialItem } from '../datatypes/SocialItem.js';
import { Factory, T_OBJ } from '../../lib/framework/Factory.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { URL_PARAM } from '../constants/Constants.js';
import type { SearchResultTargetFactory } from './SearchResultTargetFactory.js';

export class FvcSearchResult extends FScrollViewContent {
  #fSearch: FGeneralSearch;

  constructor() {
    super();
    this.#fSearch = new FGeneralSearch();
    this.#fSearch.setDelegate(this);
    this.setChild("content", this.#fSearch);
  }

  getUrlParamString(): string {
    // TODO: Currently, there is no entry to here because srch
    // is not a registered sector in session gateway
    let k = this.#fSearch.getKey();
    if (k) {
      return URL_PARAM.KEY + "=" + encodeURIComponent(k);
    } else {
      return "";
    }
  }

  initFromUrl(urlParam: URLSearchParams): void {
    // TODO: Currently there is no entry to here because srch
    // is not a registered sector in session gateway
    this.#fSearch.setKey(urlParam.get(URL_PARAM.KEY) || "");
    this.render();
  }

  setKey(key: string): void { this.#fSearch.setKey(key); }
  setResultLayoutType(t: string | null): void { this.#fSearch.setResultLayoutType(t); }

  onSearchResultClickedInSearchFragment(_fSearch: FGeneralSearch, itemType: string, itemId: string): void {
    switch (itemType) {
    case SocialItem.TYPE.USER:
    case SocialItem.TYPE.FEED:
    case SocialItem.TYPE.ARTICLE:
    case SocialItem.TYPE.PROJECT:
    case SocialItem.TYPE.PRODUCT:
    case SocialItem.TYPE.ORDER:
      this.#showResult(itemType, itemId);
      break;
    default:
      break;
    }
  }

  #showResult(itemType: string, itemId: string): void {
    let factory = Factory.getRequiredInstance<SearchResultTargetFactory>(
      T_OBJ.SEARCH_RESULT_TARGET_FACTORY);
    let target = factory.buildSearchResultTarget(itemType, itemId,
        this.#fSearch.getResultLayoutType());
    if (!target) {
      return;
    }

    if (target.asDialog) {
      Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, target.view,
          target.title);
      return;
    }

    // @ts-expect-error - owner may have this method
    this._owner?.onFragmentRequestShowView?.(this, target.view, target.title);
  }

  _renderContentOnRender(render: ReturnType<typeof this.getRender>): void {
    this.#fSearch.attachRender(render);
    this.#fSearch.render();
  }
}

export default FvcSearchResult;
