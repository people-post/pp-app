import { TimelinePanel } from './TimelinePanel.js';
import { TimelineVerticalNodePanel } from './TimelineVerticalNodePanel.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class TimelineVerticalPanel extends TimelinePanel {
  protected _createNodePanel(): Panel {
    return new TimelineVerticalNodePanel();
  }
}
