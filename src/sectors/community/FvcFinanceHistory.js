import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';

export class FvcFinanceHistory extends FScrollViewContent {
  constructor() {
    super();
    this._communityId;
  }

  setCommunityId(id) { this._communityId = id;   }
}
