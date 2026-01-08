import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { PFlowChartTerminal } from './PFlowChartTerminal.js';
import { PFlowChartProgress } from './PFlowChartProgress.js';

interface PanelBbox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export class PProjectFlowChart extends Panel {
  protected _pDict: Map<string, PanelWrapper | PFlowChartTerminal | PFlowChartProgress>;
  protected _nextChildPanelId: number = 0;

  constructor() {
    super();
    this._elementType = "svg";
    this._namespace = "http://www.w3.org/2000/svg";
    this._pDict = new Map();
    this._nextChildPanelId = 0;
  }

  getPanel(id: string): PanelWrapper | PFlowChartTerminal | PFlowChartProgress | undefined { 
    return this._pDict.get(id); 
  }

  setSize(w: number, h: number): void {
    this.setAttribute("viewBox", "0 0 " + w + " " + h);
    this.setWidth(w, "px");
  }

  addTerminalPanel(x: number, y: number, w: number, h: number): PFlowChartTerminal {
    let p = new PFlowChartTerminal();
    p.setAttribute("x", x.toString());
    p.setAttribute("y", y.toString());
    p.setAttribute("width", w.toString());
    p.setAttribute("height", h.toString());
    this.#pushPanel(p);
    return p;
  }

  addProcessPanel(x: number, y: number, w: number, h: number): PFlowChartProgress {
    let p = new PFlowChartProgress();
    p.setAttribute("x", x.toString());
    p.setAttribute("y", y.toString());
    p.setAttribute("width", w.toString());
    p.setAttribute("height", h.toString());
    this.#pushPanel(p);
    return p;
  }

  connectPanel(fromId: string, toId: string, isHorizontal: boolean): void {
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

    let p = new PanelWrapper();
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

  #getPanelBbox(panel: PanelWrapper | PFlowChartTerminal | PFlowChartProgress): PanelBbox | null {
    let bbox: PanelBbox = {
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

  #pushPanel(panel: PanelWrapper | PFlowChartTerminal | PFlowChartProgress): void {
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
}
