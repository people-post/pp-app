
import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class FvcQuiz extends FScrollViewContent {
  constructor() {
    super();
    this._fQuiz = new scol.FQuiz();
    this._fQuiz.setLayoutType(scol.FQuiz.T_LAYOUT.FULL);
    this._fQuiz.setDataSource(this);
    this._fQuiz.setDelegate(this);
    this.setChild("quiz", this._fQuiz);

    this._fNavBar = new scol.FListNavigationBar();
    this._fNavBar.setDataSource(this);
    this._fNavBar.setDelegate(this);
    this.setChild("navBar", this._fNavBar);

    this._idList = [];
  }

  isQuizSelectedInQuizFragment(fQuiz, quizId) { return false; }
  setQuizIds(ids) {
    this._idList = ids;
    this._fNavBar.setIdx(0);
    this._fNavBar.setNTotal(ids.length);
    this._fQuiz.setQuizId(ids[0]);
  }

  onQuizInfoClickedInQuizFragment(fQuiz, quizId) {}
  onNavigableListItemFragmentRequestSwitchItem(fNavListItem, idx) {
    this._fQuiz.setQuizId(this._idList[idx]);
    this._fQuiz.render();
    this._delegate.onQuizIdxChangedInQuizContentFragment(this, idx);
  }

  _renderContentOnRender(render) {
    let pList = new ListPanel();
    render.wrapPanel(pList);

    let p = new PanelWrapper();
    p.setClassName("hmin300px");
    pList.pushPanel(p);
    this._fQuiz.attachRender(p);
    this._fQuiz.render();

    pList.pushSpace(1);

    p = new PanelWrapper();
    p.setClassName("pad5");
    pList.pushPanel(p);
    this._fNavBar.attachRender(p);
    this._fNavBar.render();
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.scol = window.scol || {};
  window.scol.FvcQuiz = FvcQuiz;
}
