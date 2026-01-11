import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { TextArea } from '../../lib/ui/controllers/fragments/TextArea.js';
import { FMultiMediaFileUploader } from '../../lib/ui/controllers/fragments/FMultiMediaFileUploader.js';
import { ButtonGroup } from '../../lib/ui/controllers/fragments/ButtonGroup.js';
import { FAttachmentFileUploader } from '../../lib/ui/controllers/fragments/FAttachmentFileUploader.js';
import { OptionSwitch } from '../../lib/ui/controllers/fragments/OptionSwitch.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { VIS } from '../../common/constants/Constants.js';
import { ICON } from '../../common/constants/Icons.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { Tag } from '../../common/datatypes/Tag.js';
import { Article } from '../../common/datatypes/Article.js';
import { RichContentEditor } from '../../common/gui/RichContentEditor.js';
import { LiveStreamConfigFragment } from '../../common/gui/LiveStreamConfigFragment.js';
import { TagsEditorFragment } from '../../common/gui/TagsEditorFragment.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FQuoteElement } from './FQuoteElement.js';
import { PArticleEditor } from './PArticleEditor.js';
import { Api } from '../../common/plt/Api.js';
import { R } from '../../common/constants/R.js';
import type { Article as ArticleType } from '../../common/datatypes/Article.js';
import type { DraftArticle } from '../../common/datatypes/DraftArticle.js';
import { Account } from '../../common/dba/Account.js';

export class FArticleEditor extends Fragment {
  #fTitle: TextArea;
  #fContent: RichContentEditor;
  #fFiles: FMultiMediaFileUploader;
  #fFileChoices: ButtonGroup;
  #fLiveStream: LiveStreamConfigFragment;
  #fAttachment: FAttachmentFileUploader;
  #fTags: TagsEditorFragment;
  #fQuote: TextInput;
  #fQuotePreview: FQuoteElement;
  #fOptions: OptionSwitch;
  #fSubmit: Button;
  #fDelete: Button;
  #baseArticle: ArticleType | DraftArticle | null = null;
  #pQuotePreview: Panel | null = null;
  #tags: Tag[] | null = null;

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

    this.#fQuotePreview = new FQuoteElement();
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

