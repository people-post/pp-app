
class FFeedArticle extends ui.Fragment {
  #fGallery;
  #fAttachment;
  #articleId = null;

  constructor() {
    super();
    this.#fGallery = new gui.FGallery();
    this.#fGallery.setDataSource(this);
    this.#fGallery.setDelegate(this);
    this.setChild("gallery", this.#fGallery);

    this.#fAttachment = new ui.FAttachmentFile();
    this.setChild("attachment", this.#fAttachment);
  }

  setArticleId(id) { this.#articleId = id; }

  _renderOnRender(postPanel) {
    let article = dba.Blog.getArticle(this.#articleId);
    if (!article) {
      return;
    }
    let p = postPanel.getTitlePanel();
    p.replaceContent(this.#renderTitle(article.getTitle()));

    p = postPanel.getTCreateDecorPanel();
    p.replaceContent("Created at");

    p = postPanel.getCreationDateTimePanel();
    p.replaceContent(ext.Utilities.timestampToDateTimeString(
        article.getCreationTime() / 1000));

    p = postPanel.getTUpdateDecorPanel();
    p.replaceContent("Updated at");

    p = postPanel.getUpdateDateTimePanel();
    p.replaceContent(ext.Utilities.timestampToDateTimeString(
        article.getUpdateTime() / 1000));

    p = postPanel.getContentPanel();
    p.replaceContent(Utilities.renderContent(article.getContent()));

    this.#renderSourceLink(postPanel.getSourceLinkPanel(), article);

    p = postPanel.getGalleryPanel();
    this.#fGallery.setFiles(article.getFiles());
    this.#fGallery.attachRender(p);
    this.#fGallery.render();
  }

  #onGoToSource(url) { window.open(url, '_blank').focus(); }

  #renderTitle(title) {
    if (title && title.length) {
      return Utilities.renderContent(title);
    }
    return "...";
  }

  #renderSourceLink(panel, article) {
    if (!panel) {
      return;
    }
    let url = article.getSourceUrl();
    if (!url) {
      return;
    }
    let e = panel.getDomElement();
    e.addEventListener("click", evt => this.#onGoToSource(url));
    panel.replaceContent(R.t("Source link"));
  }
};

blog.FFeedArticle = FFeedArticle;
}(window.blog = window.blog || {}));
