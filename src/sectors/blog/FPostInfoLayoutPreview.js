import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { Blog } from '../../common/dba/Blog.js';

export class FPostInfoLayoutPreview extends Fragment {
  constructor() {
    super();
    this._desciption = "";
    this._fInfo = null;

    this._fApply = new Button();
    this._fApply.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this._fApply.setDelegate(this);
    this.setChild("btn", this._fApply);
  }

  isPostSelectedInPostInfoFragment(fPostInfo, postId) { return false; }

  onSimpleButtonClicked(fButton) {
    this._delegate.onPostInfoPreviewFragmentRequestApplySize(
        this, this._fInfo.getSizeType());
  }

  setDescription(text) { this._desciption = text; }
  setInfoFragment(f) {
    f.setDataSource(this);
    f.setDelegate(this);
    // Hack
    f.setPostId(new SocialItemId("630c0f81939ca171b6a702df",
                                     SocialItem.TYPE.ARTICLE));
    this._fInfo = f;
    this.setChild("info", f);
  }

  _renderOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new Panel();
    pp.setClassName("small-info-text");
    p.pushPanel(pp);
    pp.replaceContent(this._desciption);
    if (!this._fInfo) {
      return;
    }

    if (this._fInfo.getSizeType() == Blog.getItemLayoutType()) {
      this._fApply.setName("Applied");
      this._fApply.disable();
    } else {
      this._fApply.setName("Apply");
      this._fApply.enable();
    }
    pp = new Panel();
    p.pushPanel(pp);
    this._fApply.attachRender(pp);
    this._fApply.render();

    pp = new SectionPanel("Exmaple layout");
    p.pushPanel(pp);
    pp = pp.getContentPanel();
    pp.setClassName("quote-element");
    this._fInfo.attachRender(pp);
    this._fInfo.render();
  }
};
