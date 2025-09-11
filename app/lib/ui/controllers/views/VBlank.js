(function(ui) {
class FvcBlank extends ui.FViewContentBase {
  #isColorInvert = false;

  setInvertColor(b) { this.#isColorInvert = b; }

  _renderOnRender(render) {
    let p = new ui.Panel();
    if (this.#isColorInvert) {
      p.setClassName("h100 s-cprimebg");
    }
    render.wrapPanel(p);
  }
};

class VBlank extends ui.View {
  static T_LAYOUT = {
    BGPRIME : Symbol(),
  };

  #fContent = null;

  constructor() {
    super();
    this.#fContent = new FvcBlank();
    this.setContentFragment(this.#fContent);
  }

  setLayoutType(t) {
    if (t == this.constructor.T_LAYOUT.BGPRIME) {
      this.#fContent.setInvertColor(true);
    }
  }
}

ui.VBlank = VBlank;
}(window.ui = window.ui || {}));
