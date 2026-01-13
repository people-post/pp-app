import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { ColorTheme } from '../datatypes/ColorTheme.js';
import { FrontPageConfig } from '../datatypes/FrontPageConfig.js';
import { Tag } from '../datatypes/Tag.js';
import { User } from '../datatypes/User.js';
import { Menus } from './Menus.js';
import { ID, URL_PARAM } from '../constants/Constants.js';
import { Env } from '../plt/Env.js';
import { Api } from '../plt/Api.js';
import type { FrameConfig, RoleData, WebConfigData } from '../../types/backend2.js';

export type { FrameConfig, RoleData, WebConfigData };

interface ApiResponse {
  error?: unknown;
  data?: {
    web_config?: WebConfigData;
  };
}

interface WebConfigInterface {
  reset(data: WebConfigData | null): void;
  resetTags(tags: unknown[]): void;
  resetRoles(roles: unknown[]): void;
  isShopOpen(): boolean;
  isWorkshopOpen(): boolean;
  isDevSite(): boolean;
  isWebOwner(userId: string | null): boolean;
  getHomeSector(): string;
  getCurrentTheme(): ColorTheme | null;
  getMaxNFrames(): number;
  getLeftSideFrameConfig(): unknown;
  getRightSideFrameConfig(): unknown;
  getHomePageTitle(): string | null;
  getOwnerId(): string | null;
  getOwner(): User | null;
  getHomeUrl(): string;
  getSubUrl(sectorId: string): string;
  getDefaultTheme(): ColorTheme | null;
  getFrontPageConfig(): FrontPageConfig | null;
  getTags(): Tag[];
  getTag(id: string | null): Tag | null;
  getRoleDatasByTagId(tagId: string): unknown[];
  getRoleData(id: string | null): unknown;
  getWebSocketUrl(): string | null;
  getLoginProxyUrl(): string | null;
  getRtmpUrl(): string | null;
  getIceUrl(): string | null;
  asyncSetHomeSector(sectorId: string): void;
  asyncUpdateGroupConfig(groupId: string, newName?: string | null, themeKey?: string | null, themeColor?: string | null): void;
  setThemeId(id: string | null): void;
  setBootTheme(data: unknown): void;
  setGroups(groups: unknown): void;
  setWorkshopOpen(v: boolean): void;
  setShopOpen(v: boolean): void;
}

export class WebConfigClass implements WebConfigInterface {
  #data: WebConfigData | null = null;
  #themeId: string | null = null;
  #bootTheme: ColorTheme | null = null;

  reset(data: WebConfigData | null): void {
    this.#data = data;
    // Update Api instance with isDevSite, ownerId, and isTrustedSite
    if (Api && 'setConfig' in Api && typeof Api.setConfig === 'function') {
      const isDevSite = data ? !!data.is_dev_site : false;
      let ownerId: string | null = null;
      if (Env.isWeb3()) {
        const dba = (window as { dba?: { Account?: { getId(): string | null } } }).dba;
        ownerId = dba?.Account?.getId() || null;
      } else {
        ownerId = data && data.owner ? data.owner.uuid || null : null;
      }
      const isTrustedSite = Env.isTrustedSite() || false;
      (Api as { setConfig(config: { isDevSite: boolean; ownerId: string | null; isTrustedSite: boolean }): void }).setConfig({
        isDevSite,
        ownerId,
        isTrustedSite,
      });
    }
    FwkEvents.trigger(FwkT_DATA.WEB_CONFIG, data);
  }

  resetRoles(roles: unknown[]): void {
    if (this.#data) {
      this.#data.roles = roles as WebConfigData['roles'];
      FwkEvents.trigger(PltT_DATA.GROUPS, roles);
    }
  }

  resetTags(tags: unknown[]): void {
    if (this.#data) {
      this.#data.tags = tags as WebConfigData['tags'];
      FwkEvents.trigger(PltT_DATA.GROUPS, tags);
    }
  }

