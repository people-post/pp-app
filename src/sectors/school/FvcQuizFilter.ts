import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ButtonGroup } from '../../lib/ui/controllers/fragments/ButtonGroup.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { PFilterItem } from './PFilterItem.js';
import { Api } from '../../common/plt/Api.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

interface FvcQuizFilterDelegate {
  onQuizIdListGeneratedInQuizFilterContentFragment(f: FvcQuizFilter, ids: string[], displayMethod: symbol): void;
}

export class FvcQuizFilter extends FScrollViewContent {
  static T_PRESENTATION = {
    QUIZ : Symbol(),
    FLASHCARD: Symbol(),
  };

  protected _fScope: ButtonGroup;
  protected _fMethod: ButtonGroup;
  protected _fBtnApply: Button;
  protected _pScope: PFilterItem;
  protected _delegate!: FvcQuizFilterDelegate;

  constructor() {
    super();
    this._fScope = new ButtonGroup();
    // Values are synced with backend
    this._fScope.addChoice({name : "Learned", value : "MARKED", icon : null});
    this._fScope.addChoice({name : "New", value : "NEW", icon : null});
    this._fScope.addChoice({name : "All", value : "ALL", icon : null});
    this._fScope.setSelectedValue("MARKED");
    this._fScope.setDelegate(this);
    this.setChild("scope", this._fScope);

    this._fMethod = new ButtonGroup();
    this._fMethod.addChoice({
      name : "Quiz",
      value : FvcQuizFilter.T_PRESENTATION.QUIZ,
      icon : null
    });
    this._fMethod.addChoice({
      name : "Flashcard",
      value : FvcQuizFilter.T_PRESENTATION.FLASHCARD,
      icon : null
    });
    this._fMethod.setSelectedValue(FvcQuizFilter.T_PRESENTATION.QUIZ);
    this._fMethod.setDelegate(this);
    this.setChild("method", this._fMethod);

    this._fBtnApply = new Button();
    this._fBtnApply.setName("Apply");
    this._fBtnApply.setDelegate(this);
    this.setChild("btnApply", this._fBtnApply);

    this._pScope = new PFilterItem();
  }

  onSimpleButtonClicked(fBtn: Button): void { this.#onSubmit(); }
  onButtonGroupSelectionChanged(fBtnGroup: ButtonGroup, value: string | symbol): void {
    switch (fBtnGroup) {
    case this._fScope:
      this.#asyncEstimateFilter(this._pScope.getHintPanel());
      break;
    default:
      break;
    }
  }

  _renderContentOnRender(render: any): void {
    let pList = new ListPanel();
    render.wrapPanel(pList);

    let p = this._pScope;
    pList.pushPanel(p);
    this._fScope.attachRender(p.getContentPanel());
    this.#asyncEstimateFilter(p.getHintPanel());
    this._fScope.render();

    pList.pushSpace(1);

    p = new PanelWrapper();
    pList.pushPanel(p);
    this._fMethod.attachRender(p);
    this._fMethod.render();

    pList.pushSpace(1);

    p = new PanelWrapper();
    pList.pushPanel(p);
    this._fBtnApply.attachRender(p);
    this._fBtnApply.render();
  }

  #onSubmit(): void {
    let url = "api/school/quiz_ids"; // TODO: Replace quizzes in backend.
    let fd = new FormData();
    // TODO: All vs unmarked only, tags, downsample, id range.
    fd.append("scope", this._fScope.getSelectedValue() as string);
    fd.append("tags", "");    // TODO: support advanced tag operations.
    fd.append("from_idx", "0"); // If known from previous gen
    fd.append("to_idx", "1000");
    fd.append("down_sample", "100");
    Api.asFragmentPost(this, url, fd)
        .then((d: any) => this.#onQuizIdListRRR(d));
  }

  #asyncEstimateFilter(pHint: Panel): void {
    let url = "api/school/quiz_count";
    let fd = new FormData();
    fd.append("scope", this._fScope.getSelectedValue() as string);
    Api.asFragmentPost(this, url, fd)
        .then((d: any) => this.#onEstimateFilterRRR(d, pHint));
  }

  #onEstimateFilterRRR(data: any, pHint: Panel): void {
    pHint.replaceContent("Items selected: " + data.total);
  }

  #onQuizIdListRRR(data: any): void {
    let ids = data.ids as string[];
    // TODO: Shuffle if needed
    this._delegate.onQuizIdListGeneratedInQuizFilterContentFragment(
        this, ids, this._fMethod.getSelectedValue() as symbol);
  }
}
