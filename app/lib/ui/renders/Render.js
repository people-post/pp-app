import Utilities from '../../ext/Utilities.js';

(function(ui) {
class Render {
  constructor() { this._elementId = null; }

  isInViewPort() {
    return Utilities.isElementInViewport(this.getDomElement());
  }

  isCenterPointInViewPort() {
    return Utilities.isElementCenterPointInViewport(this.getDomElement());
  }

  isEventSource(evt) {
    if (evt) {
      let e = this.getDomElement();
      return e && e.contains(event.srcElement);
    }
    // console.log(this.constructor.name + " not evt source");
    return false;
  }

  isVisible() {
    let e = this.getDomElement();
    return e && !e.hidden;
  }

  getId() { return this._elementId; }
  getDomElement() { return document.getElementById(this._elementId); }

  getLeft() {
    let e = this.getDomElement();
    return e ? e.offsetLeft : 0;
  }

  getTop() {
    let e = this.getDomElement();
    return e ? e.offsetTop : 0;
  }

  getWidth() {
    let e = this.getDomElement();
    return e ? e.offsetWidth : 0;
  }

  getHeight() {
    let e = this.getDomElement();
    return e ? e.offsetHeight : 0;
  }

  getVisibleWidthInParent() {
    return Utilities.getVisibleWidthInParent(this.getDomElement());
  }

  getViewportOverflow() {
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

  attach(toElementId) {
    this._elementId = toElementId;
    this.#layoutFramework();
  }

  replaceContent(content) {
    let e = this.getDomElement();
    if (e) {
      e.innerHTML = content;
      return true;
    }
    return false;
  }

  clear() { this.#layoutFramework(); }

  setFocus() {
    // Note, many of the non-input elements don't take focus.
    // Need to set tabindex=0 before being able to assign focus
    let e = this.getDomElement();
    if (e) {
      e.focus();
    }
  }

  setVisible(b) {
    let e = this.getDomElement();
    if (e) {
      e.hidden = !b;
    }
  }

  setDisplay(display) {
    let e = this.getDomElement();
    if (e) {
      e.style.display = display;
    }
  }

  _getSubElementId(suffix) { return this._elementId + "_" + suffix; }
  _renderFramework() { return ""; }
  _onFrameworkDidAppear() {}

  #layoutFramework() {
    if (this.replaceContent(this._renderFramework())) {
      this._onFrameworkDidAppear();
    }
  }
}

ui.Render = Render;
}(window.ui = window.ui || {}));
