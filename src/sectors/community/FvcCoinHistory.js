import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';

export class FvcCoinHistory extends FScrollViewContent {
  constructor() {
    super();
    this._communityId;
  }

  setCommunityId(id) { this._communityId = id;   }
}
