(function(ui) {
const _CFT_SIMPLE_IMAGE = {
  MAIN : `<img class="preview-icon s-icon0" src="__URL__">`,
}

class SimpleImage extends ui.Fragment {
  constructor() {
    super();
    this._src = null;
  }
  
  setSrc(src) { this._src = src; }
  
  _renderContent() {
    let s = _CFT_SIMPLE_IMAGE.MAIN;
    s = s.replace("__URL__", this._src);
    return s;
  }
};


ui.SimpleImage = SimpleImage;
}(window.ui = window.ui || {}));
