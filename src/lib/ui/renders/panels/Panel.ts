import Render from '../Render.js';

interface ScrollInfo {
  value: number;
  total: number;
}

export class Panel extends Render {
  declare _elementType: string;
  declare _namespace: string | null;
  declare _className: string | null;
  declare _attrMap: Map<string, string>;
  declare _propMap: Map<string, unknown>;
  declare _styleMap: Map<string, string>;

  constructor() {
    super();
    this._elementType = "DIV";
    this._namespace = null;
    this._className = null;
    this._attrMap = new Map();
    this._propMap = new Map();
    this._styleMap = new Map();
  }

  isAtScrollBottom(): boolean {
    let e = this.getDomElement();
    return e ? e.scrollTop == e.scrollHeight : false;
  }

  containsElement(element: Element): boolean {
    let e = this.getDomElement();
    return e ? e.contains(element) : false;
  }

  getScrollX(): ScrollInfo | null {
    let e = this.getDomElement();
    if (e) {
      return {value : e.scrollLeft, total : e.scrollWidth};
    }
    return null;
  }

  getScrollY(): ScrollInfo | null {
    let e = this.getDomElement();
    if (e) {
      return {value : e.scrollTop, total : e.scrollHeight};
    }
    return null;
  }

  getClassName(): string {
    let e = this.getDomElement();
    return e ? e.className : "";
  }

  getAttribute(name: string): string | null {
    let e = this.getDomElement();
    return e ? e.getAttribute(name) : null;
  }

  setElementType(t: string): void { this._elementType = t; }
  setNamespace(ns: string | null): void { this._namespace = ns; }

  setClassName(name: string | null): void {
    this._className = name;
    let e = this.getDomElement();
    if (e) {
      e.className = name || "";
    }
  }

  setAttribute(name: string, value: string): void {
    this._attrMap.set(name, value);
    let e = this.getDomElement();
    if (e) {
      e.setAttribute(name, value);
    }
  }

  setProperty(name: string, value: unknown): void {
    this._propMap.set(name, value);
    let e = this.getDomElement();
    if (e) {
      (e as any)[name] = value;
    }
  }

  setStyle(name: string, value: string): void {
    this._styleMap.set(name, value);
    let e = this.getDomElement();
    if (e) {
      (e.style as any)[name] = value;
    }
  }

  setLeft(v: number, unit: string): void {
    let e = this.getDomElement();
    if (e) {
      e.style.left = v.toString() + unit;
    }
  }

  setTop(v: number, unit: string): void {
    let e = this.getDomElement();
    if (e) {
      e.style.top = v.toString() + unit;
    }
  }

  setRight(v: number, unit: string): void {
    let e = this.getDomElement();
    if (e) {
      e.style.right = v.toString() + unit;
    }
  }

  setBottom(v: number, unit: string): void {
    let e = this.getDomElement();
    if (e) {
      e.style.bottom = v.toString() + unit;
    }
  }

  setWidth(width: number, unit: string): void {
    let e = this.getDomElement();
    if (e) {
      e.style.width = width.toString() + unit;
    }
  }

  setHeight(height: number, unit: string): void {
    let e = this.getDomElement();
    if (e) {
      e.style.height = height.toString() + unit;
    }
  }

  animate(keyFrames: Keyframe[] | PropertyIndexedKeyframes, options?: KeyframeAnimationOptions): Animation | null {
    let e = this.getDomElement();
    return e ? e.animate(keyFrames, options) : null;
  }

  attach(elementId: string): void {
    super.attach(elementId);
    let e = this.getDomElement();
    if (e) {
      this.#initElement(e);
    }
  }

  createElement(id: string): HTMLElement {
    let e = this._createElement();
    e.id = id;
    this.#initElement(e);
    return e;
  }

  scrollToTop(behavior: ScrollBehavior = "instant"): void {
    let e = this.getDomElement();
    if (e) {
      e.scrollTo({top : 0, behavior : behavior});
    }
  }

  scrollTo(x: number, y: number, behavior: ScrollBehavior = "instant"): void {
    let e = this.getDomElement();
    if (e) {
      e.scrollTo({top : y, left : x, behavior : behavior});
    }
  }

  scrollToBottom(behavior: ScrollBehavior = "instant"): void {
    let e = this.getDomElement();
    if (e) {
      e.scrollTo({top : e.scrollHeight, behavior : behavior});
    }
  }

  _createElement(): HTMLElement {
    if (this._namespace) {
      return document.createElementNS(this._namespace, this._elementType) as HTMLElement;
    }
    return document.createElement(this._elementType);
  }

  #initElement(e: HTMLElement): void {
    if (this._className) {
      e.setAttribute("class", this._className);
    }
    for (let [n, v] of this._attrMap.entries()) {
      e.setAttribute(n, v);
    }
    for (let [n, v] of this._propMap.entries()) {
      (e as any)[n] = v;
    }
    for (let [n, v] of this._styleMap.entries()) {
      (e.style as any)[n] = v;
    }
  }
}

