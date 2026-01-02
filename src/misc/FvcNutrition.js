import { FScrollViewContent } from '../lib/ui/controllers/fragments/FScrollViewContent.js';

class NutritionLib {
  constructor(data) {
    this.reference = data['reference'];
    this._data = data['data'];
  }

  getData(name) { return this._data[name]; }
}

class FvcNutrition extends FScrollViewContent {
  constructor() {
    super();
    this._nutritionLib = null;
  }

  _onRenderAttached(render) {
    super._onRenderAttached(render);
    this._asyncLoadFoods();
  }

  _renderContentOnRender(render) {
    if (!this._nutritionLib) {
      return;
    }
    let name = "Almond";
    let data = this._nutritionLib.getData(name);
    let t = document.getElementById("template_food_main").innerHTML;
    let c = t.replace("__NAME__", data.name);
    c = c.replace("__UNIT__", data.unit);
    c = c.replace("__TABLE__", this.#renderNutrition(data));
    render.replaceContent(c);
  }

  _asyncLoadFoods() {
    let url = "/api/user/data/nutrition";
    glb.api.asFragmentCall(this, url).then(d => this.#onNutritionRRR(d));
  }

  #onNutritionRRR(data) {
    this.#resetSessionData(data);
    this.render();
  }

  #resetSessionData(data) { this._nutritionLib = new NutritionLib(data); }

  #renderNutrition(data) {
    var table = document.createElement("TABLE");
    table.className = "nutrition";
    var row, cell, d, ref;
    for (var i = 0; i < this._nutritionLib.reference.length; ++i) {
      ref = this._nutritionLib.reference[i];
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

  #renderMeter(value) {
    var m = document.createElement("METER");
    m.low = 30;
    m.high = 80;
    m.max = 100;
    m.min = 0;
    m.value = value;
    m.optimum = 100;
    m.innerHTML = value + "%";
    return m;
  }
};
