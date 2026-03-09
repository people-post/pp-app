/**
 * Backend API type definitions
 */

/**
 * Idol data structure from backend API
 */
export interface Idol {
  user_id: string;
  nickname?: string;
}

export interface Group {
  id: string;
  owner_id: string;
  name: string;
  theme: ColorTheme | null;
  tag_ids: string[];
  member_ids: string[];
  is_open: boolean;
  status: string | null;
  data: unknown;
}

/**
 * OutRequest data structure from backend API
 */
export interface OutRequest {
  target_group_id: string;
}

export interface SocialItemId {
  id: string;
  type: string;
}

export interface SectorItemLayout {
  type: string;
}

/**
 * BlogProfile data structure from backend API
 */
export interface BlogConfig {
  pinned_items: SocialItemId[];
  is_social_action_enabled: boolean;
  item_layout?: SectorItemLayout;
  pinned_item_layout?: SectorItemLayout;
}

export interface ColorTheme {
  primary_color: string;
  secondary_color: string;
}

/**
 * UserProfile data structure from backend API
 */
interface AccountProfileBase {
  uuid: string;
  nickname: string | null;
  brief_biography: string | null;
  domain: string | null;
  n_idols: number | null;
  n_followers: number | null;
  logo_url: string | null;
  icon_url: string | null;
  image_url: string | null;
  theme: ColorTheme | null;
}

export interface UserPublicProfile extends AccountProfileBase {
  is_beta_tester: boolean | null;
  referrer_id: string | null;
  username: string | null;
  is_following_user: boolean | null;
  shop_name: string | null;
  is_workshop_open: boolean | null;
  is_shop_open: boolean | null;
  community_id?: string | null;
  blog_config?: BlogConfig;
}

export interface UserPrivateProfile {
  uuid: string;
  nickname: string | null;
  is_beta_tester: boolean | null;
  referrer_id: string | null;
  community_id: string | null;
  is_followed: boolean | null;
  domain_name: string | null;
  live_stream_key: string | null;
  idols: Idol[];
  tags: Group[];
  group_ids: string[];
  journal_ids: string[];
  o_requests: OutRequest[];
  applied_community_id?: string;
  representative_id?: string | null;
  blog?: BlogConfig;
}

/**
 * FrameConfig data structure from backend API
 */
export interface FrameConfig {
  type?: string;
  [key: string]: unknown;
}

/**
 * RoleData data structure from backend API
 */
export interface RoleData {
  id?: string;
  tag_ids?: string[];
  [key: string]: unknown;
}

/**
 * WebConfigData data structure from backend API
 */
export interface WebConfigData {
  is_shop_open?: boolean;
  is_workshop_open?: boolean;
  is_dev_site?: boolean;
  web_socket_url?: string;
  login_proxy_url?: string;
  rtmp_url?: string;
  ice_url?: string;
  max_n_frames?: number;
  home_sector?: string;
  home_page_title?: string;
  owner?: {
    uuid?: string;
    [key: string]: unknown;
  };
  default_theme?: unknown;
  front_page?: unknown;
  side_frames?: {
    left?: FrameConfig;
    right?: FrameConfig;
  };
  tags?: Array<{ id?: string; [key: string]: unknown }>;
  roles?: Array<RoleData>;
  groups?: unknown;
  [key: string]: unknown;
}

/**
 * ArticleBaseData data structure from backend API
 */
export interface ArticleBaseData {
  files?: unknown[];
  attachments?: unknown[];
  link_to?: string;
  link_type?: string;
  title?: string;
  content?: string;
  visibility?: string;
  owner_id?: string;
  author_id?: string;
  tag_ids?: string[];
  publish_mode?: string;
  author_tag_ids?: string[];
  author_new_tag_names?: string[];
  new_tag_names?: string[];
  classification?: string;
  updated_at?: number;
  [key: string]: unknown;
}

/**
 * JournalIssueBaseData data structure from backend API
 */
export interface JournalIssueBaseData {
  sections?: Array<{ id?: string; item_ids?: Array<{ id: string; type: string }>; [key: string]: unknown }>;
  owner_id?: string;
  journal_id?: string;
  issue_id?: string;
  abstract?: string;
  summary?: string;
  tag_ids?: string[];
  [key: string]: unknown;
}

/**
 * CommentTagData data structure from backend API
 */
export interface CommentTagData {
  tag_id: string;
  comment_ids: Array<{ id: string; type: string }>;
}

/**
 * JournalIssueData data structure from backend API
 */
export interface JournalIssueData extends JournalIssueBaseData {
  comment_tags?: CommentTagData[];
  [key: string]: unknown;
}
