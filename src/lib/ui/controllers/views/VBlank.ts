import { FViewContentBase } from '../fragments/FViewContentBase.js';
import { Panel } from '../../renders/panels/Panel.js';
import { View } from './View.js';

class FvcBlank extends FViewContentBase {
  #isColorInvert: boolean = false;

  setInvertColor(b: boolean): void { this.#isColorInvert = b; }

  _renderOnRender(render: any): void {
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
  } as const;

  #fContent: FvcBlank;

  constructor() {
    super();
    this.#fContent = new FvcBlank();
    this.setContentFragment(this.#fContent);
  }

  setLayoutType(t: symbol): void {
    if (t == this.constructor.T_LAYOUT.BGPRIME) {
      this.#fContent.setInvertColor(true);
    }
  }
}

