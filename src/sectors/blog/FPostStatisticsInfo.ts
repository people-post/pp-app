export const CF_POST_STATISTICS_INFO = {
  ONCLICK : "CF_POST_STATISTICS_INFO_1",
} as const;

// Export to window for HTML string templates
declare global {
  interface Window {
    CF_POST_STATISTICS_INFO?: typeof CF_POST_STATISTICS_INFO;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_POST_STATISTICS_INFO = CF_POST_STATISTICS_INFO;
}

const _CFT_POST_STATISTICS_INFO = {
  MAIN : `<div class="underline ellipsis">__NAME__</div>
    <div class="small-info-text no-wrap">__COUNT__</div>`,
} as const;

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Utilities as blogUtilities } from './Utilities.js';

interface PostStatisticsData {
  uuid: string;
  title: string;
  count: number;
}

interface PostStatisticsDelegate {
  onClickInFPostStatisticsInfo(f: FPostStatisticsInfo, data: PostStatisticsData): void;
}

export class FPostStatisticsInfo extends Fragment {
  protected _data: PostStatisticsData | null = null;
  protected _delegate!: PostStatisticsDelegate;

  constructor() {
    super();
  }

  setData(d: PostStatisticsData): void { this._data = d; }

  action(type: string | symbol, ..._args: unknown[]): void {
    switch (type) {
    case CF_POST_STATISTICS_INFO.ONCLICK:
      this.#onClick();
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  _renderOnRender(render: Panel): void {
    let p = new Panel();
    p.setClassName("pad5px flex space-between baseline-align-items clickable");
    p.setAttribute("onclick",
                   "javascript:G.action(CF_POST_STATISTICS_INFO.ONCLICK)");

    render.wrapPanel(p);

    p.replaceContent(this.#renderData(this._data));
  }

  #renderData(data: PostStatisticsData | null): string {
    if (!data) {
      return "";
    }
    let s = _CFT_POST_STATISTICS_INFO.MAIN;
    let name = data.title;
    if (name && name.length) {
      name = blogUtilities.stripSimpleTag(name, "p");
    } else {
      name = "[empty]";
    }
    s = s.replace("__NAME__", name);
    s = s.replace("__COUNT__", String(data.count));
    return s;
  }

  #onClick(): void {
    if (this._data) {
      this._delegate.onClickInFPostStatisticsInfo(this, this._data);
    }
  }
}
