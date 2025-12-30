export const CF_STORY_EVENT_INFO = {
  ONCLICK : Symbol(),
};

const _CFT_STORY_EVENT_INFO = {
  MAIN : `<div class="story-event-info pad5px clickable __CLASS_NAME__">
    <div class="s-font4 __NAME_CELL_CLASS__">__NAME__</div>
    <div class="small-info-text">__TIME__</div>
    <div class="s-font5">__DETAIL__</div>
  </div>`,
};

import { Fragment } from '../../lib/ui/controllers/fragments/FFragment.js';

export class FStoryEventInfo extends Fragment {
  constructor() {
    super();
    this._event = null;
  }

  setEvent(e) { this._event = e; }

  action(type, ...args) {
    switch (type) {
    case wksp.CF_STORY_EVENT_INFO.ONCLICK:
      this._delegate.onStoryEventInfoClicked(this, this._id);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let p = new ui.Panel();
    p.setAttribute("onclick",
                   "javascript:G.action(wksp.CF_STORY_EVENT_INFO.ONCLICK)");
    render.wrapPanel(p)
    let s = "";
    switch (this._event.getType()) {
    case dat.StoryEvent.T_TYPE.MODIFICATION:
      s = this.#renderModificationEvent();
      break;
    case dat.StoryEvent.T_TYPE.STATUS:
      s = this.#renderStatusEvent();
      break;
    default:
      break;
    }
    let isSelected =
        this._dataSource.isEventSelectedInFStoryEventInfo(this, this._id);
    if (isSelected) {
      s = s.replace("__CLASS_NAME__", "s-cprimebd");
    } else {
      s = s.replace("__CLASS_NAME__", "bdlightgrey");
    }

    p.replaceContent(s);
  }

  #renderEventFramework() {
    let e = this._event;
    let s = _CFT_STORY_EVENT_INFO.MAIN;
    if (e.getName()) {
      s = s.replace("__NAME__", e.getName());
    } else {
      s = s.replace("__NAME__", "");
    }
    if (e.getTime()) {
      s = s.replace("__TIME__",
                    ext.Utilities.timestampToDateTimeString(e.getTime()));
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

  #renderModificationEvent() {
    let s = this.#renderEventFramework();
    return s.replace("__NAME_CELL_CLASS__", "bglightyellow");
  }

  #renderStatusEvent() {
    let s = this.#renderEventFramework();
    return s.replace("__NAME_CELL_CLASS__", "bglightgreen");
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.CF_STORY_EVENT_INFO = CF_STORY_EVENT_INFO;
}