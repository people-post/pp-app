import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { TimelineFragment } from './TimelineFragment.js';
import { FStoryEventInfo } from './FStoryEventInfo.js';
import { FProjectStage } from './FProjectStage.js';
import { StoryEvent } from '../../common/datatypes/StoryEvent.js';
import { STATE } from '../../common/constants/Constants.js';

export class FProjectProgress extends Fragment {
  constructor() {
    super();
    this._fTimeline = new TimelineFragment();
    this.setChild("timeline", this._fTimeline);

    this._currentItemId = null;
  }

  isEventSelectedInFStoryEventInfo(fStoryEventInfo, id) {
    return this._currentItemId == id;
  }

  onStoryEventInfoClicked(fStoryEventInfo, id) {
    if (this._currentItemId == id) {
      this._currentItemId = null;
    } else {
      this._currentItemId = id;
    }
    this._fTimeline.render();
  }
  onClickInProjectStageFragment(fStage) {}

  _renderOnRender(render) {
    let pMain = new ListPanel();
    render.wrapPanel(pMain);

    let p = new PanelWrapper();
    pMain.pushPanel(p);

    this._fTimeline.clear();
    let events = this.#getStoryEvents();
    for (let e of events) {
      let f = new FStoryEventInfo();
      f.setDataSource(this);
      f.setDelegate(this);
      f.setEvent(e);
      this._fTimeline.append(f);
    }

    this._fTimeline.markStop();

    for (let i of this.#getStoryStageItems()) {
      let f = new FProjectStage();
      f.setDelegate(this);
      f.setLayoutType(FProjectStage.LTR_MID);
      f.setStage(i);
      this._fTimeline.append(f);
    }

    this._fTimeline.attachRender(p);
    this._fTimeline.render();
  }

  #getStoryStageItems() {
    let project = this._dataSource.getProjectForProgressFragment(this);
    if (!project) {
      return [];
    }

    let items = [];
    switch (project.getState()) {
    case STATE.ONHOLD:
      items = project.getFinishedStagesOnEdge();
      break;
    case STATE.NEW:
    case STATE.ACTIVE:
      items = project.getUnfinishedStages();
      break;
    default:
      break;
    }
    return items;
  }

  #getStoryEvents() {
    let events = [];
    let project = this._dataSource.getProjectForProgressFragment(this);
    if (project) {
      // Created at
      events.push(new StoryEvent({
        name : "Created",
        type : StoryEvent.T_TYPE.STATUS,
        time : project.getCreationTime().getTime() / 1000
      }));

      // Done events
      let s = project.getStory();
      if (s) {
        for (let e of s.getEvents()) {
          events.push(e);
        }
      }
    }
    return events;
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.FProjectProgress = FProjectProgress;
}
