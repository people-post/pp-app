import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Utilities } from '../Utilities.js';

export const CF_SIMPLE_LIST = {
  ITEM_CLICK : Symbol(),
}

// Export to window for string template access
if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  (window.gui as { CF_SIMPLE_LIST: typeof CF_SIMPLE_LIST }).CF_SIMPLE_LIST = CF_SIMPLE_LIST;
}

const _CFT_SIMPLE_LIST = {
  ON_CLICK_ACTION :
      `javascript:G.action(gui.CF_SIMPLE_LIST.ITEM_CLICK, '__ITEM_ID__')`,
  ICON : `<span class="inline-block s-icon3 clickable">__ICON__</span>`,
}

interface ListItem {
  id: string;
  icon?: string;
  isSelectable?: boolean;
  [key: string]: unknown;
}

interface SimpleListDataSource {
  getListItemsForListFragment(f: FSimpleList): ListItem[];
  getSelectedItemIdForList(f: FSimpleList): string | null;
}

interface SimpleListDelegate {
  renderItemForSimpleListFragment(f: FSimpleList, item: ListItem, panel: Panel): void;
  onItemSelectedInList(f: FSimpleList, itemId: string): void;
}

export class FSimpleList extends Fragment {
  declare _dataSource: SimpleListDataSource;
  declare _delegate: SimpleListDelegate;

  action(type: symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_SIMPLE_LIST.ITEM_CLICK:
      this.#onItemClick(args[0] as string);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderOnRender(render: { wrapPanel: (p: ListPanel) => void }): void {
    let pMain = new ListPanel();
    render.wrapPanel(pMain);

    let items = this._dataSource.getListItemsForListFragment(this);
    let hasIconColumn = items.some(i => i.icon);

    for (let item of items) {
      let selected =
          (item.isSelectable &&
           item.id == this._dataSource.getSelectedItemIdForList(this));

      let pItem = new ListPanel();
      let classNames: string[] = [ "simple-list-item flex center-align-items" ];
      if (item.isSelectable) {
        classNames.push("clickable");
        if (selected) {
          classNames = classNames.concat([ "s-cfuncbg", "s-csecondary" ]);
        }
        pItem.setAttribute("onclick", _CFT_SIMPLE_LIST.ON_CLICK_ACTION.replace(
                                          "__ITEM_ID__", item.id));
      }
      pItem.setClassName(classNames.join(" "));
      pMain.pushPanel(pItem);

      if (hasIconColumn) {
        let p = new Panel();
        p.setClassName("right-pad5px");
        pItem.pushPanel(p);

        if (item.icon) {
          p.replaceContent(this.#renderIcon(item.icon, selected || false));
        }
      }

      let p = new Panel();
      p.setClassName("left-pad5px flex-grow");
      pItem.pushPanel(p);
      this._delegate.renderItemForSimpleListFragment(this, item, p);

      if (item.isSelectable) {
        // Last item
        let p = new Panel();
        p.setClassName("s-font005 right-align cgray");
        pItem.pushPanel(p);
        p.replaceContent("&rsaquo;");
      }
    }
  }

  #onItemClick(itemId: string): void {
    this._delegate.onItemSelectedInList(this, itemId);
    this.render();
  }

  #renderIcon(icon: string, inverse: boolean): string {
    let s = _CFT_SIMPLE_LIST.ICON;
    s = s.replace("__ICON__", Utilities.renderSvgFuncIcon(icon, inverse));
    return s;
  }
}
