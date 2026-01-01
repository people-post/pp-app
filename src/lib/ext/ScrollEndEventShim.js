import { Controller } from './Controller.js';

export class ScrollEndEventShim extends Controller {
  #scrollEndEventPresent = false;
  #fcnScrollEnd = null;

  observe(element) {
    element.addEventListener("scroll", evt => this.#onScrollEvent(evt));
    element.addEventListener("scrollend", evt => this.#onScrollEndEvent(evt));
  }

  #onScrollEvent(evt) {
    // Some systems do not support scrollend event.
    // TODO: Make the variable global?
    if (!this.#scrollEndEventPresent) {
      // It may trigger onScrollEnd() twice when this.#scrollEndEventPresent
      // does become true for the first time, because of the delay effect
      this.#scheduleOnScollEnd(100);
    }
  }

  #scheduleOnScollEnd(dt) {
    window.clearTimeout(this.#fcnScrollEnd);
    this.#fcnScrollEnd = window.setTimeout(() => this.#onScrollEndSim(), dt);
  }

  #onScrollEndSim() {
    this.#fcnScrollEnd = null;
    this._delegate.onScrollEndInScrollEndEventShim(this);
  }

  #onScrollEndEvent(evt) {
    this.#scrollEndEventPresent = true;
    this._delegate.onScrollEndInScrollEndEventShim(this);
  }
}
