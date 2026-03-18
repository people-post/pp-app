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
  created_at?: number;
  _created_at?: Date;
}

export interface TimeClockData {
  t_current?: number;
  created_at?: number;
  _created_at?: Date;
}

interface MessageData {
  id: string;
  from_user_id: string;
  in_group_id: string | null;
  data: unknown;
  type: string;
  created_at?: number;
  _created_at?: Date;
}

export interface MessageThreadData {
  from_id: string;
  from_id_type: string;
  n_unread: number;
  is_unread_overflow: boolean;
  latest?: MessageData | null;
}

export interface UserRequestData {
  id: string;
  category: string;
  sector_ids: string[];
  from_user_id: string;
  to_user_id: string | null;
  target_group_id: string | null;
  message: string | null;
}

export interface WorkshopTeamData {
  status?: string;
  data?: {
    permissions: string[];
  };
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
    allowed_tag_ids: string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface VoteData {
  id: string;
  item_id: string;
  user_id: string;
  value: string | null;
}

export interface VisitSummaryData {
  name: string;
  total: number;
  sub_query_key: string | null;
  sub_query_value: string | null;
}

interface Ballot {
  count: number;
  weight: number;
}

interface BallotConfig {
  total: number;
  threshold: number;
}

interface BallotItem {
  value: string;
  ballot: BallotConfig;
}

export interface VotingSummaryData {
  config: BallotConfig;
  items: BallotItem[];
}

interface FrozenItemData {
  id: string;
  description: string;
}

interface FrozenProductData extends FrozenItemData {
  specs: FrozenItemData[];
  unit_price: number;
  quantity: number;
}

export interface SupplierOrderItemData {
  product: FrozenProductData;
  events: HistoryEventData[];
  delivery_price: number;
  quantity_returned: number;
  total_refund: number;
  state: string;
  status: string;
}

interface SupplierOrderBaseData {
  id: string;
  currency_id: string;
  items: SupplierOrderItemData[];
  subtotal: number;
  shipping_handling_cost: number;
  discount: number;
  refund: number;
  total: number;
  extra_price: number;
  extra_refund: number;
  events: HistoryEventData[];
  state: string;
  status: string;
  created_at: number;
  _created_at: Date;
  updated_at: number;
}

export interface SupplierOrderPrivateData extends SupplierOrderBaseData {
  customer_id: string;
  transactions: unknown[];
  total_payment: number;
}

export interface CustomerOrderData {
  id: string;
  shop_id: string | null;
  currency_id: string;
  subtotal: number;
  shipping_handling_cost: number;
  refund: number;
  discount: number;
  total: number;
  total_payment: number;
  items: unknown[];
  updated_at: number;
  state: string | null;
  status: string | null;
  events: HistoryEventData[];
  created_at: number;
  _created_at: Date;
  shipping_address?: unknown;
}

export interface ShopTeamData {
  status?: string;
  data?: {
    permissions: string[];
  };
  [key: string]: unknown;
}

export interface ShopRegisterData {
  id: string;
  branch_id: string;
  name: string;
}

export interface ShopBranchData {
  id: string;
  name: string | null;
  owner_id: string;
  address_id: string | null;
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
  id: string;
  supplier_id: string | null;
  name: string | null;
  delivery_choices: unknown[];
  description: string | null;
  tag_ids: string[];
  files: unknown[];
  spec_ids: string[];
  base_prices: BasePrice[];
  created_at: number;
  _created_at: Date;
  is_draft?: boolean; // Not from backend
}

export interface WalkinQueueItemData {
  id: string;
  product_id: string | null;
  branch_id: string | null;
  customer_user_id: string | null;
  customer_name: string | null;
  state: string | null;
  status: string | null;
  created_at: number;
  _created_at: Date;
  updated_at: number;
  agent_id?: string; // Not in backend?
}

export interface ProductServiceTimeslotData {
  from: number;
  to: number;
  n: number;
  repetition: string;
}

export interface ProductServiceLocationData {
  price_overhead: number;
  time_overhead: number;
  branch_id: string | null;
  time_slots?: ProductServiceTimeslotData[];
  assignee?: unknown;  // Not in backend?
}

export interface AppointmentServiceDeliveryData {
  description: string | null;
  locations: ProductServiceLocationData[];
}

export interface QueueServiceDeliveryData {
  description: string | null;
  locations: ProductServiceLocationData[];
}

export interface Price {
  currency_id: string;
  value: number;
}

export interface CartItemData {
  id: string;
  product_id: string;
  cart_id: string | null;
  quantity: number;
  preferred_currency_id: string | null;
  prices: Price[];
  specifications: unknown[];
}

interface HistoryEventData {
  name: string | null;
  time: number;
}

export interface StoryEventData {
  type: string;
  name: string | null;
  description: string | null;
  time: number;
}

export interface StoryData {
  events: StoryEventData[];
}

export interface PaymentTerminalData {
  id: string;
  register_id: string | null;
  name: string | null;
  type: string | null;
  data: unknown;
  state: string | null;
  status: string | null;
}

export interface SquareTerminalData {
  pair_code: string | null;
  device_id: string | null;
  pair_by: string | null;
  paired_at: number | null;
  status: string | null;
}

export interface SocialInfoData {
  id: string;
  is_liked: boolean;
  is_linked: boolean;
  n_likes: number;
  n_links: number;
  n_comments: number;
}

export interface NoticeElement {
  id: string;
  from_user_id: string;
  type: string | null;
  sub_type: string | null;
  subject_id: string;
  read_at: number | null;
}

export interface ProjectActorData {
  user_id: string;
  nickname: string | null;
  status: string | null;
}

interface ProjectStageTriggerData {
  type: string;
  for_group_id: string;
  target_action: string | null;
}

interface ProjectStageBaseData {
  id: string;
  type: string | null;
}

export interface ProjectBuiltInStageData extends ProjectStageBaseData {
  name: string | null;
  description: string | null;
  assignee_id: string | null;    // Diverged from backend
  required_stage_ids: string[];
  triggers: ProjectStageTriggerData[];
}

export interface SimpleProjectStageData extends ProjectBuiltInStageData {
  status: string | null;
  comment: string | null;
}

export interface ProjectData {
  id: string;
  owner_id: string;
  creator_id: string | null;
  facilitator_id: string | null;
  agents: ProjectActorData[];
  client: ProjectActorData | null;
  name: string | null;
  description: string | null;
  visibility: string | null;
  tag_ids: string[];
  state: string | null;
  status: string | null;
  files: RemoteFileData[];
  created_at: number;
  _created_at: Date;
  stages: Array<SimpleProjectStageData>;
  story?: StoryData;
  is_draft?: boolean; // This is not from backend
}

export interface NoticeElement {
  read_at?: string | null;
  from_user_id: string;
  id: string;
}

export interface CommentTagData {
  tag_id: string;
  comment_ids: SocialItemId[];
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
  id: string;
  source_type: string | null;
  owner_id: string | null;
  from_user_id: string | null;
  in_group_id: string | null;
  in_group_type: string | null;
  type: string | null;
  data: unknown;
  created_at: number;
  _created_at: Date;
}

export interface CommentDataWithStatus {
  status?: string;
  guestName?: string;
  data?: string;
}

export interface QuizData {
  id: string;
  stem: string | null;
  distractors: string[];
  answers: string[];
}

export interface ProposalData {
  id: string;
  type: string | null;
  title: string | null;
  abstract: string | null;
  author_id: string | null;
  community_id: string | null;
  data: unknown;
  state: string | null;
  status: string | null;
  vote_result: VotingSummaryData;
  created_at: number;
  _created_at: Date;
  updated_at: number;
}

interface TributeData {
  type: string | null;
  data: unknown;
}

interface CommunityProfileConfigData {
  captain_id: string | null;
  n_join_approvals: number;
  member_profit_share: number;
  voting_threshold: number;
  days_to_expire: number;
  tribute: TributData;
}

export interface CommunityProfileData {
  id: string;
  creator_id: string | null;
  name: string | null;
  description: string | null;
  icon: RemoteFileData | null;
  image: RemoteFileData | null;
  n_members: number;
  n_active_coins: number;
  n_total_coins: number;
  n_proposals: number;
  cash_balance: number;
  config: CommunityProfileConfigData;
}

export interface JournalIssueSectionData {
  id: string | null;
  item_ids: SocialItemId[];
}

export interface JournalConfigTaggedData {
  tag_ids: string[];
  placeholder: string | null;
}

export interface JournalData {
  id: string;
  owner_id: string | null;
  name: string | null;
  description: string | null;
  template_id: string | null;
  template_data?: unknown;
}

export interface EmptyPostData {
  err_code: string | null;
}

export interface FeedArticleData {
  id: string;
  source_type: string | null;
  owner_id: string | null;
  title: string | null;
  content: string | null;
  files: RemoteFileData[];
  url: string | null;
  created_at: number;
  _created_at: Date;
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
  id: string;
  source_type: string | null;
  owner_id: string | null;
  author_id: string | null;
  link_type: string | null;
  title: string | null;
  content: string | null;
  created_at: number;
  _created_at: Date;
  updated_at: number;
  files: RemoteFileData[];
  tag_ids: string[];
  visibility: string | null;
  status: string | null;
  link_to: string | null;
  attachments?: RemoteFileData[];

  // TODO: Draft only
  publish_mode?: string;
  author_tag_ids?: string[];
  author_new_tag_names?: string[];
  new_tag_names?: string[];
  classification?: string;
  [key: string]: unknown;
}

export interface ArticleData extends ArticleBaseData {
  reply_to: SocialItemId | null;
  hashtag_ids: string[];
  comment_tags: CommentTagData[];
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
