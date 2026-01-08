import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export class FvcLoginBase extends FScrollViewContent {
  getActionButton(): Fragment {
    // Return empty fragment to avoid being assigned with default action button
    return new Fragment();
  }
}
