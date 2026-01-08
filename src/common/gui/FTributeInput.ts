import { FInput } from '../../lib/ui/controllers/fragments/FInput.js';
import { NumberInput } from '../../lib/ui/controllers/fragments/NumberInput.js';
import { SplitPanel } from '../../lib/ui/renders/panels/SplitPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

const _CF_TRIBUTE_INPUT = {
  TYPE : {FLAT : "FLAT"},
}

interface TributeConfig {
  type?: string;
  data?: number;
}

export class FTributeInput extends FInput {
  private _fPercent: NumberInput;
  protected _config: TributeConfig = { type: _CF_TRIBUTE_INPUT.TYPE.FLAT };

  constructor() {
    super();
    this._fPercent = new NumberInput();
    this.setChild('percent', this._fPercent);
  }

  getConfig(): TributeConfig {
    // Same format as server return object
    return {
      type : _CF_TRIBUTE_INPUT.TYPE.FLAT,
      data : this._fPercent.getValue()
    };
  }

  setConfig(config: TributeConfig | null): void {
    // Same format as server return object
    if (config) {
      switch (config.type) {
      case _CF_TRIBUTE_INPUT.TYPE.FLAT:
        this.#setFlatTribute(config.data || 0);
        break;
      default:
        break;
      }
    } else {
      this.#setFlatTribute(0);
    }
    super.setConfig(config);
  }

  _renderOnRender(render: Panel): void {
    let pSplit = new SplitPanel();
    render.wrapPanel(pSplit);

    let p = pSplit.getLeftPanel();
    p.setClassName("small-info-text");
    p.replaceContent(this.#renderTributeType());

    p = pSplit.getRightPanel();
    this.#renderTributeInputOnRender(p);
  }

  #renderTributeType(): string {
    let s = "Type: ";
    switch (this._config.type) {
    case _CF_TRIBUTE_INPUT.TYPE.FLAT:
      s += "Flat";
      break;
    default:
      s += "N/A";
      break;
    }
    return s;
  }

  #renderTributeInputOnRender(render: Panel): void {
    switch (this._config.type) {
    case _CF_TRIBUTE_INPUT.TYPE.FLAT:
      this.#renderFlatTribute(render);
      break;
    default:
      break;
    }
  }

  #renderFlatTribute(render: Panel): void {
    this._fPercent.attachRender(render);
    this._fPercent.render();
  }

  #setFlatTribute(percent: number): void {
    this._fPercent.setConfig({
      title : "",
      max : 100,
      min : 0,
      step : 1,
      value : percent,
      unit : "%"
    });
  }
}

export default FTributeInput;

