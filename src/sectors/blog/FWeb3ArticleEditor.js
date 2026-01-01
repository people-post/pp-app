import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { TextArea } from '../../lib/ui/controllers/fragments/TextArea.js';
import { FMultiMediaFileUploader } from '../../lib/ui/controllers/fragments/FMultiMediaFileUploader.js';
import { FAttachmentFileUploader } from '../../lib/ui/controllers/fragments/FAttachmentFileUploader.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PWeb3ArticleEditor } from './PWeb3ArticleEditor.js';
import { Account } from '../../common/dba/Account.js';
import { R } from '../../common/constants/R.js';
import { dat } from 'pp-api';

const { OArticle, OAttachmentMeta } = dat;

export class FWeb3ArticleEditor extends Fragment {
  #fTitle;
  #fContent;
  #fFiles;
  #fAttachment;
  #fSubmit;
  #baseArticle = null;

  constructor() {
    super();
    this.#fTitle = new TextArea();
    this.#fTitle.setClassName("w100 h40px");
    this.#fTitle.setDelegate(this);
    this.setChild("title", this.#fTitle);

    this.#fContent = new TextArea();
    this.#fContent.setClassName("w100 h200px");
    this.#fContent.setDelegate(this);
    this.setChild("content", this.#fContent);

    this.#fFiles = new FMultiMediaFileUploader();
    this.#fFiles.setCacheIds([ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]);
    this.#fFiles.setDataSource(this);
    this.#fFiles.setDelegate(this);
    this.setChild("files", this.#fFiles);

    this.#fAttachment = new FAttachmentFileUploader();
    this.#fAttachment.setDelegate(this);
    this.setChild("attachment", this.#fAttachment);

    this.#fSubmit = new Button();
    this.#fSubmit.setName("Post");
    this.#fSubmit.setLayoutType(Button.LAYOUT_TYPE.BAR);
    this.#fSubmit.setDelegate(this);
    this.setChild("btnSubmit", this.#fSubmit);
  }

  onMultiMediaFileUploadWillBegin(fMultiMedia) { this.#lockActionBtns(); }
  onMultiMediaFileUploadFinished(fMultiMedia) {
    if (!this.#isUploadBusy()) {
      this.#unlockActionBtns();
    }
  }
  onAttachmentFileUploadWillBegin(fAttachment) { this.#lockActionBtns(); }
  onAttachmentFileUploadFinished(fAttachment) {
    // if (!this.#isFileUploadBusy()) {
    this.#unlockActionBtns();
    //}
  }

  onSimpleButtonClicked(fButton) {
    if (fButton == this.#fSubmit) {
      this.#onSubmit();
    }
  }
  onInputChangeInTextArea(fTextArea, text) {}

  setArticle(baseArticle) { this.#baseArticle = baseArticle; }

  _renderOnRender(render) {
    let panel = new PWeb3ArticleEditor();
    render.wrapPanel(panel);
    let p = panel.getTitlePanel();
    this.#fTitle.setConfig({
      title : "Title",
      value : this.#baseArticle.getTitle(),
      hint : "",
      isRequred : false
    });
    this.#fTitle.attachRender(p);
    this.#fTitle.render();

    p = panel.getFilesPanel();
    this.#fFiles.setToHrefFiles(this.#baseArticle.getFiles());
    this.#fFiles.attachRender(p);
    this.#fFiles.render();

    p = panel.getAttachmentPanel();
    this.#fAttachment.resetToUrlFile(this.#baseArticle.getAttachment());
    this.#fAttachment.attachRender(p);
    this.#fAttachment.render();

    p = panel.getContentPanel();
    this.#fContent.setConfig(
        {title : "Detail", value : this.#baseArticle.getContent(), hint : ""});
    this.#fContent.attachRender(p);
    this.#fContent.render();

    p = panel.getBtnListPanel();
    let pp = new Panel();
    p.pushPanel(pp);
    this.#fSubmit.attachRender(pp);
    this.#fSubmit.render();
  }

  #isUploadBusy() {
    return this.#fFiles.isBusy() || this.#fAttachment.isBusy();
  }

  #onSubmit() {
    if (this.#isUploadBusy()) {
      this._owner.onLocalErrorInFragment(this, R.get("EL_FILE_UPLOAD_BUSY"));
    } else if (this.#validate()) {
      if (Account.hasPublished()) {
        this.#doSubmit();
      } else {
        this._confirmDangerousOperation(R.get("CONFIRM_FIRST_WEB3_POST"),
                                        () => this.#doSubmit());
      }
    }
  }

  #doSubmit() {
    this.#lockActionBtns();
    let oArticle = this.#collectData();
    this.#asSubmit(oArticle)
        .catch(e => this.#onError(e))
        .finally(() => this.#unlockActionBtns());
  }

  #collectData() {
    let oArticle = new OArticle();
    oArticle.setId(this.#baseArticle.getId());
    oArticle.setTitle(this.#fTitle.getValue());
    oArticle.setContent(this.#fContent.getValue());
    oArticle.setOwnerId(Account.getId());
    let jd = this.#fAttachment.getJsonData();
    if (jd) {
      let oMeta = new OAttachmentMeta();
      oMeta.setCid(jd.id);
      oMeta.setName(jd.name);
      oMeta.setType(jd.type);
      oArticle.setAttachments([ oMeta ]);
    }
    oArticle.markCreation();
    return oArticle;
  }

  #validate() { return this.#fAttachment.validate(); }

  async #asSubmit(oArticle) {
    await Account.asPublishArticle(oArticle);
    this._delegate.onNewArticlePostedInArticleEditorFragment(this);
  }

  #lockActionBtns() { this.#fSubmit.disable(); }

  #unlockActionBtns() { this.#fSubmit.enable(); }

  #onError(e) {
    console.error(e);
    this.onLocalErrorInFragment(this, R.get("EL_API_POST"));
  }
};
