export const CF_PROJECT_FLOW_CHART = {
  ONCLICK_AT_BEGIN : Symbol(),
  ONCLICK_AT_END : Symbol(),
} as const;

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FFragmentList } from '../../lib/ui/controllers/fragments/FFragmentList.js';
import { LContext } from '../../lib/ui/controllers/layers/LContext.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ProjectStage } from '../../common/datatypes/ProjectStage.js';
import { FvcCreateProjectStageChoice } from './FvcCreateProjectStageChoice.js';
import { PProjectFlowChart } from './PProjectFlowChart.js';
import { FProjectStage } from './FProjectStage.js';
import { Utilities } from '../../common/Utilities.js';
import { R } from '../../common/constants/R.js';
import { STATE } from '../../common/constants/Constants.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import type { Project } from '../../common/datatypes/Project.js';

interface FlowChartDataSource {
  getProjectForFlowChartFragment(f: FProjectFlowChart): Project | null;
}

interface FlowChartDelegate {
  onFlowChartFragmentRequestShowStage(f: FProjectFlowChart, stage: ProjectStage): void;
}

export class FProjectFlowChart extends Fragment {
  protected _fItems: FFragmentList;
  protected _lc: LContext;
  protected _selectedStageId: string | null = null;
  protected _ID_START: string = "start";
  protected _dataSource!: FlowChartDataSource;
  protected _delegate!: FlowChartDelegate;

  constructor() {
    super();
    this._fItems = new FFragmentList();
    this.setChild("items", this._fItems);

    this._lc = new LContext();
    this._lc.setDelegate(this);
  }

  onClickInProjectStageFragment(fStage: FProjectStage): void {
    this._delegate.onFlowChartFragmentRequestShowStage(this, fStage.getStage());
  }

  onOptionClickedInContextLayer(_lContext: LContext, value: unknown): void {
    let valueObj = value as { type: string };
    switch (valueObj.type) {
    case ProjectStage.ACTIONS.PREPEND.type:
      this.#onPrependBeforeEnd();
      break;
    case ProjectStage.ACTIONS.APPEND.type:
      this.#onAppendAfterBegin();
      break;
    default:
      break;
    }
  }

  action(type: string | symbol, ..._args: unknown[]): void {
    switch (type) {
    case CF_PROJECT_FLOW_CHART.ONCLICK_AT_BEGIN:
      this.#onClickAtBegin();
      break;
    case CF_PROJECT_FLOW_CHART.ONCLICK_AT_END:
      this.#onClickAtEnd();
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  _renderOnRender(render: Panel): void {
    // Hack to make fItems as event source, may need better design
    this._fItems.attachRender(render);

    let pMain = new ListPanel();
    render.wrapPanel(pMain);

    let p, pp;
    p = new PanelWrapper();
    p.setClassName("x-scroll center-align");
    pMain.pushPanel(p);

    let st = {x : 50, y : 50};  // Terminal size
    let se = {x : 100, y : 50}; // Process size
    let sp = {x : 20, y : 30};  // Spaces

    let stageLists: ProjectStage[][] = [];
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

    let pFlow = new PProjectFlowChart();
    p.wrapPanel(pFlow);
    pFlow.setSize(sc.x, sc.y);

    let x, y;
    let x0 = (sc.x - sf.x + sp.x) / 2;
    let y0 = (sc.y - sf.y + sp.y) / 2;
    let panelIdMap = new Map<string, string>();
    let connectedIds: string[], panelId: string;

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
    pp = new Panel();
    p.wrapPanel(pp);
    p.setThemeClassName(this.#getBeginTerminalClassName());
    p.setMainElementAttribute(
        "onclick", "G.action(CF_PROJECT_FLOW_CHART.ONCLICK_AT_BEGIN)");
    pp.setClassName("small-info-text");
    pp.replaceContent("Start");

    // Stages
    this._fItems.clear();
    for (let [i, stages] of stageLists.entries()) {
      for (let [j, stage] of stages.entries()) {
        let f = new FProjectStage();
        f.setStage(stage);
        f.setLayoutType(FProjectStage.LTC_MID);
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
        pp = new PanelWrapper();
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
    pp = new Panel();
    p.wrapPanel(pp);
    p.setThemeClassName(this.#getEndTerminalClassName());
    p.setMainElementAttribute(
        "onclick", "G.action(CF_PROJECT_FLOW_CHART.ONCLICK_AT_END)");
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

  #getBeginTerminalClassName(): string {
    let project = this._dataSource.getProjectForFlowChartFragment(this);
    if (project && project.getState() != STATE.NEW) {
      return Utilities.getStateClassName(STATE.FINISHED,
                                         STATE.STATUS.F_DONE);
    }
    return "";
  }

  #getEndTerminalClassName(): string {
    let project = this._dataSource.getProjectForFlowChartFragment(this);
    if (project && project.isFinished()) {
      return Utilities.getStateClassName(project.getState(),
                                         project.getStatus());
    }
    return "";
  }

  #onClickAtBegin(): void {
    let project = this._dataSource.getProjectForFlowChartFragment(this);
    if (project && window.dba?.Account) {
      let actions =
          project.getActionsForUserInBeginTerminal(window.dba.Account.getId());
      if (actions.length) {
        this.#showContextMenu(R.get("begin terminal"), actions);
      }
    }
  }

  #onClickAtEnd(): void {
    let project = this._dataSource.getProjectForFlowChartFragment(this);
    if (project && window.dba?.Account) {
      let actions = project.getActionsForUserInEndTerminal(window.dba.Account.getId());
      if (actions.length) {
        this.#showContextMenu(R.get("end terminal"), actions);
      }
    }
  }

  #showContextMenu(targetName: string, actions: Array<{ name: string; type: string }>): void {
    this._lc.setTargetName(targetName);
    this._lc.setDescription(null);
    this._lc.clearOptions();
    for (let a of actions) {
      this._lc.addOption(a.name, a.type);
    }
    Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this._lc,
                                "Context");
  }

  #onPrependBeforeEnd(): void {
    let project = this._dataSource.getProjectForFlowChartFragment(this);
    if (project) {
      let v = new View();
      let f = new FvcCreateProjectStageChoice();
      f.setProjectId(project.getId());
      f.setBeforeStage("");
      v.setContentFragment(f);
      this._owner.onFragmentRequestShowView(this, v, "Add stage");
    }
  }

  #onAppendAfterBegin(): void {
    let project = this._dataSource.getProjectForFlowChartFragment(this);
    if (project) {
      let v = new View();
      let f = new FvcCreateProjectStageChoice();
      f.setProjectId(project.getId());
      f.setAfterStage("");
      v.setContentFragment(f);
      this._owner.onFragmentRequestShowView(this, v, "Add stage");
    }
  }
}
