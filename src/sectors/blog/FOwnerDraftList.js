import { FDraftList } from './FDraftList.js';

export class FOwnerDraftList extends FDraftList {
  _renderOnRender(render) {
    this._renderDrafts(render, [ "5ee3a1674d837b2ea335834e" ]);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FOwnerDraftList = FOwnerDraftList;
}
