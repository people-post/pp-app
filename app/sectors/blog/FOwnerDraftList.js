(function(blog) {
class FOwnerDraftList extends blog.FDraftList {
  _renderOnRender(render) {
    this._renderDrafts(render, [ "5ee3a1674d837b2ea335834e" ]);
  }
};

blog.FOwnerDraftList = FOwnerDraftList;
}(window.blog = window.blog || {}));
