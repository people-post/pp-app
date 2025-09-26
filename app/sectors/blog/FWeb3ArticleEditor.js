(function(blog) {
class FWeb3ArticleEditor extends ui.Fragment {
  #fTitle;
  #fContent;
  #fFiles;
  #fAttachment;
  #fSubmit;
  #baseArticle = null;

  constructor() {
    super();
    this.#fTitle = new ui.TextArea();
    this.#fTitle.setClassName("w100 h40px");
    this.#fTitle.setDelegate(this);
    this.setChild("title", this.#fTitle);

    this.#fContent = new ui.TextArea();
    this.#fContent.setClassName("w100 h200px");
    this.#fContent.setDelegate(this);
    this.setChild("content", this.#fContent);

    this.#fFiles = new ui.FMultiMediaFileUploader();
    this.#fFiles.setCacheIds([ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]);
    this.#fFiles.setDataSource(this);
    this.#fFiles.setDelegate(this);
    this.setChild("files", this.#fFiles);

    this.#fAttachment = new ui.FAttachmentFileUploader();
    this.#fAttachment.setDelegate(this);
    this.setChild("attachment", this.#fAttachment);

    this.#fSubmit = new ui.Button();
    this.#fSubmit.setName("Post");
    this.#fSubmit.setLayoutType(ui.Button.LAYOUT_TYPE.BAR);
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
    let panel = new blog.PWeb3ArticleEditor();
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
    let pp = new ui.Panel();
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
      if (dba.Account.hasPublished()) {
        this.#doSubmit();
      } else {
        this._confirmDangerousOperation(R.get("CONFIRM_FIRST_WEB3_POST"),
                                        () => this.#doSubmit());
      }
    }
  }

  #doSubmit() {
    this.#lockActionBtns();
    let data = this.#collectData();
    this.#asSubmit(data)
        .catch(e => this.#onError(e))
        .finally(() => this.#unlockActionBtns());
  }

  #collectData() {
    // TODO: Embeded into Article class.
    // Work needed:
    // 1. Make a clone of original article in setArticle()
    // 2. Add setters in Article class
    // 3. Add toLtsJsonData() function in Article class
    let data = {};
    data.id = this.#baseArticle.getId();
    data.title = this.#fTitle.getValue();
    data.content = this.#fContent.getValue();
    data.owner_id = dba.Account.getId();
    data.verion = "1.0";
    data.created_at = Date.now() / 1000;
    let jd = this.#fAttachment.getJsonData();
    if (jd) {
      data.attachments = [ {cid : jd.id, name : jd.name, type : jd.type} ];
    }
    return data;
  }

  #validate() { return this.#fAttachment.validate(); }

  async #asSubmit(data) {
    // 1. Upload data
    data.id = await dba.Account.asUploadJson(data);

    // 2. Post info
    let a = new dat.Article(data);
    let postInfo = {type : "ARTICLE", cid : a.getId()};

    // 3. Pin cids
    let pinCids = [ a.getId() ];
    let at = a.getAttachment();
    let atCid = at ? at.getCid() : null;
    if (atCid) {
      pinCids.push(atCid);
    }

    await dba.Account.asPublishPost(postInfo, pinCids);
    this._delegate.onNewArticlePostedInArticleEditorFragment(this);
  }

  #lockActionBtns() { this.#fSubmit.disable(); }

  #unlockActionBtns() { this.#fSubmit.enable(); }

  #onError(e) {
    console.log(e);
    this.onLocalErrorInFragment(this, R.get("EL_API_POST"));
  }
};

blog.FWeb3ArticleEditor = FWeb3ArticleEditor;
}(window.blog = window.blog || {}));
