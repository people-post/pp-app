import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PWalkinQueueItemBase extends Panel {
  protected _pName: Panel;

  constructor() {
    super();
    this._pName = new Panel();
  }

  getNameDecorPanel(): Panel | null { return null; }
  getNamePanel(): Panel { return this._pName; }
  getActionPanel(_idx: number): Panel | null { return null; }
  getAgentPanel(): Panel | null { return null; }

  invertColor(): void {}
}
