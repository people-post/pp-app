import Utilities from '../../ext/Utilities.js';

interface ViewportOverflow {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export default class Render {
  declare _elementId: string | null;

  constructor() { this._elementId = null; }

  isInViewPort(): boolean {
    return Utilities.isElementInViewport(this.getDomElement());
  }

  isCenterPointInViewPort(): boolean {
    return Utilities.isElementCenterPointInViewport(this.getDomElement());
  }

  isEventSource(evt: Event | null): boolean {
    if (evt) {
      let e = this.getDomElement();
      return e ? e.contains((evt as any).srcElement) : false;
    }
    // console.log(this.constructor.name + " not evt source");
    return false;
  }

  isVisible(): boolean {
    let e = this.getDomElement();
    return e ? !e.hidden : false;
  }

  getId(): string | null { return this._elementId; }
  getDomElement(): HTMLElement | null { return this._elementId ? document.getElementById(this._elementId) : null; }

  getLeft(): number {
    let e = this.getDomElement();
    return e ? e.offsetLeft : 0;
  }

  getTop(): number {
    let e = this.getDomElement();
    return e ? e.offsetTop : 0;
  }

  getWidth(): number {
    let e = this.getDomElement();
    return e ? e.offsetWidth : 0;
  }

  getHeight(): number {
    let e = this.getDomElement();
    return e ? e.offsetHeight : 0;
  }

  getVisibleWidthInParent(): number {
    return Utilities.getVisibleWidthInParent(this.getDomElement());
  }

  getViewportOverflow(): ViewportOverflow | null {
    // Return rect, negative values means overflow
    let e = this.getDomElement();
    if (!e) {
      return null;
    }
    let r = e.getBoundingClientRect();
    let h = window.innerHeight || document.documentElement.clientHeight;
    let w = window.innerWidth || document.documentElement.clientWidth;
    return {
      "top" : r.top,
      "left" : r.left,
      "bottom" : h - r.bottom,
      "right" : w - r.right
    };
  }

  attach(toElementId: string): void {
    this._elementId = toElementId;
    this.#layoutFramework();
  }

  replaceContent(content: string): boolean {
    let e = this.getDomElement();
    if (e) {
      e.innerHTML = content;
      return true;
    }
    return false;
  }

  clear(): void { this.#layoutFramework(); }

  setFocus(): void {
    // Note, many of the non-input elements don't take focus.
    // Need to set tabindex=0 before being able to assign focus
    let e = this.getDomElement();
    if (e) {
      e.focus();
    }
  }

  setVisible(b: boolean): void {
    let e = this.getDomElement();
    if (e) {
      e.hidden = !b;
    }
  }

  setDisplay(display: string): void {
    let e = this.getDomElement();
    if (e) {
      e.style.display = display;
    }
  }

  _getSubElementId(suffix: string): string { return (this._elementId || "") + "_" + suffix; }
  _renderFramework(): string { return ""; }
  _onFrameworkDidAppear(): void {}

  #layoutFramework(): void {
    if (this.replaceContent(this._renderFramework())) {
      this._onFrameworkDidAppear();
    }
  }
}

