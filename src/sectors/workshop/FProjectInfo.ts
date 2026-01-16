window.CF_PROJECT_INFO = {
  VIEW_PROJECT : "CF_PROJECT_INFO_1",
}
import { RichProgress } from '../../lib/ui/controllers/fragments/RichProgress.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { ThumbnailPanelWrapper } from '../../lib/ui/renders/panels/ThumbnailPanelWrapper.js';
import { MajorSectorItem } from '../../common/gui/MajorSectorItem.js';
import { FilesThumbnailFragment } from '../../common/gui/FilesThumbnailFragment.js';
import { FUserIcon } from '../../common/hr/FUserIcon.js';
import { FUserInfo } from '../../common/hr/FUserInfo.js';
import { FSocialBar } from '../../common/social/FSocialBar.js';
import { Workshop } from '../../common/dba/Workshop.js';
import { SocialItem } from '../../common/interface/SocialItem.js';
import { T_DATA } from '../../common/plt/Events.js';
import { LGallery } from '../../common/gui/LGallery.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { Utilities } from '../../common/Utilities.js';
import { PProjectInfoLarge } from './PProjectInfoLarge.js';
import { PProjectInfoSmallQuote } from './PProjectInfoSmallQuote.js';
import { PProjectInfoLargeQuote } from './PProjectInfoLargeQuote.js';
import { PProjectInfoMiddle } from './PProjectInfoMiddle.js';
import { Project } from '../../common/datatypes/Project.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';
import type { PProjectInfoBase } from './PProjectInfoBase.js';

interface ProjectInfoDataSource {
  isProjectSelectedInProjectInfoFragment(f: FProjectInfo, projectId: string): boolean;
}

interface ProjectInfoDelegate {
  onClickInProjectInfoFragment(f: FProjectInfo, projectId: string): void;
}

export class FProjectInfo extends MajorSectorItem {
  protected _sizeType: symbol | null;
  protected _projectId: string | null;
  protected _fThumbnail: FilesThumbnailFragment;
  protected _fProgress: RichProgress;
  protected _fUserIcon: FUserIcon;
  protected _fUserName: FUserInfo;
  protected _fSocial: FSocialBar;
  protected _dataSource!: ProjectInfoDataSource;
  protected _delegate!: ProjectInfoDelegate;

  constructor() {
    super();
    this._sizeType = null;
    this._projectId = null;

    this._fThumbnail = new FilesThumbnailFragment();
    this._fThumbnail.setDataSource(this);
    this._fThumbnail.setDelegate(this);
    this.setChild("thumbnail", this._fThumbnail);

    this._fProgress = new RichProgress();

    this.setChild("progress", this._fProgress);

    this._fUserIcon = new FUserIcon();
    this.setChild("usericon", this._fUserIcon);

    this._fUserName = new FUserInfo();
    this._fUserName.setLayoutType(FUserInfo.T_LAYOUT.COMPACT);
    this.setChild("username", this._fUserName);

    this._fSocial = new FSocialBar();
    this._fSocial.setDataSource(this);
    this._fSocial.setDelegate(this);
    this.setChild("social", this._fSocial);
  }

  getFilesForThumbnailFragment(fThumbnail: FilesThumbnailFragment): unknown[] {
    if (!this._projectId) {
      return [];
    }
    let project = Workshop.getProject(this._projectId);
    return project ? project.getFiles() : [];
  }

  setProjectId(id: string | null): void { this._projectId = id; }
  setSizeType(t: symbol | null): void { this._sizeType = t; }

  onThumbnailClickedInThumbnailFragment(fThumbnail: FilesThumbnailFragment, idx: number): void {
    this.#showThumbnail(idx);
  }
  onCommentClickedInSocialBar(fSocial: FSocialBar): void {
    if (this._projectId) {
      this._delegate.onClickInProjectInfoFragment(this, this._projectId);
    }
  }

