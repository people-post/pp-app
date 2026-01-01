export class RemoteError {
  // Synced with backend
  static T_TYPE = {
    USER : "USR",
    LIMIT: "LMT",
    QUOTA: "QTA",
    DEV: "DEV",
    CONN: "CONN", // This is local, not in sync
  };

  // Synced with backend
  static T_USER = {
    E_LOGIN_INFO : "Incorrect username or password, please try again",
    E_ACCOUNT_LOCKED:
        "Account locked, please check your email for unlocking or contact customer support",
    E_EMAIL_IN_USE: "Email already registered",
    E_INVALID_EMAIL: "Invalid email address",
    E_TEMP_LOCK: "Account locked, please try again in __TIME__",
    E_LOGIN_FREEZE:
        "Incorrect username or password, please try again in __TIME__",
    E_LOGIN_REQUIRED: "Login required",
    E_OWNER_REQUIRED: "Website owner required",
    E_EMAIL_NOT_EXIST: "Email not exist",
    E_INVALID_DOMAIN: "Invalid domain name",
    E_INVALID_NAME_SERVERS:
        "Sorry, the name servers are not setup correctly, please follow the instructions to setup name servers, notice that it may take some time before your change takes effect.",
    E_DOMAIN_IN_USE: "Domain already registered by another account",
    E_PROXY_LOGIN_CANCELLED: "Login was cancelled by user",
    E_ACTIVATION_CODE_ERROR:
        "Your activation code is invalid, please register one more time.",
    E_ACTIVATION_CODE_EXPIRED: "Your activation code has expired.",
    E_INPUT_MISSING: `Following items are missing: __MISSING__`,
    E_NAME_IN_USE: `The name you provided is already in use.`,
    E_LIVE_STREAM_ACTIVE: `You already have an ongoing live stream.`,
    E_HOST_MSG: `__MSG__`,
    E_FORM_VALUE_TYPE: `__NAME__ must be a __TYPE__, but got __VALUE__`,
    E_DATE_TIME_RANGE: `__NAME__ cannot be __TYPE__ than __VALUE__`,
    E_INVALID_FEED_URL: `Invalid feed source`,
  };

  // Synced with backend
  static T_LIMIT = {
    E_LIMIT_REACHED : "Limit reached",
    E_STREAM_SERVER_ERROR: "Oops, we are in trouble.",
    E_STREAM_SERVER_LIMIT_REACHED: "Oops, we are out of capacity",
    E_FATAL_ERROR: "Oops, we've got a serious bug",
    E_LOGIC_FLAW: "Somthing is wrong on server",
    E_SERVICE_DOWN:
        "We are sorry, the service you requested is currently unavailable, please try again later.",
  };

  static T_DEV = "Oops, we are in trouble, this is an invalid usage";
  static T_CONN = "Failed to receive response from server";
};
