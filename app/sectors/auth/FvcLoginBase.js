import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export class FvcLoginBase extends FScrollViewContent {
  getActionButton() {
    // Return empty fragment to avoid being assigned with default action button
    return new Fragment();
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.auth = window.auth || {};
  window.auth.FvcLoginBase = FvcLoginBase;
}
