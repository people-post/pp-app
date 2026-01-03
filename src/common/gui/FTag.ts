import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { T_DATA } from '../plt/Events.js';
import { Groups } from '../dba/Groups.js';
import Render from '../../lib/ui/renders/Render.js';

export class FTag extends Fragment {
  #tagId: string | null = null;

  getTagId(): string | null {
    return this.#tagId;
  }

  setTagId(id: string | null): void {
    this.#tagId = id;
  }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    default:
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.GROUPS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Render): void {
    let g = Groups.getTag(this.#tagId);
    if (g) {
      render.replaceContent(g.getName() || "");
    } else {
      render.replaceContent("...");
    }
  }
}
