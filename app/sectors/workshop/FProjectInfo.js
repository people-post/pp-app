
window.CF_PROJECT_INFO = {
  VIEW_PROJECT : "CF_PROJECT_INFO_1",
}

export class FProjectInfo extends gui.MajorSectorItem {
  constructor() {
    super();
    this._sizeType = null;
    this._projectId = null;

    this._fThumbnail = new gui.FilesThumbnailFragment();
    this._fThumbnail.setDataSource(this);
    this._fThumbnail.setDelegate(this);
    this.setChild("thumbnail", this._fThumbnail);

    this._fProgress = new ui.RichProgress();

    this.setChild("progress", this._fProgress);

    this._fUserIcon = new S.hr.FUserIcon();
    this.setChild("usericon", this._fUserIcon);

    this._fUserName = new S.hr.FUserInfo();
    this._fUserName.setLayoutType(S.hr.FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("username", this._fUserName);

    this._fSocial = new socl.FSocialBar();
    this._fSocial.setDataSource(this);
    this._fSocial.setDelegate(this);
    this.setChild("social", this._fSocial);
  }

  getFilesForThumbnailFragment(fThumbnail) {
    let project = dba.Workshop.getProject(this._projectId);
    return project ? project.getFiles() : [];
  }

  setProjectId(id) { this._projectId = id; }
  setSizeType(t) { this._sizeType = t; }

  onThumbnailClickedInThumbnailFragment(fThumbnail, idx) {
    this.#showThumbnail(idx);
  }
  onCommentClickedInSocialBar(fSocial) {
    this._delegate.onClickInProjectInfoFragment(this, this._projectId);
  }

  action(type, ...args) {
    switch (type) {
    case CF_PROJECT_INFO.VIEW_PROJECT:
      this._delegate.onClickInProjectInfoFragment(this, this._projectId);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.PROJECT:
      if (data.getId() == this._projectId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render) {
    let project = dba.Workshop.getProject(this._projectId);
    if (!project) {
      let p = new ui.Panel();
      p.setClassName("center-align");
      render.wrapPanel(p);
      p.replaceContent(ui.ICONS.LOADING);
      return;
    }

    let panel = this.#createPanel();
    panel.setClassName("clickable");
    panel.setAttribute("onclick",
                       "javascript:G.action(CF_PROJECT_INFO.VIEW_PROJECT)");

    render.wrapPanel(panel);

    if (panel.isColorInvertible()) {
      if (this._dataSource.isProjectSelectedInProjectInfoFragment(
              this, this._projectId)) {
        panel.invertColor();
      }
    }

    let className = Utilities.getVisibilityClassName(project.getVisibility());
    panel.setVisibilityClassName(className);

    this.#renderProjectOnPanel(project, panel);
  }

  #createPanel() {
    let p;
    switch (this._sizeType) {
    case dat.SocialItem.T_LAYOUT.LARGE:
      p = new wksp.PProjectInfoLarge();
      break;
    case dat.SocialItem.T_LAYOUT.EXT_QUOTE_SMALL:
      p = new wksp.PProjectInfoSmallQuote();
      break;
    case dat.SocialItem.T_LAYOUT.EXT_QUOTE_LARGE:
      p = new wksp.PProjectInfoLargeQuote();
      break;
    default:
      p = new wksp.PProjectInfoMiddle();
      break;
    }
    return p;
  }

  #isProjectHasImage(project) {
    return project && project.getFiles().length > 0;
  }

  #renderProjectOnPanel(project, panel) {
    let p;

    if (this.#isProjectHasImage(project)) {
      panel.enableImage();
      p = panel.getImagePanel();

      let pp = new ui.ThumbnailPanelWrapper();
      if (this.#isSquareImage()) {
        pp.setClassName("aspect-1-1-frame");
      }
      p.wrapPanel(pp);

      this._fThumbnail.attachRender(pp);
      this._fThumbnail.render();
    }

    p = panel.getTitlePanel();
    p.replaceContent(this.#renderTitle(project));

    p = panel.getContentPanel();
    p.replaceContent(this.#renderContent(project));

    p = panel.getCreationTimeSmartPanel();
    if (p) {
      p.replaceContent(Utilities.renderTimeDiff(project.getCreationTime()));
    }

    p = panel.getUserIconPanel();
    if (p) {
      this._fUserIcon.attachRender(p);
      this._fUserIcon.setUserId(project.getOwnerId());
      this._fUserIcon.render();
    }

    p = panel.getUserNamePanel();
    if (p) {
      this._fUserName.attachRender(p);
      this._fUserName.setUserId(project.getOwnerId());
      this._fUserName.render();
    }

    p = panel.getProgressPanel();
    this._fProgress.setDirection(panel.getProgressDirection());
    this._fProgress.setValue(project.getProgress());
    this._fProgress.setStateClassName(
        Utilities.getStateClassName(project.getState(), project.getStatus()));
    this._fProgress.attachRender(p);
    this._fProgress.render();

    this.#renderSocialBar(panel.getSocialBarPanel(), panel.isColorInvertible());
  }

  #isSquareImage() {
    return this._sizeType == dat.SocialItem.T_LAYOUT.MEDIUM ||
           this._sizeType == dat.SocialItem.T_LAYOUT.EXT_QUOTE_SMALL;
  }

  #renderTitle(project) {
    if (!project) {
      return "...";
    }
    return Utilities.renderContent(project.getName());
  }

  #renderContent(project) {
    if (!project) {
      return "...";
    }
    return Utilities.renderContent(project.getDescription());
  }

  #renderSocialBar(panel, inversable) {
    if (!panel) {
      return;
    }

    if (inversable) {
      this._fSocial.setInvertColor(
          this._dataSource.isProjectSelectedInProjectInfoFragment(
              this, this._projectId));
    }
    this._fSocial.setItem(dba.Workshop.getProject(this._projectId));
    this._fSocial.attachRender(panel);
    this._fSocial.render();
  }

  #showThumbnail(idx) {
    let project = dba.Workshop.getProject(this._projectId);
    if (!project) {
      return;
    }
    let lc = new gui.LGallery();
    lc.setFiles(project.getFiles());
    lc.setSelection(idx);
    lc.setCommentThreadId(project.getId(), project.getSocialItemType());
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_LAYER, this, lc, "Gallery");
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.FProjectInfo = FProjectInfo;
}
