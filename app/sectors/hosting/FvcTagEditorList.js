import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class FvcTagEditorList extends FScrollViewContent {
  constructor() {
    super();
    this._fList = new FSimpleFragmentList();
    this.setChild("list", this._fList);

    this._fBtnNew = new ActionButton();
    this._fBtnNew.setIcon(ActionButton.T_ICON.NEW);
    this._fBtnNew.setDelegate(this);
  }

  getActionButton() { return this._fBtnNew }

  onGuiActionButtonClick(fActionButton) {
    let v = new View();
    let fvc = new S.hr.FvcUserInput();
    let f = new TextInput();
    f.setConfig({
      title : "Tag name",
      hint : "New tag name",
      value : "",
      isRequired : true
    });
    fvc.addInputCollector(f);
    fvc.setConfig({
      fcnValidate : () => f.validate(),
      fcnOK : () => this.#asyncAddTag(f.getValue()),
    });
    v.setContentFragment(fvc);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v, "Input",
                                false);
  }

  onClickInTagEditorFragment(fTagEditor) {
    let v = new View();
    let f = new hstn.FvcTagEditor();
    f.setTagId(fTagEditor.getTagId());
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Tag editor");
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case fwk.T_DATA.WEB_CONFIG:
      this._owner.onContentFragmentRequestUpdateHeader(this);
      this.render();
      break;
    case plt.T_DATA.USER_PROFILE:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render) {
    let p = new PanelWrapper();
    render.wrapPanel(p);
    this._fList.clear();
    let tags = dba.WebConfig.getTags();
    tags.sort((a, b) => {
      return Utilities.stringCompare(a.getName().toLowerCase(),
                                     b.getName().toLowerCase());
    });

    for (let t of tags) {
      let f = new hstn.FTagEditor();
      f.setDelegate(this);
      f.setLayoutType(hstn.FTagEditor.T_LAYOUT.INFO);
      f.setTagId(t.getId());
      this._fList.append(f);
    }
    this._fList.attachRender(p);
    this._fList.render();
  }

  #asyncAddTag(tag) {
    let url = "api/user/add_tag";
    let fd = new FormData();
    fd.append("name", tag);
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onAddTagRRR(d));
  }

  #onAddTagRRR(data) {
    dba.WebConfig.resetTags(data.groups);
    this.render();
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.hstn = window.hstn || {};
  window.hstn.FvcTagEditorList = FvcTagEditorList;
}
