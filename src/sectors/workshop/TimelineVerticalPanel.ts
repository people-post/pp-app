import { TimelinePanel } from './TimelinePanel.js';
import { TimelineVerticalNodePanel } from './TimelineVerticalNodePanel.js';

export class TimelineVerticalPanel extends TimelinePanel {
  protected _createNodePanel(): TimelineVerticalNodePanel {
    return new TimelineVerticalNodePanel();
  }
}