  isShopOpen(): boolean {
    return !!(this.#data && this.#data.is_shop_open);
  }

  isWorkshopOpen(): boolean {
    return !!(this.#data && this.#data.is_workshop_open);
  }

  isDevSite(): boolean {
    return this.#data ? !!this.#data.is_dev_site : false;
  }

  isWebOwner(userId: string | null): boolean {
    return !!(userId && userId === this.getOwnerId());
  }

  getWebSocketUrl(): string | null {
    return this.#data ? this.#data.web_socket_url || null : null;
  }

  getLoginProxyUrl(): string | null {
    return this.#data ? this.#data.login_proxy_url || null : null;
  }

  getRtmpUrl(): string | null {
    return this.#data ? this.#data.rtmp_url || null : null;
  }

  getIceUrl(): string | null {
    return this.#data ? this.#data.ice_url || null : null;
  }

  getMaxNFrames(): number {
    return this.#data ? this.#data.max_n_frames || 2 : 2;
  }

  getHomeSector(): string {
    let sectorId: string = ID.SECTOR.BLOG;
    if (this.#data && this.#data.home_sector) {
      sectorId = this.#data.home_sector;
    }
    return sectorId;
  }

  getHomePageTitle(): string | null {
    return this.#data ? this.#data.home_page_title || null : null;
  }

  getOwnerId(): string | null {
    if (Env.isWeb3()) {
      const dba = (window as { dba?: { Account?: { getId(): string | null } } }).dba;
      return dba?.Account?.getId() || null;
    }

    return this.#data && this.#data.owner ? this.#data.owner.uuid || null : null;
  }

  getOwner(): User | null {
    if (Env.isWeb3()) {
      const dba = (window as { dba?: { Account?: User } }).dba;
      return (dba?.Account as unknown as User) || null;
    } else {
      if (!this.#data || !this.#data.owner) {
        return null;
      }
      return new User(this.#data.owner as Record<string, unknown>);
    }
  }

  getHomeUrl(): string {
    if (Env.isWeb3()) {
      return '?';
    } else {
      return '/?' + URL_PARAM.USER + '=' + this.getOwnerId();
    }
  }

  getSubUrl(sectorId: string): string {
    return '/sub?' + URL_PARAM.USER + '=' + this.getOwnerId() + '&' + URL_PARAM.SECTOR + '=' + sectorId;
  }

  getDefaultTheme(): ColorTheme | null {
    return this.#data && this.#data.default_theme ? new ColorTheme(this.#data.default_theme as { primary_color: string; secondary_color: string }) : this.#bootTheme;
  }

  getFrontPageConfig(): FrontPageConfig | null {
    return this.#data && this.#data.front_page ? new FrontPageConfig(this.#data.front_page as Record<string, unknown>) : null;
  }

  getLeftSideFrameConfig(): FrameConfig | null {
    const d = this.#data ? this.#data.side_frames : null;
    return d?.left ?? null;
  }

  getRightSideFrameConfig(): FrameConfig | null {
    const d = this.#data ? this.#data.side_frames : null;
    return d?.right ?? null;
  }

  getTags(): Tag[] {
    const ds = this.#data ? this.#data.tags || [] : [];
    const tags: Tag[] = [];
    for (const d of ds) {
      tags.push(new Tag(d as Record<string, unknown>));
    }
    return tags;
  }

  getTag(id: string | null): Tag | null {
    const ds = this.#data ? this.#data.tags || [] : [];
    if (id) {
      for (const d of ds) {
        if (d.id === id) {
          return new Tag(d as Record<string, unknown>);
        }
      }
    }
    return null;
  }

  getRoleDatasByTagId(tagId: string): RoleData[] {
    // TODO: This is a hack, use objects
    const ds: RoleData[] = [];
    for (const d of this.#getRoleDatas()) {
      if (d.tag_ids && d.tag_ids.indexOf(tagId) >= 0) {
        ds.push(d);
      }
    }
    return ds;
  }

  getRoleData(id: string | null): RoleData | null {
    // TODO: This is a hack, use object
    if (id) {
      for (const d of this.#getRoleDatas()) {
        if (d.id === id) {
          return d;
        }
      }
    }
    return null;
  }

  getCurrentTheme(): ColorTheme | null {
    if (this.#themeId) {
      const m = Menus.find(this.#themeId);
      if (m && typeof m === 'object' && m !== null && 'getTheme' in m && typeof m.getTheme === 'function') {
        return m.getTheme() as ColorTheme | null;
      }
    }

    return this.getDefaultTheme();
  }

  setThemeId(id: string | null): void {
    if (this.#themeId !== id) {
      this.#themeId = id;
      FwkEvents.trigger(FwkT_DATA.WEB_CONFIG, id);
    }
  }

  setBootTheme(data: unknown): void {
    this.#bootTheme = new ColorTheme(data as { primary_color: string; secondary_color: string });
  }

  setGroups(groups: unknown): void {
    if (this.#data) {
      this.#data.groups = groups;
    }
  }

  setWorkshopOpen(v: boolean): void {
    if (this.#data) {
      this.#data.is_workshop_open = v;
      FwkEvents.trigger(FwkT_DATA.WEB_CONFIG, v);
    }
  }

  setShopOpen(v: boolean): void {
    if (this.#data) {
      this.#data.is_shop_open = v;
      FwkEvents.trigger(FwkT_DATA.WEB_CONFIG, v);
    }
  }

  asyncSetHomeSector(sectorId: string): void {
    const url = 'api/user/set_home_sector';
    const fd = new FormData();
    fd.append('sector', sectorId);
    Api.asyncRawPost(url, fd, (r) => this.#onSetHomeSectorRRR(r), null);
  }

  asyncUpdateGroupConfig(
    groupId: string,
    newName: string | null = null,
    themeKey: string | null = null,
    themeColor: string | null = null
  ): void {
    const url = '/api/user/update_group';
    const fd = new FormData();
    fd.append('id', groupId);
    if (newName) {
      fd.append('name', newName);
    }
    if (themeKey) {
      fd.append('key', themeKey);
    }
    if (themeColor) {
      fd.append('color', themeColor);
    }
    Api.asyncRawPost(url, fd, (r) => this.#onUpdateGroupRRR(r), null);
  }

  #getRoleDatas(): RoleData[] {
    return this.#data && this.#data.roles ? this.#data.roles : [];
  }

  #onSetHomeSectorRRR(responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.web_config) {
        this.reset(response.data.web_config);
      }
    }
  }

  #onUpdateGroupRRR(responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.web_config) {
        this.reset(response.data.web_config);
      }
    }
  }
}

export const WebConfig = new WebConfigClass();

