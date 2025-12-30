export const CF_DRAFT_ARTICLE_INFO = {
  ON_CLICK : Symbol(),
};

class FDraftArticleInfo extends ui.Fragment {
  #draftId = null;

  constructor() {
    super();
    this._fOwnerName = new S.hr.FUserInfo();
    this._fOwnerName.setLayoutType(S.hr.FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("ownerName", this._fOwnerName);

    this._fAuthorName = new S.hr.FUserInfo();
    this._fAuthorName.setLayoutType(S.hr.FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("authorName", this._fAuthorName);

    this._fOwnerIcon = new S.hr.FUserIcon();
    this.setChild("ownerIcon", this._fOwnerIcon);

    this._fTags = new ui.FFragmentList();
    this.setChild("tags", this._fTags);
  }

  setDraftId(id) { this.#draftId = id; }

  action(type, ...args) {
    switch (type) {
    case blog.CF_DRAFT_ARTICLE_INFO.ON_CLICK:
      this.#onClick();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.DRAFT_ARTICLE:
      if (this.#draftId == data.getId()) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let draft = dba.Blog.getDraftArticle(this.#draftId);
    if (!draft) {
      let p = new ui.Panel();
      p.setClassName("center-align");
      render.wrapPanel(p);
      p.replaceContent(ui.ICONS.LOADING);
      return;
    }

    let panel = new blog.PDraftArticleInfo();
    panel.setClassName("clickable");
    panel.setAttribute(
        "onclick", "javascript:G.action(blog.CF_DRAFT_ARTICLE_INFO.ON_CLICK)");

    render.wrapPanel(panel);

    if (this._dataSource.isDraftSelectedInDraftArticleInfoFragment(
            this, this.#draftId)) {
      panel.invertColor();
    }

    this.#renderDraftPanel(draft, panel);
  }

  #renderDraftPanel(draft, panel) {
    this.#renderOwnerIcon(panel.getOwnerIconPanel(), draft);
    this.#renderOwnerName(panel.getOwnerNamePanel(), draft);
    this.#renderAuthorName(panel.getAuthorNamePanel(), draft);
    this.#renderTags(panel.getTagsPanel(), draft);
    this.#renderText(panel.getTitlePanel(), panel.getContentPanel(), draft);

    this.#renderTime(panel.getCreationTimeSmartPanel(), draft);
    this.#renderDateTime(panel.getCreationDateTimePanel(), draft);
  }

  #renderTags(panel, draft) {
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
    let pList = new ui.ListPanel();
    pList.setClassName("flex flex-start baseline-align-items");
    panel.wrapPanel(pList);

    this._fTags.clear();
    for (let id of tagIds) {
      let f = new gui.FTag();
      f.setTagId(id);
      this._fTags.append(f);
      let p = new ui.PanelWrapper();
      pList.pushPanel(p);
      f.attachRender(p);
      f.render();
    }
  }

  #renderText(pTitle, pContent, draft) {
    if (!draft) {
      return;
    }

    if (pContent) {
      let s = draft.getContent();
      if (ext.Utilities.isEmptyString(s)) {
        s = ext.Utilities.timestampToDateString(draft.getCreationTime() / 1000);
      } else {
        s = blog.Utilities.stripSimpleTag(s, "p");
      }
      pContent.replaceContent(Utilities.renderContent(s));
    }

    if (pTitle) {
      let s = draft.getTitle();
      if (ext.Utilities.isEmptyString(s) && !pContent) {
        // Use content if no title and no content panel
        s = draft.getContent();
      }
      if (!ext.Utilities.isEmptyString(s)) {
        s = blog.Utilities.stripSimpleTag(s, "p");
        pTitle.replaceContent(Utilities.renderContent(s));
      }
    }
  }

  #renderTime(panel, draft) {
    if (!panel) {
      return;
    }
    if (!draft) {
      return;
    }
    panel.replaceContent(Utilities.renderTimeDiff(draft.getCreationTime()));
  }

  #renderDateTime(panel, draft) {
    if (!panel) {
      return;
    }
    if (!draft) {
      return;
    }
    panel.replaceContent(ext.Utilities.timestampToDateTimeString(
        draft.getCreationTime() / 1000));
  }

  #renderOwnerIcon(panel, draft) {
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

  #renderOwnerName(panel, draft) {
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

  #renderAuthorName(panel, draft) {
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

  #onClick() {
    this._delegate.onClickInDraftArticleInfoFragment(this, this.#draftId);
  }
};

blog.FDraftArticleInfo = FDraftArticleInfo;
}(window.blog = window.blog || {}));

// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.CF_DRAFT_ARTICLE_INFO = CF_DRAFT_ARTICLE_INFO;
}