import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcCoinHistory extends FScrollViewContent {
  protected _communityId: string | null = null;

  constructor() {
    super();
  }

  setCommunityId(id: string | null): void { this._communityId = id; }

  _renderContentOnRender(_render: Render): void {
    // TODO: Implement rendering
  }
}
