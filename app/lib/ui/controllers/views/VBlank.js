import { FViewContentBase } from '../fragments/FViewContentBase.js';
import { Panel } from '../../renders/panels/Panel.js';
import { View } from './View.js';

class FvcBlank extends FViewContentBase {
  #isColorInvert = false;

  setInvertColor(b) { this.#isColorInvert = b; }

  _renderOnRender(render) {
    let p = new Panel();
    if (this.#isColorInvert) {
      p.setClassName("h100 s-cprimebg");
    }
    render.wrapPanel(p);
  }
}

export class VBlank extends View {
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

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.VBlank = VBlank;
}
