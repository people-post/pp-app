import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export class MajorSectorItem extends Fragment {}

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  window.gui.MajorSectorItem = MajorSectorItem;
}

