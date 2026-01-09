import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FFragmentList } from '../../lib/ui/controllers/fragments/FFragmentList.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ICONS } from '../../lib/ui/Icons.js';
import { FUserInfo } from '../../common/hr/FUserInfo.js';
import { FUserIcon } from '../../common/hr/FUserIcon.js';
import { FTag } from '../../common/gui/FTag.js';
import { Blog } from '../../common/dba/Blog.js';
import { T_DATA } from '../../common/plt/Events.js';
import UtilitiesExt from '../../lib/ext/Utilities.js';
import { PDraftArticleInfo } from './PDraftArticleInfo.js';
import { Utilities as blogUtilities } from './Utilities.js';
import { Utilities } from '../../common/Utilities.js';
import type { DraftArticle } from '../../common/datatypes/DraftArticle.js';

export const CF_DRAFT_ARTICLE_INFO = {
  ON_CLICK : Symbol(),
} as const;

export class FDraftArticleInfo extends Fragment {
  #draftId: string | null = null;
  private _fOwnerName: FUserInfo;
  private _fAuthorName: FUserInfo;
  private _fOwnerIcon: FUserIcon;
  private _fTags: FFragmentList;

  constructor() {
    super();
    this._fOwnerName = new FUserInfo();
    this._fOwnerName.setLayoutType(FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("ownerName", this._fOwnerName);

    this._fAuthorName = new FUserInfo();
    this._fAuthorName.setLayoutType(FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("authorName", this._fAuthorName);

    this._fOwnerIcon = new FUserIcon();
    this.setChild("ownerIcon", this._fOwnerIcon);

    this._fTags = new FFragmentList();
    this.setChild("tags", this._fTags);
  }

  setDraftId(id: string | null): void { this.#draftId = id; }

  action(type: symbol, ..._args: unknown[]): void {
    switch (type) {
    case CF_DRAFT_ARTICLE_INFO.ON_CLICK:
      this.#onClick();
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.DRAFT_ARTICLE:
      if ((data as DraftArticle).getId() == this.#draftId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Panel): void {
    let draft = Blog.getDraftArticle(this.#draftId);
    if (!draft) {
      let p = new Panel();
      p.setClassName("center-align");
      render.wrapPanel(p);
      p.replaceContent(ICONS.LOADING);
      return;
    }

    let panel = new PDraftArticleInfo();
    panel.setClassName("clickable");
    panel.setAttribute(
        "onclick", "javascript:G.action(CF_DRAFT_ARTICLE_INFO.ON_CLICK)");

    render.wrapPanel(panel);

    if ((this._dataSource as any).isDraftSelectedInDraftArticleInfoFragment(
            this, this.#draftId)) {
      panel.invertColor();
    }

    this.#renderDraftPanel(draft, panel);
  }

  #renderDraftPanel(draft: DraftArticle, panel: PDraftArticleInfo): void {
    this.#renderOwnerIcon(panel.getOwnerIconPanel(), draft);
    this.#renderOwnerName(panel.getOwnerNamePanel(), draft);
    this.#renderAuthorName(panel.getAuthorNamePanel(), draft);
    this.#renderTags(panel.getTagsPanel(), draft);
    this.#renderText(panel.getTitlePanel(), panel.getContentPanel(), draft);

    this.#renderTime(panel.getCreationTimeSmartPanel(), draft);
    this.#renderDateTime(panel.getCreationDateTimePanel(), draft);
  }

  #renderTags(panel: Panel | null, draft: DraftArticle): void {
    if (!panel) {
      return;
    }

    if (!draft) {
      return;
    }

    let tagIds = draft.getTagIds();
    if (!tagIds) {
      return;
    }
    if (tagIds.length < 1) {
      return;
    }
    let pList = new ListPanel();
    pList.setClassName("flex flex-start baseline-align-items");
    panel.wrapPanel(pList);

    this._fTags.clear();
    for (let id of tagIds) {
      let f = new FTag();
      f.setTagId(id);
      this._fTags.append(f);
      let p = new PanelWrapper();
      pList.pushPanel(p);
      f.attachRender(p);
      f.render();
    }
  }

  #renderText(pTitle: Panel | null, pContent: Panel | null, draft: DraftArticle): void {
    if (!draft) {
      return;
    }

    if (pContent) {
      let s = draft.getContent();
      if (UtilitiesExt.isEmptyString(s)) {
        s = UtilitiesExt.timestampToDateString(draft.getCreationTime() / 1000);
      } else {
        s = blogUtilities.stripSimpleTag(s, "p");
      }
      pContent.replaceContent(Utilities.renderContent(s));
    }

    if (pTitle) {
      let s = draft.getTitle();
      if (UtilitiesExt.isEmptyString(s) && !pContent) {
        // Use content if no title and no content panel
        s = draft.getContent();
      }
      if (!UtilitiesExt.isEmptyString(s)) {
        s = blogUtilities.stripSimpleTag(s, "p");
        pTitle.replaceContent(Utilities.renderContent(s));
      }
    }
  }

  #renderTime(panel: Panel | null, draft: DraftArticle): void {
    if (!panel) {
      return;
    }
    if (!draft) {
      return;
    }
    panel.replaceContent(Utilities.renderTimeDiff(draft.getCreationTime()));
  }

  #renderDateTime(panel: Panel | null, draft: DraftArticle): void {
    if (!panel) {
      return;
    }
    if (!draft) {
      return;
    }
    panel.replaceContent(UtilitiesExt.timestampToDateTimeString(
        draft.getCreationTime() / 1000));
  }

  #renderOwnerIcon(panel: Panel | null, draft: DraftArticle): void {
    if (!panel) {
      return;
    }
    if (!draft) {
      return;
    }
    this._fOwnerIcon.setUserId(draft.getOwnerId());
    this._fOwnerIcon.attachRender(panel);
    this._fOwnerIcon.render();
  }

  #renderOwnerName(panel: Panel | null, draft: DraftArticle): void {
    if (!panel) {
      return;
    }
    if (!draft) {
      return;
    }
    this._fOwnerName.setUserId(draft.getOwnerId());
    this._fOwnerName.attachRender(panel);
    this._fOwnerName.render();
  }

  #renderAuthorName(panel: Panel | null, draft: DraftArticle): void {
    if (!panel) {
      return;
    }
    if (!draft) {
      return;
    }
    this._fAuthorName.setUserId(draft.getAuthorId());
    this._fAuthorName.attachRender(panel);
    this._fAuthorName.render();
  }

  #onClick(): void {
    (this._delegate as any).onClickInDraftArticleInfoFragment(this, this.#draftId);
  }
};
