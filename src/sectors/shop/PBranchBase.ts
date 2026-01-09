import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PBranchBase extends Panel {
  constructor() { super(); }

  isColorInvertible(): boolean { return false; }

  getNameDecorationPanel(): Panel | null { return null; }
  getNamePanel(): Panel | null { return null; }
  getNameEditorPanel(): Panel | null { return null; }
  getAddressPanel(): Panel | null { return null; }
  getRegisterInfoPanel(): Panel | null { return null; }
  getRegisterListPanel(): Panel | null { return null; }

  invertColor(): void {}
};