  onInputChangeInTextInputFragment(_fText: TextInput, value: string): void {
    if (value && value.length && this.#pQuotePreview) {
      this.#fQuotePreview.setItem(value, SocialItem.TYPE.URL);
      this.#fQuotePreview.attachRender(this.#pQuotePreview);
      this.#fQuotePreview.render();
    }
  }
  onQuotedElementRequestShowView(_fQuote: FQuoteElement, _view: unknown): void {}
  onOptionChangeInOptionsFragment(_fOptions: OptionSwitch, _value: string, _isChecked: boolean): void {}
  onMultiMediaFileUploadWillBegin(_fMultiMedia: FMultiMediaFileUploader): void { this.#lockActionBtns(); }
  onMultiMediaFileUploadFinished(_fMultiMedia: FMultiMediaFileUploader): void {
    if (!this.#isUploadBusy()) {
      this.#unlockActionBtns();
    }
  }
  onAttachmentFileUploadWillBegin(_fAttachment: FAttachmentFileUploader): void { this.#lockActionBtns(); }
  onAttachmentFileUploadFinished(_fAttachment: FAttachmentFileUploader): void {
    if (!this.#isUploadBusy()) {
      this.#unlockActionBtns();
    }
  }

  onButtonGroupSelectionChanged(_fButtonGroup: ButtonGroup, value: string): void {
    if (!this.#baseArticle) {
      return;
    }
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
  onSimpleButtonClicked(fButton: Button): void {
    if (fButton == this.#fSubmit) {
      this.#onSubmit();
    } else if (fButton == this.#fDelete) {
      this.#onDelete();
    }
  }
  onInputChangeInTextArea(_fTextArea: TextArea, _text: string): void {}

  getTagsForTagsEditorFragment(_fEditor: TagsEditorFragment): Tag[] {
    if (this.#tags) {
      return this.#tags;
    }

    if (!this.#baseArticle) {
      return [];
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

  getInitialCheckedIdsForTagsEditorFragment(_fEditor: TagsEditorFragment): string[] {
    return this.#baseArticle ? this.#baseArticle.getTagIds() : [];
  }

  setArticle(baseArticle: ArticleType | DraftArticle): void { this.#baseArticle = baseArticle; }

  handleSessionDataUpdate(dataType: symbol, _data: unknown): void {
    switch (dataType) {
    case T_DATA.GROUPS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, _data);
  }

  _renderOnRender(render: Panel): void {
    if (!this.#baseArticle) {
      return;
    }
    let panel = new PArticleEditor();
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
      if (this.#pQuotePreview) {
        this.#fQuotePreview.setItem(this.#baseArticle.getLinkTo(),
                                    this.#baseArticle.getLinkType());
        this.#fQuotePreview.attachRender(this.#pQuotePreview);
        this.#fQuotePreview.render();
      }
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

  #isUploadBusy(): boolean {
    return this.#fFiles.isBusy() || this.#fAttachment.isBusy();
  }

  #onSubmit(): void {
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

  #onDelete(): void {
    this._confirmDangerousOperation(R.get("CONFIRM_DELETE_ARTICLE"),
                                    () => this.#asyncDelete());
  }

  #collectData(): {
    isDraft: boolean;
    id: string;
    title: string;
    content: string;
    classificationLevel: number | null;
    tagIds: string[];
    pendingNewTagNames: string[];
    linkTo: string | null;
    linkType: string | null;
  } {
    if (!this.#baseArticle) {
      throw new Error("Base article not set");
    }
    let data: {
      isDraft: boolean;
      id: string;
      title: string;
      content: string;
      classificationLevel: number | null;
      tagIds: string[];
      pendingNewTagNames: string[];
      linkTo: string | null;
      linkType: string | null;
    } = {
      isDraft: this.#baseArticle.isDraft(),
      id: this.#baseArticle.getId(),
      title: this.#fTitle.getValue(),
      content: this.#fContent.getValue(),
      classificationLevel: this.#fOptions.isOptionOn("O_VIS") ? null : 1,
      tagIds: this.#fTags.getSelectedTagIds(),
      pendingNewTagNames: this.#fTags.getNewTagNames(),
      linkTo: null,
      linkType: null
    };
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

  #asyncSubmit(data: {
    isDraft: boolean;
    id: string;
    title: string;
    content: string;
    classificationLevel: number | null;
    tagIds: string[];
    pendingNewTagNames: string[];
    linkTo: string | null;
    linkType: string | null;
  }): boolean {
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

    let url: string;
    if (data.isDraft) {
      url = "api/blog/post_article";
    } else {
      url = "api/blog/update_article";
    }
    Api.asyncRawPost(url, fd, (r: string) => this.#onSubmitRRR(r),
                         (_r: unknown) => this.#onAsyncPostError(_r));
    return true;
  }

  #getCurrentUploaderFragment(): FMultiMediaFileUploader | LiveStreamConfigFragment | null {
    switch (this.#fFileChoices.getSelectedValue()) {
    case "FILES":
      return this.#fFiles;
    case "LIVE":
      return this.#fLiveStream;
    default:
      break;
    }
    return null;
  }

  #lockActionBtns(): void {
    this.#fSubmit.disable();
    this.#fDelete.disable();
  }

  #unlockActionBtns(): void {
    this.#fSubmit.enable();
    this.#fDelete.enable();
  }

  #asyncGetTags(ownerId: string): void {
    let url = "api/blog/available_tags?from=" + ownerId;
    Api.asFragmentCall(this, url).then((d: {tags: unknown[]}) => this.#onTagsRRR(d));
  }

  #onTagsRRR(data: {tags: unknown[]}): void {
    this.#tags = [];
    for (let d of data.tags) {
      this.#tags.push(new Tag(d));
    }
    this.#fTags.render();
  }

  #onSubmitRRR(responseText: string): void {
    let response: {error?: unknown; data?: {groups: unknown; article: unknown}} = JSON.parse(responseText);
    if (response.error) {
      this.onRemoteErrorInFragment(this, response.error);
      this.#unlockActionBtns();
    } else {
      if (this.#baseArticle && this.#baseArticle.isDraft()) {
        (this._delegate as any).onNewArticlePostedInArticleEditorFragment(this);
      } else {
        if (response.data) {
          WebConfig.setGroups(response.data.groups);
          (this._delegate as any).onArticleUpdatedInArticleEditorFragment(
              this, new Article(response.data.article));
        }
      }
    }
  }

  #asyncDelete(): void {
    if (!this.#baseArticle) {
      return;
    }
    let url = "/api/blog/delete_article?id=" + this.#baseArticle.getId();
    Api.asFragmentCall(this, url).then((_d: unknown) => this.#onDeleteRRR(_d));
  }

  #onDeleteRRR(_data: unknown): void { location.replace(WebConfig.getHomeUrl()); }

  #onAsyncPostError(_dummy: unknown): void {
    this.onLocalErrorInFragment(this, R.get("EL_API_POST"));
    this.#unlockActionBtns();
  }
};
