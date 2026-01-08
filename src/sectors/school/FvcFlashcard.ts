import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { FFlashcard } from './FFlashcard.js';
import { FListNavigationBar } from './FListNavigationBar.js';

export class FvcFlashcard extends FScrollViewContent {
  protected _fCard: FFlashcard;
  protected _fNavBar: FListNavigationBar;
  protected _idList: string[] = [];

  constructor() {
    super();
    this._fCard = new FFlashcard();
    this.setChild("card", this._fCard);

    this._fNavBar = new FListNavigationBar();
    this._fNavBar.setDelegate(this);
    this.setChild("navBar", this._fNavBar);

    this._idList = [];
  }

  setQuizIds(ids: string[]): void {
    this._idList = ids;
    this._fNavBar.setIdx(0);
    this._fNavBar.setNTotal(ids.length);
    if (ids.length > 0) {
      this._fCard.setQuizId(ids[0]);
    }
  }

  onNavigableListItemFragmentRequestSwitchItem(fNavBar: FListNavigationBar, idx: number): void {
    if (idx >= 0 && idx < this._idList.length) {
      this._fCard.setQuizId(this._idList[idx]);
      this._fCard.render();
    }
  }

  _renderContentOnRender(render: any): void {
    let pList = new ListPanel();
    render.wrapPanel(pList);

    let p = new PanelWrapper();
    p.setClassName("hmin300px");
    pList.pushPanel(p);
    this._fCard.attachRender(p);
    this._fCard.render();

    pList.pushSpace(1);

    p = new PanelWrapper();
    p.setClassName("pad5");
    pList.pushPanel(p);
    this._fNavBar.attachRender(p);
    this._fNavBar.render();
  }
}
