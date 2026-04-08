import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { R } from '../../common/constants/R.js';

const CF_HOSTING_STATUS = {
  NS_HOW_TO : "CFM_HOSTING_STATUS_1",
  SHOW_TIP : "CFM_HOSTING_STATUS_2",
} as const;

const _CFT_HOSTING_STATUS = {
  MAIN : `<p class="title">__R_DOMAIN__:</p>
      <div class="tw:text-center">__DOMAIN_NAME__</div>

      <p class="title">__NS__(<a class="knowledge-tip" href="javascript:void(0)" data-pp-action="CFM_HOSTING_STATUS_1">__R_HOW_TO__</a>):</p>
      <div class="tw:text-center">__NS_RECORD__</div>`,

  NS_RECORD : `<p>ns1.gcabin.com</p>
    <p>ns2.gcabin.com</p>
    <p>ns3.gcabin.com</p>
    <p>ns4.gcabin.com</p>`,
}

interface FHostingStatusDelegate {
  onNsHowtoClicked(): void;
  onRequestRemoveDomain(): void;
}

export class FHostingStatus extends Fragment {
  protected _domainName: string | null = null;
  protected _fBtn: Button;

  constructor() {
    super();
    this._domainName = null;
    this._fBtn = new Button();
    this._fBtn.setName(R.t("Unregister") + "...");
    this._fBtn.setThemeType(Button.T_THEME.DANGER);
    this._fBtn.setDelegate(this);
    this.setChild("btn", this._fBtn);
  }

  setDomainName(name: string | null): void { this._domainName = name; }

  onSimpleButtonClicked(_fBtn: Button): void { this.#onRemoveClicked(); }

  action(type: string, ...args: any[]): void {
    switch (type) {
    case CF_HOSTING_STATUS.NS_HOW_TO:
      this.getDelegate<FHostingStatusDelegate>()?.onNsHowtoClicked();
      break;
    case CF_HOSTING_STATUS.SHOW_TIP:
      this._displayMessage(args[0]);
      break;
    default:
      break;
    }
  }

  _renderOnRender(render: any): void {
    let p = new ListPanel();
    render.wrapPanel(p);

    let pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderMain());

    p.pushSpace(1);

    pp = new Panel();
    p.pushPanel(pp);
    this._fBtn.attachRender(pp);
    this._fBtn.render();
  }

  #renderMain(): string {
    let s = _CFT_HOSTING_STATUS.MAIN;
    s = s.replace("__R_DOMAIN__", R.t("Domain"));
    s = s.replace("__DOMAIN_NAME__", this._domainName || "");
    s = s.replace("__NS__",
                  this._renderTipLink(CF_HOSTING_STATUS.SHOW_TIP,
                                      R.t("Name server"), "TIP_NAME_SERVER"));
    s = s.replace("__NS_RECORD__", this.#renderNsRecord());
    s = s.replace("__R_HOW_TO__", R.t("How to"));
    return s;
  }

  #renderNsRecord(): string { return _CFT_HOSTING_STATUS.NS_RECORD; }

  #onRemoveClicked(): void {
    this._confirmDangerousOperation(R.get("CONFIRM_UNREGISTER"),
                                    () =>
                                        this.getDelegate<FHostingStatusDelegate>()?.onRequestRemoveDomain());
  }
}
