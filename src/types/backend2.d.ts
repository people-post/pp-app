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
  created_at?: number;
  _created_at?: Date;
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

export interface CountryData {
  name: string;
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

interface DirItemDataBase {
  id: string;
  name?: string;
  created_at?: Date | number;
}

export interface DirItemData<T extends DirItemData<T> = any> extends DirItemDataBase {
  sub_items?: T[];
}

export interface MenuItemData extends DirItemData<MenuItemData> {
  tag_id?: string;
}

export interface MenuEntryItemData extends MenuItemData {
  theme?: ColorTheme;
}

export interface MenuData extends MenuItemData {}

export interface TimeClockRecordData {
  total?: number;
  [key: string]: unknown;
}

export interface TimeClockData {
  t_current?: number;
  [key: string]: unknown;
}

export interface MessageThreadData {
  from_id: string;
  from_id_type: string;
  n_unread: number;
  latest?: Record<string, unknown>;
}

export interface UserRequestData {
  sector_ids?: string[];
  from_user_id?: string;
  target_group_id?: string;
  category?: string;
  message?: string;
  [key: string]: unknown;
}

export interface WorkshopTeamData {
  status?: string;
  data?: {
    permissions?: string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface UserRoleData {
  is_open?: boolean;
  name?: string;
  member_ids?: string[];
  status?: string;
  [key: string]: unknown;
}

export interface BlogRoleData {
  status?: string;
  data?: {
    allowed_tag_ids?: string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface VoteData {
  user_id?: string;
  item_id?: string;
  value?: string;
  [key: string]: unknown;
}

export interface VisitSummaryData {
  sub_query_key?: string;
  sub_query_value?: string;
  name?: string;
  total?: number;
  [key: string]: unknown;
}

interface BallotItem {
  value: string;
  ballot: number;
  [key: string]: unknown;
}

export interface VotingSummaryData {
  config?: unknown;
  items?: BallotItem[];
  [key: string]: unknown;
}

export interface SupplierOrderPrivateData {
  customer_id?: string;
  [key: string]: unknown;
}

interface ProductData {
  description?: string;
  quantity?: number;
  unit_price?: number;
  [key: string]: unknown;
}

export interface SupplierOrderItemData {
  product?: ProductData;
  state?: string;
  status?: string;
  [key: string]: unknown;
}

export interface ShopTeamData {
  status?: string;
  data?: {
    permissions?: string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface ShopRegisterData {
  name?: string;
  [key: string]: unknown;
}

export interface ShopBranchData {
  name?: string;
  owner_id?: string;
  address_id?: string;
  [key: string]: unknown;
}

export interface PreviewOrderItemData {
  description?: string;
  specs?: unknown;
  quantity?: number;
  unit_price?: number;
  product_id?: string;
  [key: string]: unknown;
}

export interface PreviewOrderData {
  items?: unknown[];
  currency_id?: string;
  total?: number;
  [key: string]: unknown;
}

export interface BasePrice {
  currency_id: string;
  list_price: string | number;
  sales_price: string | number;
}

export interface ProductData {
  files?: unknown[];
  delivery_choices?: unknown[];
  is_draft?: boolean;
  supplier_id?: string;
  name?: string;
  description?: string;
  tag_ids?: string[];
  base_prices?: BasePrice[];
  [key: string]: unknown;
}

export interface CustomerOrderData {
  items?: unknown[];
  shipping_address?: unknown;
  subtotal?: number;
  discount?: number;
  refund?: number;
  shipping_handling_cost?: number;
  total?: number;
  currency_id?: string;
  shop_id?: string;
  state?: string;
  status?: string;
  updated_at?: number;
  [key: string]: unknown;
}

export interface WalkinQueueItemData {
  customer_user_id?: string;
  customer_name?: string;
  product_id?: string;
  state?: string;
  status?: string;
  updated_at?: number;
  agent_id?: string;
  [key: string]: unknown;
}

export interface ProductServiceTimeslotData {
  from?: number;
  to?: number;
  n?: number;
  repetition?: string;
  [key: string]: unknown;
}

export interface ProductServiceLocationData {
  branch_id?: string;
  assignee?: unknown;
  time_overhead?: number;
  price_overhead?: number;
  time_slots?: unknown[];
  [key: string]: unknown;
}

export interface AppointmentServiceDeliveryData {
  locations?: unknown[];
  [key: string]: unknown;
}

export interface QueueServiceDeliveryData {
  locations?: unknown[];
  [key: string]: unknown;
}

export interface Price {
  currency_id: string;
  value: number;
}

export interface CartItemData {
  id?: string;
  product_id?: string;
  specifications?: unknown;
  quantity?: number;
  cart_id?: string;
  preferred_currency_id?: string;
  prices?: Price[];
  [key: string]: unknown;
}

export interface StoryEventData {
  name?: string;
  description?: string;
  type?: string;
  time?: number | Date;
  [key: string]: unknown;
}

export interface StoryData {
  events?: unknown[];
  [key: string]: unknown;
}

export interface PaymentTerminalData {
  name?: string;
  type?: string;
  state?: string;
  status?: string;
  data?: unknown;
  [key: string]: unknown;
}

export interface SquareTerminalData {
  device_id?: string;
  pair_code?: string;
  pair_by?: string;
  status?: string;
  paired_at?: number;
  [key: string]: unknown;
}

export interface SocialInfoData {
  is_liked?: boolean;
  is_linked?: boolean;
  n_likes?: number;
  n_links?: number;
  n_comments?: number;
  [key: string]: unknown;
}

export interface NoticeElement {
  read_at?: string | null;
  from_user_id: string;
  id: string;
}

interface FacilitatorData {
  id?: string;
  [key: string]: unknown;
}

interface ClientData {
  id?: string;
  [key: string]: unknown;
}

export interface ProjectData {
  files?: unknown[];
  stages?: unknown[];
  agents?: unknown[];
  story?: unknown;
  is_draft?: boolean;
  visibility?: string;
  name?: string;
  description?: string;
  owner_id?: string;
  creator_id?: string;
  facilitator?: FacilitatorData;
  client?: ClientData;
  tag_ids?: string[];
  state?: string;
  status?: string;
  [key: string]: unknown;
}

export interface ProjectActorData {
  user_id?: string;
  status?: string;
  nickname?: string;
  [key: string]: unknown;
}

export interface ProjectStageData {
  id?: string;
  required_stage_ids?: string[];
  assignee_id?: string;
  [key: string]: unknown;
}

export interface SimpleProjectStageData {
  status?: string;
  type?: string;
  name?: string;
  description?: string;
  comment?: string;
  [key: string]: unknown;
}

export interface NoticeElement {
  read_at?: string | null;
  from_user_id: string;
  id: string;
}

export interface CommentTagData {
  tag_id?: string;
  comment_ids?: Array<{ id: string; type: string }>;
  [key: string]: unknown;
}

export interface RealTimeCommentData {
  type?: string;
  data?: {
    status?: string;
    guestName?: string;
    data?: string;
    [key: string]: unknown;
  } | string;
  [key: string]: unknown;
}

export interface CommentData {
  type?: string;
  data?: unknown;
  from_user_id?: string;
  in_group_id?: string;
  in_group_type?: string;
  [key: string]: unknown;
}

export interface CommentDataWithStatus {
  status?: string;
  guestName?: string;
  data?: string;
}

export interface QuizData {
  stem?: string;
  answers?: string[];
  distractors?: string[];
  [key: string]: unknown;
}

export interface ProposalData {
  author_id?: string;
  community_id?: string;
  type?: string;
  data?: unknown;
  status?: string;
  state?: string;
  updated_at?: number;
  title?: string;
  abstract?: string;
  vote_result?: unknown;
  [key: string]: unknown;
}

interface IconData {
  url?: string;
  [key: string]: unknown;
}

interface ImageData {
  url?: string;
  [key: string]: unknown;
}

export interface CommunityProfileData {
  name?: string;
  description?: string;
  icon?: IconData;
  image?: ImageData;
  creator_id?: string;
  config?: {
    captain_id?: string;
    [key: string]: unknown;
  };
  n_members?: number;
  n_total_coins?: number;
  n_active_coins?: number;
  cash_balance?: number;
  n_proposals?: number;
  [key: string]: unknown;
}

export interface JournalIssueSectionData {
  id?: string;
  item_ids?: Array<{ id: string; type: string }>;
  [key: string]: unknown;
}

export interface JournalConfigTaggedData {
  tag_ids?: string[];
  placeholder?: string;
  [key: string]: unknown;
}

export interface JournalData {
  name?: string;
  description?: string;
  template_id?: string;
  template_data?: unknown;
  [key: string]: unknown;
}

export interface EmptyPostData {
  err_code?: string;
  [key: string]: unknown;
}

export interface FeedArticleData {
  files?: unknown[];
  title?: string;
  content?: string;
  owner_id?: string;
  url?: string;
  [key: string]: unknown;
}

export interface ArticleData extends ArticleBaseData {
  comment_tags?: CommentTagData[];
  reply_to?: { id: string; type: string };
  [key: string]: unknown;
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

export interface FrontPageLayoutConfigData {
  type_id?: string;
  [key: string]: unknown;
}

export interface FrontPageConfigData {
  template_id?: string;
  data?: unknown;
  layout?: { type_id?: string; [key: string]: unknown };
  [key: string]: unknown;
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
  owner?: UserPublicProfile;
  default_theme?: ColorTheme;
  front_page?: FrontPageConfig;
  side_frames?: {
    left?: FrameConfig;
    right?: FrameConfig;
  };
  tags?: Group[];
  roles?: RoleData[];
  groups?: Group[];
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
