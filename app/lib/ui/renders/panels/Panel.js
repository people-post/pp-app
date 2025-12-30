import Render from '../Render.js';

export class Panel extends Render {
  constructor() {
    super();
    this._elementType = "DIV";
    this._namespace = null;
    this._className = null;
    this._attrMap = new Map();
    this._propMap = new Map();
    this._styleMap = new Map();
  }

  isAtScrollBottom() {
    let e = this.getDomElement();
    return e && e.scrollTop == e.scrollHeight;
  }

  containsElement(element) {
    let e = this.getDomElement();
    return e && e.contains(element);
  }

  getScrollX() {
    let e = this.getDomElement();
    if (e) {
      return {value : e.scrollLeft, total : e.scrollWidth};
    }
    return null;
  }

  getScrollY() {
    let e = this.getDomElement();
    if (e) {
      return {value : e.scrollTop, total : e.scrollHeight};
    }
    return null;
  }

  getClassName() {
    let e = this.getDomElement();
    return e ? e.className : "";
  }

  getAttribute(name) {
    let e = this.getDomElement();
    return e ? e.getAttribute(name) : null;
  }

  setElementType(t) { this._elementType = t; }
  setNamespace(ns) { this._namespace = ns; }

  setClassName(name) {
    this._className = name;
    let e = this.getDomElement();
    if (e) {
      e.className = name;
    }
  }

  setAttribute(name, value) {
    this._attrMap.set(name, value);
    let e = this.getDomElement();
    if (e) {
      e.setAttribute(name, value);
    }
  }

  setProperty(name, value) {
    this._propMap.set(name, value);
    let e = this.getDomElement();
    if (e) {
      e[name] = value;
    }
  }

  setStyle(name, value) {
    this._styleMap.set(name, value);
    let e = this.getDomElement();
    if (e) {
      e.style[name] = value;
    }
  }

  setLeft(v, unit) {
    let e = this.getDomElement();
    if (e) {
      e.style.left = v.toString() + unit;
    }
  }

  setTop(v, unit) {
    let e = this.getDomElement();
    if (e) {
      e.style.top = v.toString() + unit;
    }
  }

  setRight(v, unit) {
    let e = this.getDomElement();
    if (e) {
      e.style.right = v.toString() + unit;
    }
  }

  setBottom(v, unit) {
    let e = this.getDomElement();
    if (e) {
      e.style.bottom = v.toString() + unit;
    }
  }

  setWidth(width, unit) {
    let e = this.getDomElement();
    if (e) {
      e.style.width = width.toString() + unit;
    }
  }

  setHeight(height, unit) {
    let e = this.getDomElement();
    if (e) {
      e.style.height = height.toString() + unit;
    }
  }

  animate(keyFrames, options) {
    let e = this.getDomElement();
    return e ? e.animate(keyFrames, options) : null;
  }

  attach(elementId) {
    super.attach(elementId);
    let e = this.getDomElement();
    if (e) {
      this.#initElement(e);
    }
  }

  createElement(id) {
    let e = this._createElement();
    e.id = id;
    this.#initElement(e);
    return e;
  }

  scrollToTop(behavior = "instant") {
    let e = this.getDomElement();
    if (e) {
      e.scrollTo({top : 0, behavior : behavior});
    }
  }

  scrollTo(x, y, behavior = "instant") {
    let e = this.getDomElement();
    if (e) {
      e.scrollTo({top : y, left : x, behavior : behavior});
    }
  }

  scrollToBottom(behavior = "instant") {
    let e = this.getDomElement();
    if (e) {
      e.scrollTo({top : e.scrollHeight, behavior : behavior});
    }
  }

  _createElement() {
    if (this._namespace) {
      return document.createElementNS(this._namespace, this._elementType);
    }
    return document.createElement(this._elementType);
  }

  #initElement(e) {
    if (this._className) {
      e.setAttribute("class", this._className);
    }
    for (let [n, v] of this._attrMap.entries()) {
      e.setAttribute(n, v);
    }
    for (let [n, v] of this._propMap.entries()) {
      e[n] = v;
    }
    for (let [n, v] of this._styleMap.entries()) {
      e.style[n] = v;
    }
  }
}

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.Panel = Panel;
}
