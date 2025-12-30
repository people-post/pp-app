
export class FQueueStatusMessage extends ui.Fragment {
  constructor() {
    super();
    this._fText = new ui.Label();
    this.setChild("text", this._text);
  }

  updateStatus(n, nTotal) {
    if (nTotal == 0) {
      // Too late to accept more customers
      this._fText.setClassName("s-font5 cred");
      this.#updateText(R.get("OUT_OF_SERVICE"));
    } else if (n == 0) {
      this._fText.setClassName("s-font5 cforestgreen");
      this.#updateText("Ready to serve: " + nTotal + " available");
    } else if (n < nTotal) {
      // Ready to serve
      // TODO: Better way to detemine when is green, yellow or red
      if (n < nTotal * 0.2) {
        this._fText.setClassName("s-font5 cforestgreen");
      } else if (n < nTotal * 0.5) {
        this._fText.setClassName("s-font5 cgoldenrod");
      } else {
        this._fText.setClassName("s-font5 cred");
      }
      this.#updateText("Queue size: " + n + "/" + nTotal);
    } else {
      // Queue full
      this._fText.setClassName("s-font5 cred");
      this.#updateText("Queue full: " + n + "/" + nTotal);
    }
  }

  clearStatus() { this.#updateText(""); }

  _renderOnRender(render) {
    this._fText.attachRender(render);
    this._fText.render();
  }

  #updateText(text) {
    this._fText.setText(text);
    this._fText.render();
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FQueueStatusMessage = FQueueStatusMessage;
}
