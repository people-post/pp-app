export const T_DATA = {
  HOSTING_STATUS : Symbol(),
  ADDON_SCRIPT : Symbol(),
  SERVICE_QUEUE_SIZE : Symbol(),
  BLOG_CONFIG : Symbol(),
  WORKSHOP_CONFIG : Symbol(),
  SHOP_CONFIG : Symbol(),
  SHOP_ADDRESS_LABELS : Symbol(),
  SHOP_BRANCH_LABELS : Symbol(),
  SHOP_BRANCH : Symbol(),
  SHOP_REGISTER : Symbol(),
  PAYMENT_TERMINAL : Symbol(),
  GLOBAL_COMMMUNITY_PROFILE : Symbol(),
  COMMUNITY_PROFILE : Symbol(),
  MENUS : Symbol(),
  GROUPS : Symbol(),
  HASHTAGS : Symbol(),
  MESSAGES : Symbol(),
  CURRENCIES : Symbol(),
  ASSET : Symbol(),
  SOCIAL_INFO : Symbol(),
  USER_PROFILE : Symbol(),         // For currently logged in user
  USER_PUBLIC_PROFILES : Symbol(), // For all users, in web2
  USER_PUBLIC_PROFILE : Symbol(),  // For all users, in web3
  USER_IDOLS : Symbol(),           // Currently only web3
  USER_INBOX_SIGNAL : Symbol(),
  USER_ADDRESS_IDS : Symbol(),
  DRAFT_ORDERS : Symbol(),
  ADDRESS : Symbol(),
  JOURNAL : Symbol(),
  DRAFT_ARTICLE : Symbol(),
  POST : Symbol(),
  NEW_OWNER_POST : Symbol(),
  DRAFT_ARTICLE_IDS : Symbol(),
  POST_IDS : Symbol(), // Unclear signal, currently only happens when dba.Blog
                       // data reset
  QUIZ : Symbol(),
  QUIZ_IDS : Symbol(),
  EMAIL : Symbol(),
  EMAIL_IDS : Symbol(),
  PROJECT : Symbol(),
  PRODUCT : Symbol(),
  PROPOSAL : Symbol(),
  VOTE : Symbol(),
  SUPPLIER_ORDER : Symbol(),
  CUSTOMER_ORDER : Symbol(),
  OGP : Symbol(),
  LOGIN_RESULT : Symbol(),
  WALKIN_QUEUE_ITEMS : Symbol(),
  WALKIN_QUEUE_ITEM : Symbol(),
  KEY_UPDATE : Symbol(),
};

export const T_ACTION = {
  LOGIN : Symbol(),
  ACCOUNT_UPGRADE : Symbol(),
  LOGIN_SUCCESS : Symbol(),
  PROXY_LOGIN_SUCCESS : Symbol(),
  SHOW_BLOG_ROLES : Symbol(),
  SHOW_USER_INFO : Symbol(),
  SHOW_GROUP_INFO : Symbol(),
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.plt = window.plt || {};
  window.plt.T_DATA = T_DATA;
  window.plt.T_ACTION = T_ACTION;
}
