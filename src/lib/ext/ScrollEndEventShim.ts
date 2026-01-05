import { Controller } from './Controller.js';

interface ScrollEndEventShimDelegate {
  onScrollEndInScrollEndEventShim(shim: ScrollEndEventShim): void;
}

export class ScrollEndEventShim extends Controller {
  #scrollEndEventPresent = false;
  #fcnScrollEnd: number | null = null;

  protected declare _delegate: ScrollEndEventShimDelegate | null;

  observe(element: Element): void {
    element.addEventListener('scroll', (evt) => this.#onScrollEvent(evt));
    element.addEventListener('scrollend', (evt) => this.#onScrollEndEvent(evt));
  }

  #onScrollEvent(_evt: Event): void {
    // Some systems do not support scrollend event.
    // TODO: Make the variable global?
    if (!this.#scrollEndEventPresent) {
      // It may trigger onScrollEnd() twice when this.#scrollEndEventPresent
      // does become true for the first time, because of the delay effect
      this.#scheduleOnScollEnd(100);
    }
  }

  #scheduleOnScollEnd(dt: number): void {
    if (this.#fcnScrollEnd !== null) {
      window.clearTimeout(this.#fcnScrollEnd);
    }
    this.#fcnScrollEnd = window.setTimeout(() => this.#onScrollEndSim(), dt);
  }

  #onScrollEndSim(): void {
    this.#fcnScrollEnd = null;
    if (this._delegate) {
      this._delegate.onScrollEndInScrollEndEventShim(this);
    }
  }

  #onScrollEndEvent(_evt: Event): void {
    this.#scrollEndEventPresent = true;
    if (this._delegate) {
      this._delegate.onScrollEndInScrollEndEventShim(this);
    }
  }
}

export default ScrollEndEventShim;

