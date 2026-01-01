import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PRegisterBase extends Panel {
  constructor() { super(); }

  isColorInvertible() { return false; }

  getNameDecorationPanel() { return null; }
  getNamePanel() { return null; }
  getNameEditorPanel() { return null; }
  getTerminalInfoPanel() { return null; }
  getTerminalListPanel() { return null; }

  invertColor() {}
};
