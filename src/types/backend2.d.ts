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

/**
 * OutRequest data structure from backend API
 */
export interface OutRequest {
  target_group_id: string;
}

/**
 * BlogProfile data structure from backend API
 */
export interface BlogProfile {
  [key: string]: unknown;
}

/**
 * UserProfile data structure from backend API
 */
export interface UserProfile {
  uuid: string;
  is_followed?: boolean;
  idols?: Idol[];
  group_ids?: string[];
  journal_ids?: string[];
  blog?: BlogProfile;
  lang?: string;
  representative_id?: string;
  nickname?: string;
  referrer_id?: string;
  community_id?: string;
  applied_community_id?: string;
  is_beta_tester?: boolean;
  domain_name?: string;
  live_stream_key?: string;
  address_ids?: string[];
  o_requests?: OutRequest[];
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
  link_type?: string | null;
  title?: string | null;
  content?: string | null;
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
