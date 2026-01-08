import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { FvcQuizFilter } from './FvcQuizFilter.js';
import { FvcQuizList } from './FvcQuizList.js';
import { FvcFlashcard } from './FvcFlashcard.js';
import { R } from '../../common/constants/R.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class FvcInteractive extends FScrollViewContent {
  protected _fBtnResume: Button;
  protected _fBtnGen: Button;

  constructor() {
    super();
    this._fBtnResume = new Button();
    this._fBtnResume.setName("Resume learning");
    this._fBtnResume.setDelegate(this);
    this.setChild("btnResume", this._fBtnResume);

    this._fBtnGen = new Button();
    this._fBtnGen.setName("New learning...");
    this._fBtnGen.setDelegate(this);
    this.setChild("btnGen", this._fBtnGen);
  }

  onSimpleButtonClicked(fBtn: Button): void {
    switch (fBtn) {
    case this._fBtnResume:
      this.#onResume();
      break;
    case this._fBtnGen:
      this.#onGen();
      break;
    default:
      break;
    }
  }
  onQuizIdListGeneratedInQuizFilterContentFragment(fvcFilter: FvcQuizFilter, ids: string[],
                                                   displayMethod: symbol): void {
    Events.triggerTopAction(T_ACTION.CLOSE_DIALOG, this);
    switch (displayMethod) {
    case FvcQuizFilter.T_PRESENTATION.FLASHCARD:
      this.#showFlashcards(ids);
      break;
    case FvcQuizFilter.T_PRESENTATION.QUIZ:
      this.#showQuizzes(ids);
      break;
    default:
      break;
    }
  }

  renderItemForSimpleListFragment(fSimpleList: any, item: any, panel: Panel): void {
    panel.replaceContent(item.data.name);
  }

  _renderContentOnRender(render: any): void {
    // TODO:
    // Puzzles, real practice client queue etc.
    let pList = new ListPanel();
    render.wrapPanel(pList);

    pList.pushSpace(1);

    let p = new PanelWrapper();
    pList.pushPanel(p);
    this._fBtnResume.setEnabled(false);
    this._fBtnResume.attachRender(p);
    this._fBtnResume.render();

    pList.pushSpace(1);

    p = new PanelWrapper();
    pList.pushPanel(p);
    this._fBtnGen.attachRender(p);
    this._fBtnGen.render();
  }

  #onResume(): void {}

  #onGen(): void {
    // TODO: Is resumable
    if (true) {
      this._confirmDangerousOperation(R.get("CONFIRM_GEN_QUIZ"),
                                      () => this.#showQuizFilter());
    } else {
      this.#showQuizFilter();
    }
  }

  #showQuizFilter(): void {
    let v = new View();
    let f = new FvcQuizFilter();
    f.setDelegate(this);
    v.setContentFragment(f);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v,
                                "Quiz filter", false);
  }

  #showQuizzes(ids: string[]): void {
    let v = new View();
    let f = new FvcQuizList();
    f.setQuizIds(ids);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Quizzes");
  }

  #showFlashcards(ids: string[]): void {
    let v = new View();
    let f = new FvcFlashcard();
    f.setQuizIds(ids);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Flashcard");
  }
}
