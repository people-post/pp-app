import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { T_DATA } from '../../lib/framework/Events.js';

export class FTag extends Fragment {
  #tagId = null;

  getTagId() { return this.#tagId; }

  setTagId(id) { this.#tagId = id; }

  action(type, ...args) {
    switch (type) {
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.GROUPS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let g = dba.Groups.getTag(this.#tagId);
    if (g) {
      render.replaceContent(g.getName());
    } else {
      render.replaceContent("...");
    }
  }
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  window.gui.FTag = FTag;
}
