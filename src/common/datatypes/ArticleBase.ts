import { ServerDataObject } from './ServerDataObject.js';
import { Post } from '../../types/blog.js';
import { RemoteFile } from './RemoteFile.js';
import { SocialItemId } from './SocialItemId.js';
import { ArticleBaseData } from '../../types/backend2.js';

export abstract class ArticleBase extends ServerDataObject implements Post {
  protected _data: ArticleBaseData;

  constructor(data: ArticleBaseData) {
    super(data);
    this._data = data;
  }

  abstract isDraft(): boolean;

  abstract isRepost(): boolean;

  abstract isEditable(): boolean;

  abstract isSocialable(): boolean;

  abstract isPinnable(): boolean;

  abstract isQuotePost(): boolean;

  abstract getLinkTo(): string | null;

  abstract getLinkType(): string | null | undefined;

  abstract getLinkToSocialId(): SocialItemId;

  abstract getSocialItemType(): string;

  abstract getTitle(): string | null | undefined;

  abstract getContent(): string | null | undefined;

  abstract getFiles(): RemoteFile[];

  abstract getAttachment(): RemoteFile | undefined;

  abstract getVisibility(): string | null;

  abstract getOwnerId(): string | null;

  abstract getAuthorId(): string | null;

  abstract getTagIds(): string[] | undefined;

  abstract getPublishMode(): string | undefined;

  abstract getPendingAuthorTagIds(): string[] | undefined;

  abstract getPendingAuthorNewTagNames(): string[] | undefined;

  abstract getPendingNewTagNames(): string[] | undefined;

  abstract getClassification(): string | undefined;

  abstract getUpdateTime(): Date;

  abstract getExternalQuoteUrl(): string | null;

  abstract getSocialId(): SocialItemId;

  abstract getCommentTags(): string[];

  abstract getHashtagIds(): string[];

  abstract getTaggedCommentIds(tagId: string): SocialItemId[];

  abstract getOgpData(): unknown;
}

