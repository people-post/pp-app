
export class PProjectFlowChart extends ui.Panel {
  constructor() {
    super();
    this._elementType = "svg";
    this._namespace = "http://www.w3.org/2000/svg";
    this._pDict = new Map();
    this._nextChildPanelId = 0;
  }

  getPanel(id) { return this._pDict.get(id); }

  setSize(w, h) {
    this.setAttribute("viewBox", "0 0 " + w + " " + h);
    this.setWidth(w, "px");
  }

  addTerminalPanel(x, y, w, h) {
    let p = new wksp.PFlowChartTerminal();
    p.setAttribute("x", x.toString());
    p.setAttribute("y", y.toString());
    p.setAttribute("width", w.toString());
    p.setAttribute("height", h.toString());
    this.#pushPanel(p);
    return p;
  }

  addProcessPanel(x, y, w, h) {
    let p = new wksp.PFlowChartProgress();
    p.setAttribute("x", x.toString());
    p.setAttribute("y", y.toString());
    p.setAttribute("width", w.toString());
    p.setAttribute("height", h.toString());
    this.#pushPanel(p);
    return p;
  }

  connectPanel(fromId, toId, isHorizontal) {
    let pFrom = this._pDict.get(fromId);
    if (!pFrom) {
      return;
    }
    let pTo = this._pDict.get(toId);
    if (!pTo) {
      return;
    }

    let bboxFrom = this.#getPanelBbox(pFrom);
    let bboxTo = this.#getPanelBbox(pTo);
    if (!bboxFrom || !bboxTo) {
      return;
    }

    let p = new ui.PanelWrapper();
    p.setElementType("path");
    p.setClassName("flow-connection s-cprimestk");
    let xFrom = bboxFrom.x, yFrom = bboxFrom.y, xTo = bboxTo.x, yTo = bboxTo.y;
    if (isHorizontal) {
      if (bboxFrom.x < bboxTo.x) {
        xFrom += bboxFrom.w;
      } else {
        xTo += bboxTo.w;
      }
      yFrom += bboxFrom.h / 2;
      yTo += bboxTo.h / 2;
    } else {
      xFrom += bboxFrom.w / 2;
      xTo += bboxTo.w / 2;
      if (bboxFrom.y < bboxTo.y) {
        yFrom += bboxFrom.h;
      } else {
        yTo += bboxTo.h;
      }
    }
    let s = "M" + xFrom.toString() + " " + yFrom.toString();
    if (isHorizontal) {
      s += " h" + ((xTo - xFrom) / 2).toString();
      if (yFrom != yTo) {
        s += " v" + (yTo - yFrom).toString();
      }
      s += " h" + ((xTo - xFrom) / 2).toString();
    } else {
      s += " v" + ((yTo - yFrom) / 2).toString();
      if (xFrom != xTo) {
        s += " h" + (xTo - xFrom).toString();
      }
      s += " v" + ((yTo - yFrom) / 2).toString();
    }
    p.setAttribute("d", s);
    p.setNamespace("http://www.w3.org/2000/svg");
    this.#pushPanel(p);
  }

  #getPanelBbox(panel) {
    let bbox = {
      x : Number(panel.getAttribute("x")),
      y : Number(panel.getAttribute("y")),
      w : Number(panel.getAttribute("width")),
      h : Number(panel.getAttribute("height"))
    };
    if (isNaN(bbox.x) || isNaN(bbox.y) || isNaN(bbox.w) || isNaN(bbox.h)) {
      return null;
    }
    return bbox;
  }

  #pushPanel(panel) {
    let e = this.getDomElement();
    if (!e) {
      return;
    }

    let panelId = this._getSubElementId(this._nextChildPanelId.toString());
    let ee = panel.createElement(panelId);
    e.append(ee);
    this._pDict.set(panelId, panel);
    panel.attach(panelId);
    this._nextChildPanelId += 1;
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.PProjectFlowChart = PProjectFlowChart;
}
