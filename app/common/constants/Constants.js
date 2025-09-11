(function(C) {
C.MAX = {
  N_TAGS : 64,
  N_TAGS_PER_ITEM : 7,
  N_ROLES : 7,
  N_TEAMS : 7,
  N_MENU_ITEMS : 7,
  N_AGENTS : 7,
};

C.PATH = {
  STATIC : "/static",
  FLAGS : "/static/img/flags",
};

C.STORAGE = {
  KEY : {PROFILE : "profile", KEYS : "keys"}
};

C.STATE = {
  NEW : "NEW",
  ACTIVE : "ACTIVE",
  ONHOLD : "ONHOLD",
  FINISHED : "FINISHED",
  STATUS : {F_DONE : "DONE", F_FAILED : "FAILED"}
};

C.VIS = {
  PUBLIC : "PUBLIC",
  CONFIDENTIAL : "CONFIDENTIAL",
  PROTECTED : "RESTRICTED",
  PRIVATE : "PRIVATE",
};

C.URL_PARAM = {
  USER : "u",
  SECTOR : "sector",
  LANGUAGE : "lang",
  PAGE : "page", // Internal param dynamically generated for Extras view and
                 // page in LvSub.
  BRANCH : "b",
  REGISTER : "r",
  CODE : "code",               // For account activation and reset password
  FROM_DOMAIN : "from_domain", // For proxy login
  TOKEN : "token",             // For proxy login
  KEY : "key",                 // For search
};

C.URL_PARAM_ADDON_VALUE = {
  CART : "cart",
};

C.ID = {
  SECTOR : {
    // Sector id used in url
    FRONT_PAGE : "FRONT_PAGE", // Synced with backend
    BLOG : "BLOG",             // Synced with backend
    WORKSHOP : "WORKSHOP",     // Synced with backend
    SHOP : "SHOP",             // Synced with backend
    EXTRAS : "extras",         // Below are only used in frontend
    QUEUE : "queue",
    COUNTER : "counter",
    SCHOOL : "school",
    COMMUNITY : "community",
    EXCHANGE : "exchange",
    EMAIL : "email",
    ACCOUNT : "account",
    ABOUT : "about",
    PROFILE : "profile",
    MESSENGER : "messenger",
    CAREERS : "careers",
    HOSTING : "hosting",
    GUEST_HOSTING : "g_hosting",
    ORDERS : "orders",
    WEB_CONFIG : "config",
    LOGIN : "login",             // Fake, synced with backend
    ACTIVATION : "activation",   // Fake, synced with backend and customer email
    RESET_PASS : "passwd_reset", // Fake, synced with backend and customer email
    GADGET : "gadget",           // Fake, used by gadget page, can be improved?
  },
};

C.TYPE = {
  WINDOW : {
    WEB3 : "WEB3",
    MAIN : "MAIN",
    GADGET : "GADGET",
    SUB : "SUB",
    PORTAL : "PORTAL",
  },
  TOKEN = {
    LOGIN : "login",
  },
};

C.CHANNEL = {
  COMMENT : "__COMMENT",
  GROUP_MSG : "__GROUP_MSG",
  USER_INBOX : "__USER_INBOX",
};

C.STUN_URLS = [
  "stun:iphone-stun.strato-iphone.de:3478", "stun:numb.viagenie.ca:3478",
  //"stun:stun.12connect.com:3478",
  //"stun:stun.12voip.com:3478",
  //"stun:stun.1und1.de:3478",
  //"stun:stun.3cx.com:3478",
  //"stun:stun.acrobits.cz:3478",
  //"stun:stun.actionvoip.com:3478",
  //"stun:stun.advfn.com:3478",
  //"stun:stun.altar.com.pl:3478",
];
}(window.C = window.C || {}));
