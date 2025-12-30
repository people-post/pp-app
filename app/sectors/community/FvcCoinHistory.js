export class FvcCoinHistory extends ui.FScrollViewContent {
  constructor() {
    super();
    this._communityId;
  }

  setCommunityId(id) { this._communityId = id;   }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.cmut = window.cmut || {};
  window.cmut.FvcCoinHistory = FvcCoinHistory;
}

