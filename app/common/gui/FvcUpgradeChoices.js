(function(gui) {
gui.CF_UPGRADE_CHOICES = {
  SELECT : Symbol(),
};

const _CFT_UPGRACE_CHOICES = {
  UNDER_DEV :
      `We are sorry, upgrade account feature is still under development...`,
};

class FvcUpgradeChoices extends ui.FScrollViewContent {
  #btnNext;

  #choices = [
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

  constructor() {
    super();
    this._tier = 1;
    this.#btnNext = new ui.Button();
    this.#btnNext.setName("Continue");
    this.#btnNext.setDelegate(this);
    this.setChild("btnNext", this.#btnNext);
  }

  onSimpleButtonClicked(fBtn) {}

  action(type, ...args) {
    switch (type) {
    case gui.CF_UPGRADE_CHOICES.SELECT:
      this.#onSelect(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContentOnRender(render) {
    if (dba.WebConfig.isDevSite()) {
      let pList = new ui.ListPanel();
      render.wrapPanel(pList);
      let p = new ui.ListPanel();
      p.setClassName("flex x-scroll x-scroll-snap");
      pList.pushPanel(p);
      for (let [i, c] of this.#choices.entries()) {
        let pp = new ui.ListPanel();
        pp.setClassName("w90 flex-noshrink scroll-snap-center");
        pp.setAttribute("onclick",
                        "javascript:G.action(gui.CF_UPGRADE_CHOICES.SELECT, " +
                            i + ")");
        p.pushPanel(pp);
        this.#renderChoice(pp, c);
      }
      p = new ui.PanelWrapper();
      pList.pushPanel(p);
      this.#btnNext.attachRender(p);
      this.#btnNext.render();
    } else {
      let s = _CFT_UPGRACE_CHOICES.UNDER_DEV;
      render.replaceContent(s);
    }
  }

  #renderChoice(listPanel, c) {
    let p = new ui.Panel();
    listPanel.pushPanel(p);
    p.replaceContent(c.name);
    p = new ui.Panel();
    listPanel.pushPanel(p);
    p.replaceContent("Blog: " + c.blog);
    p = new ui.Panel();
    listPanel.pushPanel(p);
    p.replaceContent("Livestream: " + c.livestream);
    p = new ui.Panel();
    listPanel.pushPanel(p);
    p.replaceContent("Project: " + c.project);
    p = new ui.Panel();
    listPanel.pushPanel(p);
    p.replaceContent("Proposal: " + c.proposal);
    p = new ui.Panel();
    listPanel.pushPanel(p);
    p.replaceContent("Price: " + c.price);
  }

  #onSelect(idx) {
    if (idx > 0 && idx < 4) {
      this._tier = idx;
      this.render();
    }
  }
};

gui.FvcUpgradeChoices = FvcUpgradeChoices;
}(window.gui = window.gui || {}));
