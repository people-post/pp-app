
const _CPT_OGP_SMALL = {
  MAIN : `<div class="aspect-3-1-frame">
  <div class="aspect-content h100 hide-overflow quote-element small flex flex-begin">
    <div id="__ID_IMAGE__"></div>
    <div class="flex-grow pad5px">
      <div class="flex space-between">
        <div id="__ID_AUTHOR__"></div>
        <div id="__ID_TIME__" class="small-info-text"></div>
      </div>
      <div id="__ID_TITLE__" class="u-font5"></div>
      <div id="__ID_CONTENT__" class="u-font5"></div>
    </div>
  </div>
  </div>`,
}

export class POgpSmall extends blog.POgp {
  _getTemplate() { return _CPT_OGP_SMALL.MAIN; }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.POgpSmall = POgpSmall;
}
