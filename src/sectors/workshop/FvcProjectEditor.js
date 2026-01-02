
window.CF_PROJECT_EDITOR_CONTENT = {
  SUBMIT : "C_PROJECT_EDITOR_1",
  DELETE : "C_PROJECT_EDITOR_2",
}

const _CFT_PROJECT_EDITOR_CONTENT = {
  TITLE : `<div class="textarea-wrapper">
      <label class="s-font5" for="ID_PROJECT_EDITOR_NAME">Name</label>
      <br>
      <textarea id="ID_PROJECT_EDITOR_NAME" class="edit-project-name">__NAME__</textarea>
    </div>
    <br>`,
  LOWER : `<br>
    <a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(CF_PROJECT_EDITOR_CONTENT.SUBMIT)">Submit</a>
    <br>
    <br>
    __DELETE_BUTTON__
    <br>
    <br>`,
  DELETE_BUTTON :
      `<a class="button-bar danger" href="javascript:void(0)" onclick="javascript:G.action(CF_PROJECT_EDITOR_CONTENT.DELETE)">Delete</a>`,
}
import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ButtonGroup } from '../../lib/ui/controllers/fragments/ButtonGroup.js';
import { HintText } from '../../lib/ui/controllers/fragments/HintText.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { FMultiMediaFileUploader } from '../../lib/ui/controllers/fragments/FMultiMediaFileUploader.js';
import { RichContentEditor } from '../../common/gui/RichContentEditor.js';
import { TagsEditorFragment } from '../../common/gui/TagsEditorFragment.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Workshop } from '../../common/dba/Workshop.js';
import { Project } from '../../common/datatypes/Project.js';
import { VIS } from '../../common/constants/Constants.js';

export class FvcProjectEditor extends FScrollViewContent {
  constructor() {
    super();
    this._fContent = new RichContentEditor();
    this.setChild("content", this._fContent);

    this._fFiles = new FMultiMediaFileUploader();
    this._fFiles.setCacheIds([ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]);
    this._fFiles.setDataSource(this);
    this._fFiles.setDelegate(this);
    this.setChild("files", this._fFiles);

    this._fteOwner = new TagsEditorFragment();
    this._fteOwner.setDataSource(this);
    this._fteOwner.setDelegate(this);
    this.setChild("ownerTags", this._fteOwner);

    this._fVisibility = new ButtonGroup();
    this._fVisibility.setDataSource(this);
    this._fVisibility.setDelegate(this);
    this._fVisibility.addChoice({
      name : "Public",
      value : VIS.PUBLIC,
      fDetail : new HintText("Visible by all visitors.")
    });
    this._fVisibility.addChoice({name : "Protected", value : VIS.PROTECTED});
    this._fVisibility.addChoice({name : "Private", value : VIS.PRIVATE});
    this.setChild("vis", this._fVisibility);

    this._project = null;
  }

  getTagsForTagsEditorFragment(fEditor) { return WebConfig.getTags(); }
  getInitialCheckedIdsForTagsEditorFragment(fEditor) {
    return this._project ? this._project.getTagIds() : [];
  }

  onMultiMediaFileUploadWillBegin() { this.#disableSubmitButton(); }
  onMultiMediaFileUploadFinished() { this.#enableSubmitButton(); }

  onOptionChangeInOptionsFragment(fOptions, value, isChecked) {}

  setProject(project) { this._project = project; }

  _renderContentOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);

    let project = this._project;
    let pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderTitle(project));

    pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fFiles.setToHrefFiles(project.getFiles());
    this._fFiles.attachRender(pp);
    this._fFiles.render();

    pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fContent.setConfig(
        {title : "Detail", value : project.getDescription(), hint : ""});
    this._fContent.attachRender(pp);
    this._fContent.render();

    p.pushSpace(1);

    pp = new SectionPanel("Menu tags");
    p.pushPanel(pp);
    this._fteOwner.setEnableNewTags(true);
    this._fteOwner.attachRender(pp.getContentPanel());
    this._fteOwner.render();

    p.pushSpace(1);

    pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fVisibility.setSelectedValue(project.getVisibility());
    this._fVisibility.attachRender(pp);
    this._fVisibility.render();

    pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderLower(project));
  }

  #renderTitle(project) {
    let s = _CFT_PROJECT_EDITOR_CONTENT.TITLE;
    if (project.getName()) {
      s = s.replace("__NAME__", project.getName());
    } else {
      s = s.replace("__NAME__", "");
    }
    return s;
  }

  #renderLower(project) {
    let s = _CFT_PROJECT_EDITOR_CONTENT.LOWER;
    if (project.isDraft()) {
      s = s.replace("__DELETE_BUTTON__", "");
    } else {
      s = s.replace("__DELETE_BUTTON__",
                    _CFT_PROJECT_EDITOR_CONTENT.DELETE_BUTTON);
    }
    return s;
  }

  action(type, ...args) {
    switch (type) {
    case CF_PROJECT_EDITOR_CONTENT.SUBMIT:
      this.#onSubmit();
      break;
    case CF_PROJECT_EDITOR_CONTENT.DELETE:
      this.#asyncRequestDelete();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  onButtonGroupSelectionChanged(fButtonGroup, value) {}

  #enableSubmitButton() {}
  #disableSubmitButton() {}

  #onSubmit() {
    let data = this.#collectData();
    if (this.#validateData(data)) {
      this.#asyncSubmit(data);
    }
  }

  #validateData(data) {
    let project = this._project;
    return true;
  }

  #asyncSubmit(data) {
    let fd = new FormData();
    fd.append("id", data.id ? data.id : "");
    fd.append("name", data.name);
    fd.append("description", data.description);
    fd.append("visibility", data.visibility);
    for (let id of data.tag_ids) {
      fd.append("tag_ids", id);
    }

    for (let name of data.tag_names) {
      fd.append("new_tag_names", name);
    }

    this._fFiles.saveDataToForm(fd);

    let url = "/api/workshop/update_project";
    glb.api.asyncFragmentPost(this, url, fd).then(d => this.#onSubmitRRR(d));
  }

  #collectData() {
    let e = document.getElementById("ID_PROJECT_EDITOR_NAME");
    let project = {id : this._project.getId()};
    project.name = e.value;
    project.description = this._fContent.getValue();
    project.visibility = this._fVisibility.getSelectedValue();
    project.tag_ids = this._fteOwner.getSelectedTagIds();
    project.tag_names = this._fteOwner.getNewTagNames();
    return project;
  }

  #onSubmitRRR(data) {
    if (this._project.isDraft()) {
      this._delegate.onNewProjectPostedInProjectEditorContentFragment(this);
    } else {
      Workshop.updateProject(new Project(data.project));
    }
    this._owner.onContentFragmentRequestPopView(this);
  }

  #asyncRequestDelete() {
    let fd = new FormData();
    fd.append("project_id", this._project.getId());
    let url = "/api/workshop/delete_project";
    glb.api.asyncFragmentPost(this, url, fd).then(d => this.#onDeleteRRR(d));
  }

  #onDeleteRRR(data) { location.replace(WebConfig.getHomeUrl()); }
};
