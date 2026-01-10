import { Panel } from '../lib/ui/renders/panels/Panel.js';
import { ViewPanel } from '../lib/ui/renders/panels/ViewPanel.js';
import { ListPanel } from '../lib/ui/renders/panels/ListPanel.js';
import { ConsolePanel } from '../lib/ui/renders/panels/ConsolePanel.js';
import { ConsoleOverlayPanel } from '../lib/ui/renders/panels/ConsoleOverlayPanel.js';

export abstract class PMain extends Panel {
  // Required abstract methods
  abstract setEnableNavPanel(b: boolean): void;
  abstract getContentPanel(): ListPanel;

  // Optional methods (implemented by PMainTabbed but not PGadget)
  getHomeBtnPanel(): Panel | null { return null; }
  getLeftSidePanel(): ViewPanel | undefined { return undefined; }
  getRightSidePanel(): ViewPanel | undefined { return undefined; }
  isNavOverlay(): boolean { return false; }
  getConsoleOverlayPanel(): ConsoleOverlayPanel | undefined { return undefined; }
  isConsoleOverlay(): boolean | null { return null; }
  setEnableConsoleOverlay(_b: boolean): void {}
  getNavWrapperPanel(): ConsolePanel | null { return null; }
}
