import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Events, T_ACTION, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Utilities } from '../../common/Utilities.js';
import { FvcUserInput } from '../../common/hr/FvcUserInput.js';
import { FvcTagEditor } from './FvcTagEditor.js';
import { FTagEditor } from './FTagEditor.js';
import { Api } from '../../common/plt/Api.js';
import type Render from '../../lib/ui/renders/Render.js';

interface TagEditorListDelegate {
  onClickInTagEditorFragment(fTagEditor: FTagEditor): void;
}

export class FvcTagEditorList extends FScrollViewContent {
  protected _fList: FSimpleFragmentList;
  protected _fBtnNew: ActionButton;
  protected _delegate!: TagEditorListDelegate;

  constructor() {
    super();
    this._fList = new FSimpleFragmentList();
    this.setChild("list", this._fList);

    this._fBtnNew = new ActionButton();
    this._fBtnNew.setIcon(ActionButton.T_ICON.NEW);
    this._fBtnNew.setDelegate(this);
  }

  getActionButton(): ActionButton { return this._fBtnNew }

  onGuiActionButtonClick(fActionButton: ActionButton): void {
    let v = new View();
    let fvc = new FvcUserInput();
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
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v, "Input",
                                false);
  }

  onClickInTagEditorFragment(fTagEditor: FTagEditor): void {
    let v = new View();
    let f = new FvcTagEditor();
    f.setTagId(fTagEditor.getTagId());
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Tag editor");
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case FwkT_DATA.WEB_CONFIG:
      this._owner.onContentFragmentRequestUpdateHeader(this);
      this.render();
      break;
    case T_DATA.USER_PROFILE:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render: Render): void {
    let p = new PanelWrapper();
    render.wrapPanel(p);
    this._fList.clear();
    let tags = WebConfig.getTags();
    tags.sort((a, b) => {
      return Utilities.stringCompare(a.getName().toLowerCase(),
                                     b.getName().toLowerCase());
    });

    for (let t of tags) {
      let f = new FTagEditor();
      f.setDelegate(this);
      f.setLayoutType(FTagEditor.T_LAYOUT.INFO);
      f.setTagId(t.getId());
      this._fList.append(f);
    }
    this._fList.attachRender(p);
    this._fList.render();
  }

  #asyncAddTag(tag: string): void {
    let url = "api/user/add_tag";
    let fd = new FormData();
    fd.append("name", tag);
    Api.asFragmentPost(this, url, fd).then(d => this.#onAddTagRRR(d));
  }

  #onAddTagRRR(data: unknown): void {
    let groups = (data as { groups?: unknown }).groups;
    if (groups) {
      WebConfig.resetTags(groups);
    }
    this.render();
  }
};
