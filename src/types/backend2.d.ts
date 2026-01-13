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
