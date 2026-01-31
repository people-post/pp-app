import CronJob from '../../lib/ext/CronJob.js';
import { SocialItem } from '../datatypes/SocialItem.js';
import { Tag } from '../datatypes/Tag.js';
import { MessageThreadInfo } from '../datatypes/MessageThreadInfo.js';
import { UserRequest } from '../datatypes/UserRequest.js';
import { Notice } from '../datatypes/Notice.js';
import { LikedItemNotice } from '../datatypes/LikedItemNotice.js';
import { RepostItemNotice } from '../datatypes/RepostItemNotice.js';
import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { Signal } from './Signal.js';
import { Badge } from './Badge.js';
import { CHANNEL } from '../constants/Constants.js';
import { Api } from '../plt/Api.js';
import { Account } from './Account.js';

interface NotificationsData {
  message_threads: Array<{
    from_id: string;
    from_id_type: string;
  }>;
  notifications: Array<{
    type: string;
    subject_id: string;
    sub_type?: string;
  }>;
  requests: unknown[];
  n_emails: number;
}

interface NotificationsInterface {
  init(): void;
  reload(): void;
  getRequest(id: string): UserRequest | null | undefined;
  getNMessages(): number;
  getNBlogNotifications(): number;
  getNMessengerNotifications(): number;
  getNMessengerNotices(): number;
  getNWorkshopNotifications(): number;
  getNShopNotifications(): number;
  getNEmailNotifications(): number;
  getBlogNotices(): unknown[];
  getWorkshopNotices(): unknown[];
  getBlogRequestIds(): string[];
  getWorkshopRequestIds(): string[];
  getShopRequestIds(): string[];
  getMessengerRequestIds(): string[];
  getMessageThreadInfos(): IterableIterator<MessageThreadInfo>;
  getMessageThreadInfo(id: string): MessageThreadInfo | null | undefined;
}

export class NotificationsClass implements NotificationsInterface {
  #mMessages = new Map<string, MessageThreadInfo>();
  #mNotices = new Map<string, LikedItemNotice | RepostItemNotice>();
  #mRequests = new Map<string, UserRequest>();
  #nUnreadEmail = 0;
  #cronJob = new CronJob();

  init(): void {
    this.reload();
    this.#cronJob.reset(() => this.reload(), 30000, null, null); // Every 30s
  }

  getRequest(id: string): UserRequest | null | undefined {
    return this.#mRequests.get(id) || null;
  }

  getNMessages(): number {
    let n = 0;
    for (const info of this.#mMessages.values()) {
      n += info.getNUnread();
    }
    return n;
  }

  getNBlogNotifications(): number {
    return (
      this.#getNNotices(SocialItem.TYPE.ARTICLE) +
      this.#getNNotices(SocialItem.TYPE.FEED_ARTICLE) +
      this.getBlogRequestIds().length
    );
  }

  getNMessengerNotifications(): number {
    return this.getNMessages() + this.getNMessengerNotices();
  }

  getNWorkshopNotifications(): number {
    return this.#getNNotices(SocialItem.TYPE.PROJECT) + this.getWorkshopRequestIds().length;
  }

  getNShopNotifications(): number {
    return this.getShopRequestIds().length;
  }

  getNEmailNotifications(): number {
    return this.#nUnreadEmail;
  }

  getNMessengerNotices(): number {
    return this.getMessengerRequestIds().length;
  }

  getMessageThreadInfos(): IterableIterator<MessageThreadInfo> {
    return this.#mMessages.values();
  }

  getMessageThreadInfo(id: string): MessageThreadInfo | null | undefined {
    return this.#mMessages.get(id) || null;
  }

  getMessengerRequestIds(): string[] {
    return this.#getSectorRequestIds();
  }

  getBlogRequestIds(): string[] {
    return this.#getSectorRequestIds(Tag.T_ID.BLOG);
  }

  getWorkshopRequestIds(): string[] {
    return this.#getSectorRequestIds(Tag.T_ID.WORKSHOP);
  }

  getShopRequestIds(): string[] {
    return this.#getSectorRequestIds(Tag.T_ID.SHOP);
  }

  getBlogNotices(): unknown[] {
    return this.#getNotices(SocialItem.TYPE.ARTICLE).concat(this.#getNotices(SocialItem.TYPE.FEED_ARTICLE));
  }

  getWorkshopNotices(): unknown[] {
    return this.#getNotices(SocialItem.TYPE.PROJECT);
  }

