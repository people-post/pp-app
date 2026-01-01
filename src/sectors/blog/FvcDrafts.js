import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { FInsiderAuthorDraftList } from './FInsiderAuthorDraftList.js';
import { FInsiderTaskDraftList } from './FInsiderTaskDraftList.js';
import { FOwnerDraftList } from './FOwnerDraftList.js';
import { Account } from '../../common/dba/Account.js';

export class FvcDrafts extends FScrollViewContent {
  #fInsiderAuthored;
  #fInsiderTasks;
  #fTasks;

  constructor() {
    super();
    this.#fInsiderAuthored = new FInsiderAuthorDraftList();
    this.setChild("insiderAuthored", this.#fInsiderAuthored);

    this.#fInsiderTasks = new FInsiderTaskDraftList();
    this.setChild("insiderTasks", this.#fInsiderTasks);

    this.#fTasks = new FOwnerDraftList();
    this.setChild("tasks", this.#fTasks);
  }

  _renderContentOnRender(render) {
    let pList = new ListPanel();
    render.wrapPanel(pList);

    let p = new PanelWrapper();
    pList.pushPanel(p);
    this.#fInsiderAuthored.attachRender(p);
    this.#fInsiderAuthored.render();

    p = new PanelWrapper();
    pList.pushPanel(p);
    this.#fInsiderTasks.attachRender(p);
    this.#fInsiderTasks.render();

    if (Account.isWebOwner()) {
      p = new SectionPanel("Tasks");
      pList.pushPanel(p);
      this.#fTasks.attachRender(p.getContentPanel());
      this.#fTasks.render();
    }
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FvcDrafts = FvcDrafts;
}
