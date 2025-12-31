import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { TextArea } from '../../lib/ui/controllers/fragments/TextArea.js';
import { FMultiMediaFileUploader } from '../../lib/ui/controllers/fragments/FMultiMediaFileUploader.js';
import { ButtonGroup } from '../../lib/ui/controllers/fragments/ButtonGroup.js';
import { FAttachmentFileUploader } from '../../lib/ui/controllers/fragments/FAttachmentFileUploader.js';
import { OptionSwitch } from '../../lib/ui/controllers/fragments/OptionSwitch.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { VIS } from '../../common/constants/Constants.js';
import { ICON } from '../../common/constants/Icons.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { Tag } from '../../common/datatypes/Tag.js';
import { Article } from '../../common/datatypes/Article.js';
import { RichContentEditor } from '../../common/gui/RichContentEditor.js';
import { LiveStreamConfigFragment } from '../../common/gui/LiveStreamConfigFragment.js';
import { TagsEditorFragment } from '../../common/gui/TagsEditorFragment.js';
import { Account } from '../../common/dba/Account.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { T_DATA } from '../../common/plt/Events.js';
import { api } from '../../common/plt/Api.js';

export class FArticleEditor extends Fragment {
  #fTitle;
  #fContent;
  #fFiles;
  #fFileChoices;
  #fLiveStream;
  #fAttachment;
  #fTags;
  #fQuote;
  #fQuotePreview;
  #fOptions;
  #fSubmit;
  #fDelete;
  #baseArticle = null;
  #pQuotePreview = null;
  #tags = null;

