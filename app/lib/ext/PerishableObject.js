(function(ext) {
class PerishableObject {
  #data;
  #timeout;
  #tExpire;

  constructor(timeout) {
    this.#timeout = timeout; // In ms.
  }

  getData() { return this.#isValid() ? this.#data : null; }
  setData(data) {
    this.#data = data;
    this.#tExpire = Date.now() + this.#timeout;
  }

  #isValid() { return this.#tExpire && Date.now() < this.#tExpire; }
};

ext.PerishableObject = PerishableObject;
}(window.ext = window.ext || {}));
