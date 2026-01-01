import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FFragmentList } from '../../lib/ui/controllers/fragments/FFragmentList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { FDraftArticleInfo } from './FDraftArticleInfo.js';

export class FDraftList extends Fragment {
  #fList;
  #selectedId = null;

  constructor() {
    super();
    this.#fList = new FFragmentList();
    this.setChild("list", this.#fList);
  }

  isDraftSelectedInDraftArticleInfoFragment(fDraftInfo, draftId) {
    return this.#selectedId == draftId;
  }

  onClickInDraftArticleInfoFragment(fDraftInfo, draftId) {
    this.#selectedId = draftId;
    this.render();
  }

  _renderDrafts(panel, ids) {
    if (ids.length) {
      this.#fList.clear();

      let pList = new ListPanel();
      panel.wrapPanel(pList);

      // Hack to make fItems as event source, may need better design
      this.#fList.attachRender(pList);

      for (let id of ids) {
        let p = new PanelWrapper();
        pList.pushPanel(p);
        let f = new FDraftArticleInfo();
        f.setDelegate(this);
        f.setDataSource(this);
        f.setDraftId(id);
        this.#fList.append(f);
        f.attachRender(p);
        f.render();
      }
    } else {
      panel.replaceContent("Empty");
    }
  }
};
