(function(wksp) {
wksp.CF_PROJECT_FLOW_CHART = {
  ONCLICK_AT_BEGIN : Symbol(),
  ONCLICK_AT_END : Symbol(),
};

class FProjectFlowChart extends ui.Fragment {
  constructor() {
    super();
    this._fItems = new ui.FFragmentList();
    this.setChild("items", this._fItems);

    this._lc = new ui.LContext();
    this._lc.setDelegate(this);

    this._selectedStageId = null;
    this._ID_START = "start";
  }

  onClickInProjectStageFragment(fStage) {
    this._delegate.onFlowChartFragmentRequestShowStage(this, fStage.getStage());
  }

  onOptionClickedInContextLayer(lContext, value) {
    switch (value) {
    case dat.ProjectStage.ACTIONS.PREPEND.type:
      this.#onPrependBeforeEnd();
      break;
    case dat.ProjectStage.ACTIONS.APPEND.type:
      this.#onAppendAfterBegin();
      break;
    default:
      break;
    }
  }

  action(type, ...args) {
    switch (type) {
    case wksp.CF_PROJECT_FLOW_CHART.ONCLICK_AT_BEGIN:
      this.#onClickAtBegin();
      break;
    case wksp.CF_PROJECT_FLOW_CHART.ONCLICK_AT_END:
      this.#onClickAtEnd();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    // Hack to make fItems as event source, may need better design
    this._fItems.attachRender(render);

    let pMain = new ui.ListPanel();
    render.wrapPanel(pMain);

    let p, pp;
    p = new ui.PanelWrapper();
    p.setClassName("x-scroll center-align");
    pMain.pushPanel(p);

    let st = {x : 50, y : 50};  // Terminal size
    let se = {x : 100, y : 50}; // Process size
    let sp = {x : 20, y : 30};  // Spaces

    let stageLists = [];
    let project = this._dataSource.getProjectForFlowChartFragment(this);
    if (project) {
      stageLists = project.getLayeredStageLists();
    }

    let nx = stageLists.reduce((a, c) => Math.max(a, c.length), 0);
    let ny = stageLists.length;

    let isHorizontal = false;
    if (nx * (se.x + sp.x) > ny * (se.y + sp.y)) {
      // Flip x & y, prefer scroll in y direction
      let temp = nx;
      nx = ny;
      ny = temp;
      isHorizontal = true;
    }

    let sf = {x : nx * (se.x + sp.x), y : ny * (se.y + sp.y)}; // Chart size
    let sc = {x : sf.x, y : sf.y};                             // Canvas size
    // Add start and end terminal in Canvas
    if (isHorizontal) {
      sc.x += (st.x + sp.x) * 2;
    } else {
      sc.y += (st.y + sp.y) * 2;
    }
    sc.x = Math.max(400, sc.x);

    let pFlow = new wksp.PProjectFlowChart();
    p.wrapPanel(pFlow);
    pFlow.setSize(sc.x, sc.y);

    let x, y;
    let x0 = (sc.x - sf.x + sp.x) / 2;
    let y0 = (sc.y - sf.y + sp.y) / 2;
    let panelIdMap = new Map();
    let connectedIds, panelId;

    // Start terminal
    if (isHorizontal) {
      x = x0 - st.x - sp.x;
      y = (sc.y - st.y) / 2;
    } else {
      x = (sc.x - st.x) / 2;
      y = y0 - st.y - sp.y;
    }
    p = pFlow.addTerminalPanel(x, y, st.x, st.y);
    panelIdMap.set(this._ID_START, p.getId());
    pp = new ui.Panel();
    p.wrapPanel(pp);
    p.setThemeClassName(this.#getBeginTerminalClassName());
    p.setMainElementAttribute(
        "onclick", "G.action(wksp.CF_PROJECT_FLOW_CHART.ONCLICK_AT_BEGIN)");
    pp.setClassName("small-info-text");
    pp.replaceContent("Start");

    // Stages
    this._fItems.clear();
    for (let [i, stages] of stageLists.entries()) {
      for (let [j, stage] of stages.entries()) {
        let f = new wksp.FProjectStage();
        f.setStage(stage);
        f.setLayoutType(wksp.FProjectStage.LTC_MID);
        f.setDelegate(this);
        this._fItems.append(f);
        if (isHorizontal) {
          x = x0 + i * (se.x + sp.x);
          y = y0 + j * (se.y + sp.y);
        } else {
          x = x0 + j * (se.x + sp.x);
          y = y0 + i * (se.y + sp.y);
        }
        p = pFlow.addProcessPanel(x, y, se.x, se.y);
        panelId = p.getId();
        panelIdMap.set(stage.getId(), panelId);
        pp = new ui.PanelWrapper();
        p.wrapPanel(pp);
        p.setThemeClassName(
            Utilities.getStateClassName(stage.getState(), stage.getStatus()));
        f.attachRender(pp);
        f.render();
        connectedIds = stage.getRequiredStageIds();
        if (!connectedIds.length) {
          connectedIds = [ this._ID_START ];
        }
        for (let id of connectedIds) {
          let cid = panelIdMap.get(id);
          if (cid) {
            pFlow.connectPanel(cid, panelId, isHorizontal);
          }
        }
      }
    }

    // End terminal
    if (isHorizontal) {
      x = x0 + sf.x;
      y = (sc.y - st.y) / 2;
    } else {
      x = (sc.x - st.x) / 2;
      y = y0 + sf.y;
    }
    p = pFlow.addTerminalPanel(x, y, st.x, st.y);
    panelId = p.getId();
    pp = new ui.Panel();
    p.wrapPanel(pp);
    p.setThemeClassName(this.#getEndTerminalClassName());
    p.setMainElementAttribute(
        "onclick", "G.action(wksp.CF_PROJECT_FLOW_CHART.ONCLICK_AT_END)");
    pp.setClassName("small-info-text");
    pp.replaceContent("End");

    if (project) {
      for (let stage of project.getLastStages()) {
        let cid = panelIdMap.get(stage.getId());
        if (cid) {
          pFlow.connectPanel(cid, panelId, isHorizontal);
        }
      }
    }
  }

  #getBeginTerminalClassName() {
    let project = this._dataSource.getProjectForFlowChartFragment(this);
    if (project && project.getState() != C.STATE.NEW) {
      return Utilities.getStateClassName(C.STATE.FINISHED,
                                         C.STATE.STATUS.F_DONE);
    }
    return "";
  }

  #getEndTerminalClassName() {
    let project = this._dataSource.getProjectForFlowChartFragment(this);
    if (project && project.isFinished()) {
      return Utilities.getStateClassName(project.getState(),
                                         project.getStatus());
    }
    return "";
  }

  #onClickAtBegin() {
    let project = this._dataSource.getProjectForFlowChartFragment(this);
    if (project) {
      let actions =
          project.getActionsForUserInBeginTerminal(dba.Account.getId());
      if (actions.length) {
        this.#showContextMenu(R.get("begin terminal"), actions);
      }
    }
  }

  #onClickAtEnd() {
    let project = this._dataSource.getProjectForFlowChartFragment(this);
    if (project) {
      let actions = project.getActionsForUserInEndTerminal(dba.Account.getId());
      if (actions.length) {
        this.#showContextMenu(R.get("end terminal"), actions);
      }
    }
  }

  #showContextMenu(targetName, actions) {
    this._lc.setTargetName(targetName);
    this._lc.setDescription(null);
    this._lc.clearOptions();
    for (let a of actions) {
      this._lc.addOption(a.name, a.type);
    }
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_LAYER, this, this._lc,
                                "Context");
  }

  #onPrependBeforeEnd() {
    let project = this._dataSource.getProjectForFlowChartFragment(this);
    if (project) {
      let v = new ui.View();
      let f = new wksp.FvcCreateProjectStageChoice();
      f.setProjectId(project.getId());
      f.setBeforeStage("");
      v.setContentFragment(f);
      this._owner.onFragmentRequestShowView(this, v, "Add stage");
    }
  }

  #onAppendAfterBegin() {
    let project = this._dataSource.getProjectForFlowChartFragment(this);
    if (project) {
      let v = new ui.View();
      let f = new wksp.FvcCreateProjectStageChoice();
      f.setProjectId(project.getId());
      f.setAfterStage("");
      v.setContentFragment(f);
      this._owner.onFragmentRequestShowView(this, v, "Add stage");
    }
  }
};

wksp.FProjectFlowChart = FProjectFlowChart;
}(window.wksp = window.wksp || {}));
