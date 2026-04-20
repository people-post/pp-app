export const CF_STORY_EVENT_INFO = {
  ONCLICK: "CF_STORY_EVENT_INFO_1",
} as const;

const _CFT_STORY_EVENT_INFO = {
  MAIN : `<div class="story-event-info tw:p-[5px] tw:cursor-pointer __CLASS_NAME__">
    <div class="tw:text-s-font4 __NAME_CELL_CLASS__">__NAME__</div>
    <div class="small-info-text">__TIME__</div>
    <div class="tw:text-s-font5">__DETAIL__</div>
  </div>`,
} as const;

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import type { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { StoryEvent } from '../../common/datatypes/StoryEvent.js';
import ExtUtilities from '../../lib/ext/Utilities.js';

export interface FStoryEventInfoDataSource {
  isEventSelectedInFStoryEventInfo(f: FStoryEventInfo, id: string): boolean;
}

export interface FStoryEventInfoDelegate {
  onStoryEventInfoClicked(f: FStoryEventInfo, id: string): void;
}

export class FStoryEventInfo extends Fragment {
  protected _event: StoryEvent | null = null;
  protected _id: string | null = null;

  constructor() {
    super();
  }

  setEvent(e: StoryEvent): void { this._event = e; }

  action(type: string | symbol, ..._args: unknown[]): void {
    switch (type) {
    case CF_STORY_EVENT_INFO.ONCLICK:
      if (this._id) {
        this.getDelegate<FStoryEventInfoDelegate>()?.onStoryEventInfoClicked(this, this._id);
      }
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  _renderOnRender(render: PanelWrapper): void {
    if (!this._event) {
      return;
    }

    let p = new Panel();
    p.setAttribute("data-pp-action", CF_STORY_EVENT_INFO.ONCLICK);
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
      let ds = this.getDataSource<FStoryEventInfoDataSource>();
      if (ds) {
        isSelected = ds.isEventSelectedInFStoryEventInfo(this, this._id);
      }
    }
    if (isSelected) {
      s = s.replace("__CLASS_NAME__", "s-cprimebd");
    } else {
      s = s.replace("__CLASS_NAME__", "tw:border-gray-300");
    }

    p.replaceContent(s);
  }

  #renderEventFramework(): string {
    let e = this._event;
    if (!e) {
      return "";
    }

    let s: string = _CFT_STORY_EVENT_INFO.MAIN;
    let name = e.getName();
    if (name) {
      s = s.replace("__NAME__", name);
    } else {
      s = s.replace("__NAME__", "");
    }
    if (e.getTime()) {
      s = s.replace("__TIME__",
                    ExtUtilities.timestampToDateTimeString(e.getTime()));
    } else {
      s = s.replace("__TIME__", "");
    }
    let description = e.getDescription();
    if (description) {
      s = s.replace("__DETAIL__", description);
    } else {
      s = s.replace("__DETAIL__", "");
    }
    return s;
  }

  #renderModificationEvent(): string {
    let s = this.#renderEventFramework();
    return s.replace("__NAME_CELL_CLASS__", "tw:bg-yellow-200");
  }

  #renderStatusEvent(): string {
    let s = this.#renderEventFramework();
    return s.replace("__NAME_CELL_CLASS__", "tw:bg-green-300");
  }
}
