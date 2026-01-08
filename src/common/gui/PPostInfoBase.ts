import { PPostBase } from './PPostBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PPostInfoBase extends PPostBase {
  isColorInvertible(): boolean { return false; }
  isClickable(): boolean { return true; }

  getCrossRefPanel(): Panel | null { return null; }   // For reposts
  getOwnerIconPanel(): Panel | null { return null; }  // Owner icon
  getOwnerNamePanel(): Panel | null { return null; }  // Owner name
  getAuthorNamePanel(): Panel | null { return null; } // Author name
  getImagePanel(): Panel | null { return null; }      // Thumbnails

  setVisibilityClassName(_name: string): void {}

  enableImage(): void {}
  enableQuote(): void {}
  invertColor(): void {}
}

export default PPostInfoBase;

