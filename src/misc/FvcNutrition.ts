import { FScrollViewContent } from '../lib/ui/controllers/fragments/FScrollViewContent.js';
import Render from '../lib/ui/renders/Render.js';
import { glb } from '../lib/framework/Global.js';

interface NutritionData {
  [key: string]: {
    name: string;
    unit: string;
    data: { [key: string]: number };
  };
}

interface NutritionReference {
  name: string;
  value: {
    symbol: string;
  };
}

interface NutritionLibData {
  reference: NutritionReference[];
  data: NutritionData;
}

class NutritionLib {
  reference: NutritionReference[];
  private _data: NutritionData;

  constructor(data: NutritionLibData) {
    this.reference = data['reference'];
    this._data = data['data'];
  }

  getData(name: string): { name: string; unit: string; data: { [key: string]: number } } | undefined {
    return this._data[name];
  }
}

class FvcNutrition extends FScrollViewContent {
  private _nutritionLib: NutritionLib | null = null;

  _onRenderAttached(render: Render): void {
    super._onRenderAttached(render);
    this._asyncLoadFoods();
  }

  _renderContentOnRender(render: Render): void {
    if (!this._nutritionLib) {
      return;
    }
    let name = "Almond";
    let data = this._nutritionLib.getData(name);
    if (!data) {
      return;
    }
    let t = document.getElementById("template_food_main")!.innerHTML;
    let c = t.replace("__NAME__", data.name);
    c = c.replace("__UNIT__", data.unit);
    c = c.replace("__TABLE__", this.#renderNutrition(data));
    render.replaceContent(c);
  }

  _asyncLoadFoods(): void {
    let url = "/api/user/data/nutrition";
    glb.api!.asFragmentCall(this, url).then((d: unknown) => this.#onNutritionRRR(d as NutritionLibData));
  }

  #onNutritionRRR(data: NutritionLibData): void {
    this.#resetSessionData(data);
    this.render();
  }

  #resetSessionData(data: NutritionLibData): void {
    this._nutritionLib = new NutritionLib(data);
  }

  #renderNutrition(data: { name: string; unit: string; data: { [key: string]: number } }): string {
    var table = document.createElement("TABLE") as HTMLTableElement;
    table.className = "nutrition";
    var row: HTMLTableRowElement, cell: HTMLTableCellElement, d: number | undefined, ref: NutritionReference;
    for (var i = 0; i < this._nutritionLib!.reference.length; ++i) {
      ref = this._nutritionLib!.reference[i];
      row = table.insertRow(-1);
      d = data.data[ref.name];
      cell = row.insertCell(-1);
      cell.innerHTML = ref.name + "(" + ref.value.symbol + ")";
      cell = row.insertCell(-1);
      if (!d) {
        d = 0;
      }
      cell.innerHTML = this.#renderMeter(d).outerHTML;
    }
    var head = table.createTHead();
    row = head.insertRow(-1);
    cell = row.insertCell(-1);
    cell.innerHTML = "Name";
    cell = row.insertCell(-1);
    cell.innerHTML = "Value";
    return table.outerHTML;
  }

  #renderMeter(value: number): HTMLMeterElement {
    var m = document.createElement("METER") as HTMLMeterElement;
    m.low = 30;
    m.high = 80;
    m.max = 100;
    m.min = 0;
    m.value = value;
    m.optimum = 100;
    m.innerHTML = value + "%";
    return m;
  }
}

export default FvcNutrition;