  constructor() {
    super();
    this.#fTitle = new TextArea();
    this.#fTitle.setClassName("w100 h40px");
    this.#fTitle.setDelegate(this);
    this.setChild("title", this.#fTitle);

    this.#fContent = new RichContentEditor();
    this.setChild("content", this.#fContent);

    this.#fFiles = new FMultiMediaFileUploader();
    this.#fFiles.setCacheIds([ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]);
    this.#fFiles.setDataSource(this);
    this.#fFiles.setDelegate(this);
    this.setChild("files", this.#fFiles);

    this.#fLiveStream = new LiveStreamConfigFragment();
    this.#fLiveStream.setDataSource(this);
    this.#fLiveStream.setDelegate(this);
    this.setChild("liveStream", this.#fLiveStream);

    this.#fFileChoices = new ButtonGroup();
    this.#fFileChoices.setDataSource(this);
    this.#fFileChoices.setDelegate(this);
    this.#fFileChoices.addChoice({
      name : "Files",
      value : "FILES",
      icon : ICON.UPLOAD,
      fDetail : this.#fFiles
    });
    this.#fFileChoices.addChoice({
      name : "Live stream",
      value : "LIVE",
      icon : ICON.LIVESTREAM,
      fDetail : this.#fLiveStream
    });
    this.#fFileChoices.setSelectedValue("FILES");
    this.setChild("fileChoices", this.#fFileChoices);

    this.#fAttachment = new FAttachmentFileUploader();
    this.#fAttachment.setCacheId(9);
    this.#fAttachment.setDelegate(this);
    this.setChild("attachment", this.#fAttachment);

    this.#fTags = new TagsEditorFragment();
    this.#fTags.setDataSource(this);
    this.#fTags.setDelegate(this);
    this.setChild("tags", this.#fTags);

    this.#fOptions = new OptionSwitch();
    this.#fOptions.addOption("Public", "O_VIS");
    this.#fOptions.setDelegate(this);
    this.setChild("options", this.#fOptions);

    this.#fQuote = new TextInput();
    this.#fQuote.setDelegate(this);
    this.setChild("quote", this.#fQuote);

    this.#fQuotePreview = new blog.FQuoteElement();
    this.#fQuotePreview.setDelegate(this);
    this.setChild("quotePreview", this.#fQuotePreview);

    this.#fSubmit = new Button();
    this.#fSubmit.setName("Post");
    this.#fSubmit.setLayoutType(Button.LAYOUT_TYPE.BAR);
    this.#fSubmit.setDelegate(this);
    this.setChild("btnSubmit", this.#fSubmit);

    this.#fDelete = new Button();
    this.#fDelete.setName("Delete...");
    this.#fDelete.setThemeType(Button.T_THEME.DANGER);
    this.#fDelete.setLayoutType(Button.LAYOUT_TYPE.BAR);
    this.#fDelete.setDelegate(this);
    this.setChild("btnDelete", this.#fDelete);
  }

  onInputChangeInTextInputFragment(fText, value) {
    if (value && value.length) {
      this.#fQuotePreview.setItem(value, SocialItem.TYPE.URL);
      this.#fQuotePreview.attachRender(this.#pQuotePreview);
      this.#fQuotePreview.render();
    }
  }
  onQuotedElementRequestShowView(fQuote, view) {}
  onOptionChangeInOptionsFragment(fOptions, value, isChecked) {}
  onMultiMediaFileUploadWillBegin(fMultiMedia) { this.#lockActionBtns(); }
  onMultiMediaFileUploadFinished(fMultiMedia) {
    if (!this.#isUploadBusy()) {
      this.#unlockActionBtns();
    }
  }
  onAttachmentFileUploadWillBegin(fAttachment) { this.#lockActionBtns(); }
  onAttachmentFileUploadFinished(fAttachment) {
    if (!this.#isUploadBusy()) {
      this.#unlockActionBtns();
    }
  }

  onButtonGroupSelectionChanged(fButtonGroup, value) {
    switch (value) {
    case "FILES":
      this.#fFiles.setToHrefFiles(this.#baseArticle.getFiles());
      break;
    case "LIVE":
      this.#fLiveStream.clearFiles();
      break;
    default:
      break;
    }
  }
  onSimpleButtonClicked(fButton) {
    if (fButton == this.#fSubmit) {
      this.#onSubmit();
    } else if (fButton == this.#fDelete) {
      this.#onDelete();
    }
  }
  onInputChangeInTextArea(fTextArea, text) {}

  getTagsForTagsEditorFragment(fEditor) {
    if (this.#tags) {
      return this.#tags;
    }

    let ownerId = this.#baseArticle.getOwnerId();
    if (Account.getId() == ownerId && Account.isWebOwner()) {
      this.#tags = WebConfig.getTags();
      return this.#tags;
    } else {
      this.#asyncGetTags(ownerId);
      return [];
    }
  }

  getInitialCheckedIdsForTagsEditorFragment(fEditor) {
    return this.#baseArticle.getTagIds();
  }

  setArticle(baseArticle) { this.#baseArticle = baseArticle; }

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
    let panel = new blog.PArticleEditor();
    render.wrapPanel(panel);
    let p = panel.getTitlePanel();
    this.#fTitle.setConfig({
      title : "Message",
      value : this.#baseArticle.getTitle(),
      hint : "",
      isRequred : false
    });
    this.#fTitle.attachRender(p);
    this.#fTitle.render();

    p = panel.getFilesPanel();
    this.#fFiles.setToHrefFiles(this.#baseArticle.getFiles());
    if (this.#baseArticle.isDraft()) {
      this.#fFileChoices.attachRender(p);
      this.#fFileChoices.render();
    } else {
      this.#fFiles.attachRender(p);
      this.#fFiles.render();
    }

    p = panel.getAttachmentPanel();
    this.#fAttachment.resetToUrlFile(this.#baseArticle.getAttachment());
    this.#fAttachment.attachRender(p);
    this.#fAttachment.render();

    p = panel.getContentPanel();
    this.#fContent.setConfig(
        {title : "Detail", value : this.#baseArticle.getContent(), hint : ""});
    this.#fContent.attachRender(p);
    this.#fContent.render();

    p = panel.getTagsPanel();
    if (Account.isWebOwner()) {
      this.#fTags.setEnableNewTags(true);
    }
    this.#fTags.attachRender(p.getContentPanel());
    this.#fTags.render();

    p = panel.getQuoteUrlPanel();
    this.#fQuote.setConfig({
      hint : "Paste url here",
      value : this.#baseArticle.getExternalQuoteUrl()
    });
    this.#fQuote.attachRender(p);
    this.#fQuote.render();

    this.#pQuotePreview = panel.getQuotePreviewPanel();
    if (this.#baseArticle.isQuotePost()) {
      this.#fQuotePreview.setItem(this.#baseArticle.getLinkTo(),
                                  this.#baseArticle.getLinkType());
      this.#fQuotePreview.attachRender(this.#pQuotePreview);
      this.#fQuotePreview.render();
    }

    p = panel.getOptionsPanel();
    this.#fOptions.setOption("O_VIS",
                             this.#baseArticle.getVisibility() == VIS.PUBLIC);
    this.#fOptions.attachRender(p.getContentPanel());
    this.#fOptions.render();

    p = panel.getBtnListPanel();
    let pp = new Panel();
    p.pushPanel(pp);
    this.#fSubmit.attachRender(pp);
    this.#fSubmit.render();

    if (!this.#baseArticle.isDraft()) {
      p.pushSpace(2);
      pp = new Panel();
      p.pushPanel(pp);
      this.#fDelete.attachRender(pp);
      this.#fDelete.render();
    }
  }

  #isUploadBusy() {
    return this.#fFiles.isBusy() || this.#fAttachment.isBusy();
  }

  #onSubmit() {
    if (this.#isUploadBusy()) {
      this._owner.onLocalErrorInFragment(this, R.get("EL_FILE_UPLOAD_BUSY"));
    } else {
      this.#lockActionBtns();
      let data = this.#collectData();
      if (!this.#asyncSubmit(data)) {
        this.#unlockActionBtns();
      }
    }
  }

  #onDelete() {
    this._confirmDangerousOperation(R.get("CONFIRM_DELETE_ARTICLE"),
                                    () => this.#asyncDelete());
  }

  #collectData() {
    let data = {};
    data.isDraft = this.#baseArticle.isDraft();
    data.id = this.#baseArticle.getId();
    data.title = this.#fTitle.getValue();
    data.content = this.#fContent.getValue();
    data.classificationLevel = this.#fOptions.isOptionOn("O_VIS") ? null : 1;
    data.tagIds = this.#fTags.getSelectedTagIds();
    data.pendingNewTagNames = this.#fTags.getNewTagNames();
    let v = this.#fQuote.getValue();
    if (v && v.length) {
      data.linkTo = v;
      data.linkType = SocialItem.TYPE.URL;
    } else {
      data.linkTo = this.#baseArticle.getLinkTo();
      data.linkType = this.#baseArticle.getLinkType();
    }

    return data;
  }

  #asyncSubmit(data) {
    let fd = new FormData();
    let f = this.#getCurrentUploaderFragment();
    if (!(f && f.validate())) {
      return false;
    }
    if (!this.#fAttachment.validate()) {
      return false;
    }

    f.saveDataToForm(fd);

    let d = this.#fAttachment.getDataForForm();
    if (d) {
      fd.append("attachment", d);
    }

    fd.append("id", data.id);
    fd.append("title", data.title);
    fd.append("content", data.content);
    if (data.linkTo) {
      fd.append("link_to", data.linkTo);
    }
    if (data.linkType) {
      fd.append("link_type", data.linkType);
    }

    if (data.classificationLevel) {
      fd.append("visibility", VIS.PRIVATE);
    } else {
      fd.append("visibility", VIS.PUBLIC);
    }

    for (let id of data.tagIds) {
      fd.append("tag_ids", id);
    }

    for (let name of data.pendingNewTagNames) {
      fd.append("new_tag_names", name);
    }

    let url;
    if (data.isDraft) {
      url = "api/blog/post_article";
    } else {
      url = "api/blog/update_article";
    }
    api.asyncRawPost(url, fd, r => this.#onSubmitRRR(r),
                         r => this.#onAsyncPostError(r));
    return true;
  }

  #getCurrentUploaderFragment() {
    switch (this.#fFileChoices.getSelectedValue()) {
    case "FILES":
      return this.#fFiles;
      break;
    case "LIVE":
      return this.#fLiveStream;
    default:
      break;
    }
    return null;
  }

  #lockActionBtns() {
    this.#fSubmit.disable();
    this.#fDelete.disable();
  }

  #unlockActionBtns() {
    this.#fSubmit.enable();
    this.#fDelete.enable();
  }

  #asyncGetTags(ownerId) {
    let url = "api/blog/available_tags?from=" + ownerId;
    api.asyncFragmentCall(this, url).then(d => this.#onTagsRRR(d));
  }

  #onTagsRRR(data) {
    this.#tags = [];
    for (let d of data.tags) {
      this.#tags.push(new Tag(d));
    }
    this.#fTags.render();
  }

  #onSubmitRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      this.onRemoteErrorInFragment(this, response.error);
      this.#unlockActionBtns();
    } else {
      if (this.#baseArticle.isDraft()) {
        this._delegate.onNewArticlePostedInArticleEditorFragment(this);
      } else {
        WebConfig.setGroups(response.data.groups);
        this._delegate.onArticleUpdatedInArticleEditorFragment(
            this, new Article(response.data.article));
      }
    }
  }

  #asyncDelete() {
    let url = "/api/blog/delete_article?id=" + this.#baseArticle.getId();
    api.asyncFragmentCall(this, url).then(d => this.#onDeleteRRR(d));
  }

  #onDeleteRRR(data) { location.replace(WebConfig.getHomeUrl()); }

  #onAsyncPostError(dummy) {
    this.onLocalErrorInFragment(this, R.get("EL_API_POST"));
    this.#unlockActionBtns();
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FArticleEditor = FArticleEditor;
}