  action(type: string, ...args: unknown[]): void {
    switch (type) {
    case CF_PROJECT_INFO.VIEW_PROJECT:
      if (this._projectId) {
        this._delegate.onClickInProjectInfoFragment(this, this._projectId);
      }
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.PROJECT:
      if ((data as Project).getId() == this._projectId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Render): void {
    if (!this._projectId) {
      let p = new Panel();
      p.setClassName("center-align");
      render.wrapPanel(p);
      p.replaceContent("Loading...");
      return;
    }
    let project = Workshop.getProject(this._projectId);
    if (!project) {
      let p = new Panel();
      p.setClassName("center-align");
      render.wrapPanel(p);
      p.replaceContent("Loading...");
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

  #createPanel(): PProjectInfoBase {
    let p: PProjectInfoBase;
    switch (this._sizeType) {
    case SocialItem.T_LAYOUT.LARGE:
      p = new PProjectInfoLarge();
      break;
    case SocialItem.T_LAYOUT.EXT_QUOTE_SMALL:
      p = new PProjectInfoSmallQuote();
      break;
    case SocialItem.T_LAYOUT.EXT_QUOTE_LARGE:
      p = new PProjectInfoLargeQuote();
      break;
    default:
      p = new PProjectInfoMiddle();
      break;
    }
    return p;
  }

  #isProjectHasImage(project: Project): boolean {
    return project && project.getFiles().length > 0;
  }

  #renderProjectOnPanel(project: Project, panel: PProjectInfoBase): void {
    let p: Panel | ThumbnailPanelWrapper | null;

    if (this.#isProjectHasImage(project)) {
      panel.enableImage();
      p = panel.getImagePanel();

      if (p) {
        let pp = new ThumbnailPanelWrapper();
        if (this.#isSquareImage()) {
          pp.setClassName("aspect-1-1-frame");
        }
        p.wrapPanel(pp);

        this._fThumbnail.attachRender(pp);
        this._fThumbnail.render();
      }
    }

    p = panel.getTitlePanel();
    if (p) {
      p.replaceContent(this.#renderTitle(project));
    }

    p = panel.getContentPanel();
    if (p) {
      p.replaceContent(this.#renderContent(project));
    }

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
    if (p) {
      this._fProgress.setDirection(panel.getProgressDirection());
      this._fProgress.setValue(project.getProgress());
      this._fProgress.setStateClassName(
          Utilities.getStateClassName(project.getState(), project.getStatus()));
      this._fProgress.attachRender(p);
      this._fProgress.render();
    }

    this.#renderSocialBar(panel.getSocialBarPanel(), panel.isColorInvertible());
  }

  #isSquareImage(): boolean {
    return this._sizeType == SocialItem.T_LAYOUT.MEDIUM ||
           this._sizeType == SocialItem.T_LAYOUT.EXT_QUOTE_SMALL;
  }

  #renderTitle(project: Project): string {
    if (!project) {
      return "...";
    }
    return Utilities.renderContent(project.getName());
  }

  #renderContent(project: Project): string {
    if (!project) {
      return "...";
    }
    return Utilities.renderContent(project.getDescription());
  }

  #renderSocialBar(panel: Panel | null, inversable: boolean): void {
    if (!panel || !this._projectId) {
      return;
    }

    if (inversable) {
      this._fSocial.setInvertColor(
          this._dataSource.isProjectSelectedInProjectInfoFragment(
              this, this._projectId));
    }
    this._fSocial.setItem(Workshop.getProject(this._projectId));
    this._fSocial.attachRender(panel);
    this._fSocial.render();
  }

  #showThumbnail(idx: number): void {
    if (!this._projectId) {
      return;
    }
    let project = Workshop.getProject(this._projectId);
    if (!project) {
      return;
    }
    let lc = new LGallery();
    lc.setFiles(project.getFiles());
    lc.setSelection(idx);
    lc.setCommentThreadId(project.getId(), project.getSocialItemType());
    Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, lc, "Gallery");
  }
};
