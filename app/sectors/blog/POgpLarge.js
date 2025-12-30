
const _CPT_OGP_LARGE = {
  MAIN : `<div class="quote-element pad5px">
  <div class="flex space-between">
    <div id="__ID_AUTHOR__"></div>
    <div id="__ID_TIME__" class="small-info-text"></div>
  </div>
  <div class="quote-element-content pad5px">
    <div id="__ID_TITLE__" class="u-font5"></div>
    <div id="__ID_CONTENT__" class="u-font5"></div>
  </div>
  <div id="__ID_IMAGE__"></div>
  </div>`,
}

class POgpLarge extends blog.POgp {
  _getTemplate() { return _CPT_OGP_LARGE.MAIN; }
};

blog.POgpLarge = POgpLarge;
}(window.blog = window.blog || {}));
