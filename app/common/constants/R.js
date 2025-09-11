const R = function() {
  _lang = null;
  _lib = new Map([
    [ "About", {"zh" : "关于"} ],
    [ "Account", {"zh" : "我的账户"} ],
    [ "Activities", {"zh" : "动态"} ],
    [ "Addresses", {"zh" : "地址"} ],
    [ "Agent", {"zh" : "经理"} ],
    [ "Blog", {"zh" : "帖子"} ],
    [ "Basic", {"zh" : "基础"} ],
    [ "Build my own website for free", {"zh" : "免费搭建网站"} ],
    [ "Community", {"zh" : "社区"} ],
    [ "Confirm password", {"zh" : "确认密码"} ],
    [ "Config", {"zh" : "设置"} ],
    [ "Cart", {"zh" : "购物车"} ],
    [ "Chats", {"zh" : "对话"} ],
    [ "Contacts", {"zh" : "联系人"} ],
    [ "Current", {"zh" : "当前"} ],
    [ "domain", {"zh" : "网址"} ],
    [ "Domain", {"zh" : "网址"} ],
    [ "Email address", {"zh" : "电子邮件地址"} ],
    [ "Extras", {"zh" : "更多"} ],
    [ "Exchange", {"zh" : "交易"} ],
    [ "Facilitator", {"zh" : "协理"} ],
    [ "Files", {"zh" : "文件"} ],
    [ "Groups", {"zh" : "群组"} ],
    [ "Global", {"zh" : "全宇宙"} ],
    [ "History", {"zh" : "历史"} ],
    [ "Hosting", {"zh" : "网址服务"} ],
    [ "How to", {"zh" : "帮助"} ],
    [ "Join us", {"zh" : "加入我们"} ],
    [ "last 30 days", {"zh" : "30天内"} ],
    [ "last 7 days", {"zh" : "7天内"} ],
    [ "last 24 hours", {"zh" : "24小时内"} ],
    [ "Login", {"zh" : "登陆"} ],
    [ "Login through gcabin.com", {"zh" : "通过gcabin.com 登陆"} ],
    [ "Market", {"zh" : "市场"} ],
    [ "Messenger", {"zh" : "短信"} ],
    [ "Mine", {"zh" : "我的"} ],
    [ "Me", {"zh" : "我"} ],
    [ "Members", {"zh" : "会员"} ],
    [ "Name server", {"zh" : "名称服务器"} ],
    [ "News", {"zh" : "新闻"} ],
    [ "Notices", {"zh" : "通知"} ],
    [ "Orders", {"zh" : "订单"} ],
    [ "Overview", {"zh" : "概况"} ],
    [ "Password", {"zh" : "密码"} ],
    [ "Profile", {"zh" : "个人资料"} ],
    [ "Proposals", {"zh" : "议程"} ],
    [ "Read and agree to our", {"zh" : "阅读并同意我们的"} ],
    [ "Report", {"zh" : "报告"} ],
    [ "Register", {"zh" : "注册"} ],
    [ "registrars", {"zh" : "提供商"} ],
    [ "Sign-In", {"zh" : "登陆"} ],
    [ "Sign-In to", {"zh" : "登陆到"} ],
    [ "Send reset link", {"zh" : "发送重置链接"} ],
    [ "Settings", {"zh" : "设置"} ],
    [ "Shop", {"zh" : "商店"} ],
    [ "Source link", {"zh" : "原文链接"} ],
    [ "Statistics", {"zh" : "统计"} ],
    [ "Success", {"zh" : "成功"} ],
    [ "Tags", {"zh" : "标签"} ],
    [ "Terms and Conditions", {"zh" : "服务协议和条款"} ],
    [ "Thank you", {"zh" : "谢谢"} ],
    [ "Username", {"zh" : "用户名"} ],
    [ "Unregister", {"zh" : "删除"} ],
    [ "WebConfig", {"zh" : "设置"} ],
    [ "Workshop", {"zh" : "工坊"} ],
    [ "Wallet", {"zh" : "钱包"} ],
    [ "Your domain visits", {"zh" : "您的网站访问记录"} ],
    [ "Your email address", {"zh" : "您的电子邮件地址"} ],
    [ "Your profile visits", {"zh" : "您的名片浏览量"} ],
  ]);

  _textLib =
      new Map(
          [
            [
              "ACK_ACCOUNT_ACTIVATION",
              {"en" : `Success, your account is now ready to use!`}
            ],
            [
              "ACK_DEPOSIT", {
                "en" :
                    `Success! It may take up to a few days to verify and update your balance.`
              }
            ],
            [
              "BLOG_ROLE_EXCLUSIVE", {
                "en" :
                    `Articles written by members on this site are owned by you. Both article author and you can do all the operations on the articles.`
              }
            ],
            [
              "BLOG_ROLE_PARTNERSHIP", {
                "en" :
                    `Articles written by members can be pushed by members to this site as linked articles. Members are the owner of the articles, you have no permission to modify the contents, but you can delete the link.`,
              }
            ],
            [
              "CONFIRM_DELETE_ADDRESS",
              {"en" : `Are you sure to delete address?`}
            ],
            [
              "CONFIRM_DELETE_ARTICLE", {
                "en" :
                    "Are you sure you want to delete article? This operation is not reversable.",
                "zh" : "确定删除吗?本操作不可恢复。"
              }
            ],
            [
              "CONFIRM_DELETE_CHAT", {
                "en" :
                    `Are your sure you want to delete conversation? All messages will be removed from both end, this operation is not reversable.`
              }
            ],
            [
              "CONFIRM_DELETE_MENU_ITEM",
              {"en" : `Are you sure to delete menu?`}
            ],
            [
              "CONFIRM_DELETE_STAGE",
              {"en" : `Are you sure you want to delete stage?`}
            ],
            [
              "CONFIRM_UNREGISTER", {
                "en" :
                    "Are you sure you want to unregister domain? You can only set it back through GCabain account page.",
                "zh" : "确定删除吗?本操作仅可在GCabin主页帐户中恢复。"
              }
            ],
            [
              "CONFIRM_ACCEPT_ROLE", {
                "en" : "Are you sure you want to accept invitation?",
                "zh" : "确定接受邀请吗?"
              }
            ],
            [
              "CONFIRM_REJECT_ROLE", {
                "en" : "Are you sure you want to reject invitation?",
                "zh" : "确定拒绝邀请吗?"
              }
            ],
            [
              "CONFIRM_RESIGN_ROLE", {
                "en" : "Are you sure you want to resign role?",
                "zh" : "确定离开吗?"
              }
            ],
            [
              "CONFIRM_DISMISS_ROLE", {
                "en" : "Are you sure you want to dismiss role?",
                "zh" : "确定解散吗?"
              }
            ],
            [
              "CONFIRM_CANCEL_PROJECT",
              {"en" : `Are you sure you want to cancel project?`}
            ],
            [
              "CONFIRM_ISSUE_COINS",
              {"en" : `How many new coins do you want to issue?`}
            ],
            [
              "CONFIRM_LEAVE_GROUP",
              {"en" : `Are you sure you want to leave this group?`}
            ],
            [
              "CONFIRM_MARK_STAGE_DONE",
              {"en" : `Are you sure to mark stage done?`}
            ],
            [
              "CONFIRM_PAUSE_PROJECT",
              {"en" : `Are you sure you want to pause project?`}
            ],
            [
              "CONFIRM_REOPEN_PROJECT",
              {"en" : `Are you sure you want to reopen project?`}
            ],
            [
              "CONFIRM_UNFOLLOW",
              {"en" : `Are you sure you want to unfollow __NAME__?`}
            ],
            [ "CONFIRM_UNSET_STAGE", {"en" : `Are you sure to unset stage?`} ],
            [
              "CONFIRM_GEN_QUIZ", {
                "en" :
                    `Your existing learning session will be lost, are you sure to continue?`
              }
            ],
            [ "EL_ACCESS_DEVICE", {"en" : "Streaming device access denied."} ],
            [ "EL_API_POST", {"en" : "Failed contact backend."} ],
            /*[
              "E_INVALID_PAGE",
              {"en" : `We are sorry, the page requested does not exist.`}
            ],*/
            [ "EL_CONNECTION_LOST", {"en" : "Connection lost."} ],
            [
              "EL_COVER_IMAGE_REQUIRED",
              {"en" : "Cover image is required for live streaming."}
            ],
            [
              "EL_FILE_UPLOAD_BUSY",
              {"en" : "File are not ready, please submit later."}
            ],
            [ "EL_INVALID_MNEMONIC", {"en" : "Invalid mnemonic words."} ],
            [ "EL_GET_DEVICE", {"en" : "Failed to get streaming devices."} ],
            [ "EL_NO_DEVICE", {"en" : "Streaming device not found."} ],
            [ "EL_PASSWORD_MISMATCH", {"en" : "Password mismatch."} ],
            [
              "EL_NEW_PASSWORD_SAME",
              {"en" : "New password cannot be the same as old password."}
            ],
            [
              "EL_N_MAX_TAG", {
                "en" :
                    `We are sorry, we cannot support more than __N_MAX__ tags yet.`
              }
            ],
            [ "EL_PRICE_REQUIRED", {"en" : `Price is required in product.`} ],
            [
              "EL_INCOMPLETE_PRICE",
              {"en" : `Price settings for __CURRENCY__ is incomplete.`}
            ],
            [
              "EL_INVALID_COLOR", {
                "en" :
                    `Sorry, we currently do not support the color format you provided.`
              }
            ],
            [
              "FORGET_PASS",
              {"en" : "Forgot your password", "zh" : "忘记密码了"}
            ],
            [ "NO_ACCOUNT", {"en" : "No account", "zh" : "没有账户"} ],
            [ "OPEN_WORKSHOP", {"en" : "Open my workshop", "zh" : "启用工坊"} ],
            [ "OPEN_SHOP", {"en" : "Open my shop", "zh" : "启用商店"} ],
            [
              "CLOSE_WORKSHOP_PROMPT",
              {"en" : `Are you sure you want to close workshop?`}
            ],
            [
              "CLOSE_SHOP_PROMPT",
              {"en" : `Are you sure you want to close shop?`}
            ],
            [
              "INTRO_COMPACT_SIZE", {
                "en" :
                    `Compact size is the smallest size we provide, it has minimum information, but maximum number of items visible.`
              }
            ],
            [
              "INTRO_SMALL_SIZE", {
                "en" :
                    `Small size has just enough room to display some content besides the title`
              }
            ],
            [
              "INTRO_MEDIUM_SIZE", {
                "en" :
                    `Medium size has relative balance between information amount and completeness`
              }
            ],
            [
              "INTRO_LARGE_SIZE", {
                "en" :
                    `Large size has the most detailed information for each item, but the total number of items can be displayed in a single page is limited.`
              }
            ],
            [
              "INTRO_BIG_HEAD_SIZE", {
                "en" :
                    `Big head size has emphasize on multi media rather than text.`
              }
            ],
            [ "PROMPT_VOTE", {"en" : `Please chose your vote:`} ],
            [
              "PROMPT_SEND_USER_MESSAGE_REQUIREMENT",
              {"en" : `User must follow you before you can send messages.`}
            ],
            [
              "PROMPT_APPLY_COMMUNITY_MEMBERSHIP",
              {"en" : `Message to stakeholders`}
            ],
            [ "RESET_PASS", {"en" : "Reset password", "zh" : "重置密码"} ],
            [
              "RESET_PASS_SUCCESS", {
                "en" :
                    "An email with password reset link has been sent to your email address, please follow the instructions in the email.",
                "zh" :
                    "一封带有密码重置链接的电子邮件已发送到您的电子邮件地址，请按照电子邮件中的说明进行操作。"
              }
            ],
            [
              "PROXY_LOGIN_PROMPT", {
                "en" :
                    `We are powered by <a href="https://gcabin.com" target="_black">G-Cabin&#x1f517;</a> community.`,
                "zh" :
                    `本网站由 <a href="https://gcabin.com" target="_black">G-Cabin&#x1f517;</a> 社区提供支持。`,
              }
            ],
            [
              "PROXY_MSG_INITING", {
                "en" : "Initializing logging in with server...",
                "zh" : "准备登录环境..."
              }
            ],
            [
              "PROXY_MSG_LOGIN_SUCCESS",
              {"en" : "Login success", "zh" : "登录成功"}
            ],
            [
              "PROXY_MSG_WAITING_LOG_IN", {
                "en" : "Waiting for logging in response...",
                "zh" : "等待登录结果..."
              }
            ],
            [
              "PROXY_MSG_LOGGING_IN",
              {"en" : "Logging in...", "zh" : "正在登录..."}
            ],
            [
              "REGISTER_SUCCESS", {
                "en" : `<h2>Welcome to our family!</h2>
    <p>Please check you email to finish up registration.</p>
    <p>Sometimes it may be in your junk mail.</p>`,
                "zh" : `<h2>欢迎加入我们的大家庭!<h2>
    <p>请查收您的邮件以完成注册。</p>
    <p>有时候可能在您的垃圾邮件里。</p>`
              }
            ],
            [
              "ROLE_APPLICATION_SENT",
              {"en" : `Your application is sent.`, "zh" : "您的请求已发出。"}
            ],
            [
              "RESET_PASSWORD_SUCCESS", {
                "en" : "Success, your new password is ready to use.",
                "zh" : "您的新密码已启用。"
              }
            ],
            [
              "CHANGE_PASSWORD_SUCCESS", {
                "en" : "Success, your new password is ready to use.",
                "zh" : "修改成功,您的新密码已启用。"
              }
            ],
            [
              "GUEST_NICKNAME_PROMPT", {
                "en" : "Hi,<br>Please type in a nickname:",
                "zh" : "请输入您的昵称:"
              }
            ],
            [ "GUEST_CONTACT_PROMPT", {"en" : "Contact:", "zh" : "联系方式:"} ],
            [
              "LOGIN_BEFORE_LIKE", {
                "en" : "Login is required to post likes.",
                "zh" : "本操作需要登录。"
              }
            ],
            [
              "LOGIN_BEFORE_LINK", {
                "en" : "Login is required to do quote or reposts.",
                "zh" : "本操作需要登录。"
              }
            ],
            [
              "HOSTING_MSG_TITLE", {
                "en" : "Owning your website can never be easier:",
                "zh" : "两步轻松建立网站:"
              }
            ],
            [
              "HOSTING_MSG_FOOTNOTE", {
                "en" : "Domain names needs to be purchased through domain name",
                "zh" : "您的网址需要自行购买。"
              }
            ],
            [
              "PARK_DOMAIN", {
                "en" : "Park your __DOMAIN__* in account panel.",
                "zh" : "告诉我们您的__DOMAIN__*"
              }
            ],
            [
              "TIP_DOMAIN", {
                "en" :
                    `<p>A domain name is your website name, it is the address where Internet users can access your website. A domain name is used for finding and identifying computers on the Internet. Computers use IP addresses, which are a series of number.</p>
    <p>You can purchase a domain from one of many domain registrars, here are a few examples: </p>
    <p><a href="https://domains.google" target="_blank" rel="noopener noreferrer">Google domains&#x1f517;</a></p>
    <p><a href="https://www.domain.com" target="_blank" rel="noopener noreferrer">Domain.com&#x1f517;</a></p>
    <p><a href="https://www.bluehost.com" target="_blank" rel="noopener noreferrer">Bluehost&#x1f517;</a></p>`,
                "zh" :
                    `<p>域名是您的网站名称，是互联网用户可以访问您网站的地址。 域名用于查找和识别 Internet 上的计算机。 计算机使用 IP 地址，这是一串数字。</p>
    <p>您可以从许多域名注册商之一购买域名，这里有几个例子: </p>
    <p><a href="https://domains.google" target="_blank" rel="noopener noreferrer">Google domains&#x1f517;</a></p>
    <p><a href="https://www.domain.com" target="_blank" rel="noopener noreferrer">Domain.com&#x1f517;</a></p>
    <p><a href="https://www.bluehost.com" target="_blank" rel="noopener noreferrer">Bluehost&#x1f517;</a></p>`
              }
            ],
            [
              "TIP_NAME_SERVER", {
                "en" :
                    `<p>A name server refers to the server component of the Domain Name System (DNS), one of the two principal namespaces of the Internet. The most important function of DNS servers is the translation (resolution) of human-memorable domain names (example.com) and hostnames into the corresponding numeric Internet Protocol (IP) addresses (93.184.216.34), the second principal name space of the Internet which is used to identify and locate computer systems and resources on the Internet.</p> 
    <p>Name server(NS records) settings are provided in domain management page of your domain registrar.</p>`,
                "zh" :
                    `<p>域名服务器是指域名系统 (DNS) 的服务器组件，它是 Internet 的两个主要命名空间之一。 DNS 服务器最重要的功能是将人类可记忆的域名 (example.com) 和主机名翻译（解析）为相应的数字互联网协议 (IP) 地址 (93.184.216.34)，互联网的第二主要名称空间 用于识别和定位 Internet 上的计算机系统和资源。</p> 
    <p>名称服务器（NS 记录）设置在您的域注册商的域管理页面中提供。</p>`
              }
            ],
            [
              "TIP_LIVE_STREAM", {
                "en" :
                    `<p>There are many ways to do live streaming, including desktop softwares and smartphone apps.</p>
  <p>A popular professional software is <a href="https://obsproject.com" target="_blank">Open Broadcaster Software(OBS)&#x1f517;</a>, where you can start your studio and even invite friends when combining with NDI friendly video calls like Skype.</p>`,
                "zh" :
                    `<p>进行直播的方式有很多种，包括桌面软件和智能手机应用程序。</p>
  <p>一个流行的专业软件是 <a href="https://obsproject.com" target="_blank">Open Broadcaster Software(OBS)&#x1f517;</a>，您可以在其中开始您的工作室，甚至可以在合并时邀请朋友 与 NDI 友好的视频通话，如Skype。</p>`
              }
            ],
            [
              "TERM_REGISTER", {
                "en" : `<h3>Terms and conditions</h3>
  <ol>
    <li>Blog ownership is web owner, whom should take legal responsibilities of their posts. Including reposts and quotes. We reserve the rights to delete illegal posts only at extreme conditions. Which means most of the time, we won’t delete posts even it’s illegal because the responsibility is at the web owner side. </li>
    <li>As the nature of software, we cannot eliminate bugs. As a result, we cannot guarantee data safety, but we will try our best.</li>
    <li>“Private” posts/communications are not fully private as our development bugs may cause leak. We will try our best to prevent it.</li>
    <li>Digital coins are for fun only, don’t take it seriously.</li>
    <li>We reserve the rights to suspend accounts, but we are very aware of the negative impact to our reputation. We will try our best to only use the rights at extreme conditions for self defense purposes.</li>
    <li>We do take full responsibility of payment/fund transaction related errors for our users’ financial security.</li>
    <li>User icons is supposed to be uniquely identifiable. In case of similarities between users, we have limited ability to detect them automatically. As disputes arises, we reserve the rights to remove similar icons based on our own judgements. We do provide two icon choices for each element.</li>
    <li>This terms and conditions is only a draft, we reserve the rights to change at any time without notification until we went through it with lawyers later.</li>
  </ol>`,
                "zh" : `<h3>条款和条件</h3>
   <ol>
     <li>博客所有权为网络所有者，应对其帖子承担法律责任。 包括转发和引用。 我们保留仅在极端情况下删除非法帖子的权利。 这意味着大多数时候，即使是非法的帖子，我们也不会删除，因为责任在网站所有者一方。 </li>
     <li>由于软件的本质，我们无法消除错误。 因此，我们无法保证数据安全，但我们会尽力而为。</li>
     <li>“私人”帖子/通讯并非完全私人，因为我们的开发错误可能会导致泄露。 我们会尽力阻止它。</li>
     <li>数字货币仅供娱乐，请勿当真。</li>
     <li>我们保留暂停帐户的权利，但我们非常清楚这对我们声誉的负面影响。 我们将尽力仅在极端条件下使用这些权利用于自卫目的。</li>
     <li>为了用户的财务安全，我们对与付款/资金交易相关的错误承担全部责任。</li>
     <li>用户图标应该是唯一可识别的。 如果用户之间存在相似性，我们自动检测它们的能力有限。 如有争议，我们保留根据自己的判断删除类似图标的权利。 我们确实为每个元素提供了两个图标选择。</li>
     <li>此条款和条件只是一个草案，我们保留随时更改的权利，恕不另行通知，直到我们稍后与律师讨论。</li>
   </ol>`
              }
            ],
            [
              "ADD_IDOL_HINT", {
                "en" : "Search people or paste RSS feed url",
                "zh" : "搜索用户或粘贴RSS信息源"
              }
            ],
            [ "ADD_WEB3_IDOL_HINT", {"en" : "Search user", "zh" : "搜索用户"} ],
            [
              "Q_ARTICLE_BASIC", {
                "en" :
                    `You have reached blog basic quota (__QUOTA__ blog posts within __TIME__), you will be able to write new posts after __FREEZE_TIME__. You can also __UPGRADE_BTN__ your account to increase quota significantly.`,
                "zh" :
                    `您已达到发文上限（__TIME__内__QUOTA__个），您将可以在__FREEZE_TIME__后发表新的文章，您也可以通过__UPGRADE_BTN__账户大幅提高上限。`
              }
            ],
            [
              "Q_JOURNAL_ISSUE_BASIC", {
                "en" :
                    `You have reached blog basic quota (__QUOTA__ journal issues within __TIME__), you will be able to create new issues after __FREEZE_TIME__. You can also __UPGRADE_BTN__ your account to increase quota significantly.`,
                "zh" :
                    `您已达到发期刊上限（__TIME__内__QUOTA__个），您将可以在__FREEZE_TIME__后发表新的期刊，您也可以通过__UPGRADE_BTN__账户大幅提高上限。`
              }
            ],
            [
              "Q_PROJECT_BASIC", {
                "en" :
                    `You have reached project basic quota (__QUOTA__ workshop projects within __TIME__), you will be able to create new projects after __FREEZE_TIME__. You can also __UPGRADE_BTN__ your account to increase quota significantly.`,
                "zh" :
                    `您已达到创建项目上限（__TIME__内__QUOTA__个），您将可以在__FREEZE_TIME__后创建新的项目，您也可以通过__UPGRADE_BTN__账户大幅提高上限。`
              }
            ],
            [
              "Q_PRODUCT_BASIC", {
                "en" :
                    `You have reached product listing basic quota (__QUOTA__ products within __TIME__), you will be able to create new products after __FREEZE_TIME__. You can also __UPGRADE_BTN__ your account to increase quota significantly.`,
                "zh" :
                    `您已达到添加商品上限（__TIME__内__QUOTA__个），您将可以在__FREEZE_TIME__后添加新的商品，您也可以通过__UPGRADE_BTN__账户大幅提高上限。`
              }
            ],
            [
              "Q_PROPOSAL_BASIC", {
                "en" :
                    `You have reached proposal basic quota (__QUOTA__ proposals within __TIME__), you will be able to create new proposals after __FREEZE_TIME__. You can also ask your community owner to __UPGRADE_BTN__ the account to increase quota significantly.`,
                "zh" :
                    `您已达到提议上限（__TIME__内__QUOTA__个），您将可以在__FREEZE_TIME__后发起新的议题，您也可以通过__UPGRADE_BTN__账户大幅提高上限。`
              }
            ],
            [
              "Q_GROUP_BASIC", {
                "en" :
                    `You have reached create group basic quota (__QUOTA__ groups within __TIME__), you will be able to create new groups after __FREEZE_TIME__. You can also __UPGRADE_BTN__ your account to increase quota significantly.`,
                "zh" :
                    `您已达到创建群组上限（__TIME__内__QUOTA__个），您将可以在__FREEZE_TIME__后创建新的群组，您也可以通过__UPGRADE_BTN__账户大幅提高上限。`
              }
            ],
            [
              "Q_MESSENGER_BASIC", {
                "en" :
                    `You have reached messenger basic quota (__QUOTA__ messages within __TIME__), you will be able to send new messages after __FREEZE_TIME__. You can also __UPGRADE_BTN__ your account to increase quota significantly.`,
                "zh" :
                    `您已达到发信息上限（__TIME__内__QUOTA__个），您将可以在__FREEZE_TIME__后发送新的消息，您也可以通过__UPGRADE_BTN__账户大幅提高上限。`
              }
            ],
            [
              "Q_LIVE_STREAM", {
                "en" :
                    `You have reached live stream quota(__QUOTA__ livestreams within __TIME__), you will be able to start new livestreams after __FREEZE_TIME__. You can also __UPGRADE_BTN__ your account to increase quota significantly.`,
                "zh" :
                    `您已达到直播上限（__TIME__内__QUOTA__个），您将可以在__FREEZE_TIME__后开始新的直播，您也可以通过__UPGRADE_BTN__账户大幅提高上限。`
              }
            ],
            [
              "Q_ADD_FEED", {
                "en" :
                    `You have reached add feed quota(__QUOTA__ feeds within __TIME__), you will be able to add new feeds after __FREEZE_TIME__. You can also __UPGRADE_BTN__ your account to increase quota significantly.`,
                "zh" :
                    `您已达到添加RSS源的上限（__TIME__内__QUOTA__个），您将可以在__FREEZE_TIME__后添加新的RSS源，您也可以通过__UPGRADE_BTN__账户大幅提高上限。`
              }
            ],
            [
              "NO_SERVICE_LOCATION_AVAILABLE", {
                "en" :
                    "We are sorry, all locations are not at service now, please come back later.",
                "zh" : "我们很抱歉,目前没有正在营业的分店"
              }
            ],
            [
              "OUT_OF_SERVICE", {
                "en" :
                    "We are sorry, we are out of service, please come back later",
                "zh" : "我们很抱歉，目前无法为新客户提供服务，请稍后再来。"
              }
            ],
            [ "TERM_ICON", {"en" : "", "zh" : ""} ],
          ]);

  function _translate(name) {
    let d = _lib.get(name);
    if (d && (_lang in d)) {
      return d[_lang];
    }
    return name;
  }

  function _get(key) {
    let d = _textLib.get(key);
    if (d) {
      if (_lang in d) {
        return d[_lang];
      } else if ("en" in d) {
        return d["en"];
      }
    }
    return key;
  }

  function _setLanguage(lang) { _lang = lang; }

  return {
    t : _translate,
    get : _get,
    setLanguage : _setLanguage,
  };
}();
