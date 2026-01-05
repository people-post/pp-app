import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { WebConfig } from '../dba/WebConfig.js';
import Render from '../../lib/ui/renders/Render.js';

export const CF_UPGRADE_CHOICES = {
  SELECT : Symbol(),
};

const _CFT_UPGRACE_CHOICES = {
  UNDER_DEV :
      `We are sorry, upgrade account feature is still under development...`,
};

interface Choice {
  name: string;
  blog: string;
  livestream: string;
  project: string;
  proposal: string;
  price: string;
}

export class FvcUpgradeChoices extends FScrollViewContent {
  #btnNext: Button;

  #choices: Choice[] = [
    {
      name : "Basic",
      blog: "14/week",
      livestream: "3/week",
      project: "7/week",
      proposal: "7/month",
      price: "Free"
    },
    {
      name : "Plus",
      blog: "30/week",
      livestream: "7/week",
      project: "15/week",
      proposal: "15/month",
      price: "$2.99/month"
    },
    {
      name : "Prime",
      blog: "100/week",
      livestream: "21/week",
      project: "50/week",
      proposal: "50/month",
      price: "$6.99/month"
    }
  ];

  _tier = 1;

  constructor() {
    super();
    this.#btnNext = new Button();
    this.#btnNext.setName("Continue");
    this.#btnNext.setDelegate(this);
    this.setChild("btnNext", this.#btnNext);
  }

  onSimpleButtonClicked(fBtn: Button): void {}

  action(type: symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_UPGRADE_CHOICES.SELECT:
      this.#onSelect(args[0] as number);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContentOnRender(render: Render): void {
    if (WebConfig.isDevSite()) {
      const pList = new ListPanel();
      render.wrapPanel(pList);
      let p = new ListPanel();
      p.setClassName("flex x-scroll x-scroll-snap");
      pList.pushPanel(p);
      for (const [i, c] of this.#choices.entries()) {
        const pp = new ListPanel();
        pp.setClassName("w90 flex-noshrink scroll-snap-center");
        pp.setAttribute("onclick",
                        "javascript:G.action(gui.CF_UPGRADE_CHOICES.SELECT, " +
                            i + ")");
        p.pushPanel(pp);
        this.#renderChoice(pp, c);
      }
      p = new PanelWrapper();
      pList.pushPanel(p);
      this.#btnNext.attachRender(p);
      this.#btnNext.render();
    } else {
      const s = _CFT_UPGRACE_CHOICES.UNDER_DEV;
      render.replaceContent(s);
    }
  }

  #renderChoice(listPanel: ListPanel, c: Choice): void {
    let p = new Panel();
    listPanel.pushPanel(p);
    p.replaceContent(c.name);
    p = new Panel();
    listPanel.pushPanel(p);
    p.replaceContent("Blog: " + c.blog);
    p = new Panel();
    listPanel.pushPanel(p);
    p.replaceContent("Livestream: " + c.livestream);
    p = new Panel();
    listPanel.pushPanel(p);
    p.replaceContent("Project: " + c.project);
    p = new Panel();
    listPanel.pushPanel(p);
    p.replaceContent("Proposal: " + c.proposal);
    p = new Panel();
    listPanel.pushPanel(p);
    p.replaceContent("Price: " + c.price);
  }

  #onSelect(idx: number): void {
    if (idx > 0 && idx < 4) {
      this._tier = idx;
      this.render();
    }
  }
}

