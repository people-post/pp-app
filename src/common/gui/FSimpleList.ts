import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { UiUtilities } from '../../lib/ui/Utilities.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export const CF_SIMPLE_LIST = {
  ITEM_CLICK : "CF_SIMPLE_LIST_1",
}

const _CFT_SIMPLE_LIST = {
  ON_CLICK_ACTION :
      `javascript:G.action('${CF_SIMPLE_LIST.ITEM_CLICK}', '__ITEM_ID__')`,
  ICON : `<span class="tw:inline-block tw:w-s-icon3 tw:h-s-icon3 tw:cursor-pointer">__ICON__</span>`,
}

export interface SimpleListItemBase {
  id: string;
  icon?: string;
  isSelectable?: boolean;
}

export interface SimpleListRules<TItem> {
  getId: (item: TItem) => string;
  getIcon?: (item: TItem) => string | null | undefined;
  isSelectable?: (item: TItem) => boolean;
}

const _DEFAULT_SIMPLE_LIST_RULES = {
  getId: (item: any) => item.id as string,
  getIcon: (item: any) => item.icon as string | undefined,
  isSelectable: (item: any) => !!item.isSelectable,
} satisfies SimpleListRules<any>;

export interface SimpleListDataSource<TItem> {
  getListItemsForListFragment(f: FSimpleList<TItem>): TItem[];
  getSelectedItemIdForList(f: FSimpleList<TItem>): string | null;
}

export interface SimpleListDelegate<TItem> {
  renderItemForSimpleListFragment(f: FSimpleList<TItem>, item: TItem, panel: Panel): void;
  onItemSelectedInList(f: FSimpleList<TItem>, itemId: string): void;
}

export class FSimpleList<TItem = SimpleListItemBase> extends Fragment {
  #rules: SimpleListRules<TItem> = _DEFAULT_SIMPLE_LIST_RULES as SimpleListRules<TItem>;

  setRules(rules: SimpleListRules<TItem>): void {
    this.#rules = rules;
    this.render();
  }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_SIMPLE_LIST.ITEM_CLICK:
      this.#onItemClick(args[0] as string);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderOnRender(render: PanelWrapper): void {
    const dataSource = this.getDataSource<SimpleListDataSource<TItem>>();
    if (!dataSource) {
      return;
    }

    let pMain = new ListPanel();
    render.wrapPanel(pMain);

    const rules = this.#rules;
    const items = dataSource.getListItemsForListFragment(this);
    const selectedItemId = dataSource.getSelectedItemIdForList(this);

    const hasIconColumn =
        typeof rules.getIcon === "function" &&
        items.some(i => !!rules.getIcon?.(i));

    for (let item of items) {
      const itemId = rules.getId(item);
      const selectable = rules.isSelectable ? rules.isSelectable(item) : false;
      const selected = selectable && itemId == selectedItemId;

      let pItem = new ListPanel();
      let classNames: string[] = [ "simple-list-item tw:flex tw:items-center" ];
      if (selectable) {
        classNames.push("tw:cursor-pointer");
        if (selected) {
          classNames = classNames.concat([ "s-cfuncbg", "s-csecondary" ]);
        }
        pItem.setAttribute("onclick", _CFT_SIMPLE_LIST.ON_CLICK_ACTION.replace(
                                          "__ITEM_ID__", itemId));
      }
      pItem.setClassName(classNames.join(" "));
      pMain.pushPanel(pItem);

      if (hasIconColumn) {
        const icon = rules.getIcon?.(item);
        let p = new Panel();
        p.setClassName("right-pad5px");
        pItem.pushPanel(p);

        if (icon) {
          p.replaceContent(this.#renderIcon(icon, selected || false));
        }
      }

      let p = new Panel();
      p.setClassName("tw:pl-[5px] tw:flex-grow");
      pItem.pushPanel(p);
      const delegate = this.getDelegate<SimpleListDelegate<TItem>>();
      delegate?.renderItemForSimpleListFragment(this, item, p);

      if (selectable) {
        // Last item
        let p = new Panel();
        p.setClassName("tw:text-s-font005 tw:text-right tw:text-gray-500");
        pItem.pushPanel(p);
        p.replaceContent("&rsaquo;");
      }
    }
  }

  #onItemClick(itemId: string): void {
    const delegate = this.getDelegate<SimpleListDelegate<TItem>>();
    delegate?.onItemSelectedInList(this, itemId);
    this.render();
  }

  #renderIcon(icon: string, inverse: boolean): string {
    let s = _CFT_SIMPLE_LIST.ICON;
    s = s.replace("__ICON__", UiUtilities.renderSvgFuncIcon(icon, inverse));
    return s;
  }
}