  #getNNotices(type?: string): number {
    let n = 0;
    for (const info of this.#mNotices.values()) {
      if (!type || info.isFrom(type)) {
        n += info.getNUnread();
      }
    }
    return n;
  }

  #getNotices(type: string): unknown[] {
    const ns: unknown[] = [];
    for (const i of this.#mNotices.values()) {
      if (i.isFrom(type)) {
        ns.push(i);
      }
    }
    return ns;
  }

  #getSectorRequestIds(sectorId: string | null = null): string[] {
    // Note: !sectorId means not for any sector
    const ids: string[] = [];
    if (sectorId) {
      this.#mRequests.forEach((v, k) => {
        if (v.isForSector(sectorId)) {
          ids.push(k);
        }
      });
    } else {
      this.#mRequests.forEach((v, k) => {
        if (!v.isForSector()) {
          ids.push(k);
        }
      });
    }
    return ids;
  }

  #reset(data: NotificationsData): void {
    this.#mMessages.clear();
    this.#mNotices.clear();
    this.#mRequests.clear();
    for (const i of data.message_threads) {
      switch (i.from_id_type) {
        case SocialItem.TYPE.USER:
        case SocialItem.TYPE.GROUP:
          this.#mMessages.set(i.from_id, new MessageThreadInfo({
            from_id: i.from_id,
            from_id_type: i.from_id_type,
            n_unread: 0,
          }));
          break;
        default:
          // Do not add MessageThreadInfo to _mNotices - it's only for LikedItemNotice and RepostItemNotice
          break;
      }
    }
    for (const n of data.notifications) {
      this.#addNotificationData(n);
    }

    for (const d of data.requests) {
      const r = new UserRequest(d as Record<string, unknown>);
      const id = r.getId();
      if (id !== undefined) {
        this.#mRequests.set(String(id), r);
      }
    }
    this.#nUnreadEmail = data.n_emails;

    FwkEvents.trigger(FwkT_DATA.NOTIFICATIONS, null);
    const n = this.#getNNotices() + this.getNMessages() + this.#mRequests.size + this.#nUnreadEmail;
    Badge.updateBadge(n);
  }

  reload(): void {
    if (Account.isAuthenticated()) {
      const accountId = Account.getId();
      if (accountId && !Signal.isChannelSet(CHANNEL.USER_INBOX)) {
        Signal.subscribe(CHANNEL.USER_INBOX, accountId, (m) => this.#handleSignal(m));
      }
      this.#asyncLoadNotifications();
    }
  }

  #addNotificationData(d: { type: string; subject_id: string; sub_type?: string }): void {
    switch (d.type) {
      case Notice.T_TYPE.LIKE:
        this.#addLikedItemData(d);
        break;
      case Notice.T_TYPE.REPOST:
        this.#addRepostItemData(d);
        break;
      default:
        break;
    }
  }

  #addLikedItemData(d: { subject_id: string; sub_type?: string }): void {
    const k = this.#getNoticeKey(d.subject_id, Notice.T_TYPE.LIKE);
    if (!this.#mNotices.has(k)) {
      this.#mNotices.set(k, new LikedItemNotice(d.subject_id, d.sub_type || ''));
    }

    const n = this.#mNotices.get(k);
    if (n) {
      n.addData(d as unknown as { read_at?: string | null; from_user_id: string; id: string });
    }
  }

  #addRepostItemData(d: { subject_id: string; sub_type?: string }): void {
    const k = this.#getNoticeKey(d.subject_id, Notice.T_TYPE.REPOST);
    if (!this.#mNotices.has(k)) {
      this.#mNotices.set(k, new RepostItemNotice(d.subject_id, d.sub_type || ''));
    }

    const n = this.#mNotices.get(k);
    if (n) {
      n.addData(d as unknown as { read_at?: string | null; from_user_id: string; id: string });
    }
  }

  #getNoticeKey(subjectId: string, noticeType: string): string {
    return subjectId + noticeType;
  }

  #handleSignal(message: unknown): void {
    FwkEvents.trigger(PltT_DATA.USER_INBOX_SIGNAL, message);
  }

  #asyncLoadNotifications(): void {
    const url = '/api/user/notifications';
    Api.asCall(url).then(
      (d) => this.#reset(d as NotificationsData),
      () => {}
    );
  }
}

export const Notifications = new NotificationsClass();

