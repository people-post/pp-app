import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { POverview } from './POverview.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import type Render from '../../lib/ui/renders/Render.js';

export interface FOverviewDelegate {
  onNewProposalRequestAcceptedInOverviewFragment(f: FOverview): void;
  onCommunityOverviewFragmentRequestShowView(f: FOverview, view: View, title: string): void;
}

export class FOverview extends Fragment {
  private _communityId: string | null = null;

  setCommunityId(id: string | null): void {
    this._communityId = id;
    this.render();
  }

  _renderOnRender(render: Render): void {
    let panel = new POverview();
    render.wrapPanel(panel);
    // TODO: Implement community overview rendering logic
  }
}

export default FOverview;
