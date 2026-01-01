
/*
 * +---------+
 * |  TITLE  |
 * | ------- |
 * |  ICON   |
 * |         |
 * +---------+
 * |   NAME  |
 * +---------+
 */

const _CPT_PROJECT_ACTOR_INFO = {
  MAIN :
      `<div id="__ID_MAIN__" class="pad5px clickable project-actor-info bdsolid">
    <div id="__ID_TITLE__"></div>
    <div id="__ID_ICON__" class="center-align"></div>
    <div id="__ID_NAME__" class="small-info-text center-align ellipsis"></div>
  </div>`,
}
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PProjectActorInfo extends Panel {
  constructor() {
    super();
    this._pTitle = new Panel();
    this._pIcon = new Panel();
    this._pName = new Panel();
  }

  getNamePanel() { return this._pName; }
  getTitlePanel() { return this._pTitle; }
  getIconPanel() { return this._pIcon; }

  setThemeClassNames(names) {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      let s = "pad5px clickable project-actor-info bdsolid";
      for (let name of names) {
        s = s + " " + name;
      }
      e.className = s;
    }
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pTitle.attach(this._getSubElementId("T"));
    this._pName.attach(this._getSubElementId("N"));
    this._pIcon.attach(this._getSubElementId("I"));
  }

  _renderFramework() {
    let s = _CPT_PROJECT_ACTOR_INFO.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_ICON__", this._getSubElementId("I"));
    return s;
  }
};
