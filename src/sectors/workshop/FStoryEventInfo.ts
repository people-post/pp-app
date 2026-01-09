export const CF_STORY_EVENT_INFO = {
  ONCLICK : Symbol(),
} as const;

const _CFT_STORY_EVENT_INFO = {
  MAIN : `<div class="story-event-info pad5px clickable __CLASS_NAME__">
    <div class="s-font4 __NAME_CELL_CLASS__">__NAME__</div>
    <div class="small-info-text">__TIME__</div>
    <div class="s-font5">__DETAIL__</div>
  </div>`,
} as const;

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { StoryEvent } from '../../common/datatypes/StoryEvent.js';
import ExtUtilities from '../../lib/ext/Utilities.js';

interface StoryEventInfoDataSource {
  isEventSelectedInFStoryEventInfo(f: FStoryEventInfo, id: string): boolean;
}

interface StoryEventInfoDelegate {
  onStoryEventInfoClicked(f: FStoryEventInfo, id: string): void;
}

export class FStoryEventInfo extends Fragment {
  protected _event: StoryEvent | null = null;
  protected _id: string | null = null;
  protected _dataSource!: StoryEventInfoDataSource;
  protected _delegate!: StoryEventInfoDelegate;

  constructor() {
    super();
  }

  setEvent(e: StoryEvent): void { this._event = e; }

  action(type: string | symbol, ..._args: unknown[]): void {
    switch (type) {
    case CF_STORY_EVENT_INFO.ONCLICK:
      if (this._id) {
        this._delegate.onStoryEventInfoClicked(this, this._id);
      }
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  _renderOnRender(render: Panel): void {
    if (!this._event) {
      return;
    }

    let p = new Panel();
    p.setAttribute("onclick",
                   "javascript:G.action(CF_STORY_EVENT_INFO.ONCLICK)");
    render.wrapPanel(p);
    let s = "";
    switch (this._event.getType()) {
    case StoryEvent.T_TYPE.MODIFICATION:
      s = this.#renderModificationEvent();
      break;
    case StoryEvent.T_TYPE.STATUS:
      s = this.#renderStatusEvent();
      break;
    default:
      break;
    }
    let isSelected = false;
    if (this._id) {
      isSelected =
          this._dataSource.isEventSelectedInFStoryEventInfo(this, this._id);
    }
    if (isSelected) {
      s = s.replace("__CLASS_NAME__", "s-cprimebd");
    } else {
      s = s.replace("__CLASS_NAME__", "bdlightgrey");
    }

    p.replaceContent(s);
  }

  #renderEventFramework(): string {
    let e = this._event;
    if (!e) {
      return "";
    }

    let s = _CFT_STORY_EVENT_INFO.MAIN;
    if (e.getName()) {
      s = s.replace("__NAME__", e.getName());
    } else {
      s = s.replace("__NAME__", "");
    }
    if (e.getTime()) {
      s = s.replace("__TIME__",
                    ExtUtilities.timestampToDateTimeString(e.getTime()));
    } else {
      s = s.replace("__TIME__", "");
    }
    if (e.getDescription()) {
      s = s.replace("__DETAIL__", e.getDescription());
    } else {
      s = s.replace("__DETAIL__", "");
    }
    return s;
  }

  #renderModificationEvent(): string {
    let s = this.#renderEventFramework();
    return s.replace("__NAME_CELL_CLASS__", "bglightyellow");
  }

  #renderStatusEvent(): string {
    let s = this.#renderEventFramework();
    return s.replace("__NAME_CELL_CLASS__", "bglightgreen");
  }
}
