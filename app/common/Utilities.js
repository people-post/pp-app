const Utilities = function() {
  function _isOrderReferenceId(key) {
    return key.length == 27 && key.indexOf('ORD') == 0;
  }

  function _escapeHtml(unsafe) {
    return unsafe.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
  }

  function _getVisibilityClassName(visibility) {
    switch (visibility) {
    case C.VIS.PRIVATE:
      return "private";
    case C.VIS.PROTECTED:
      return "protected";
    case C.VIS.CONFIDENTIAL:
      return "restricted";
    default:
      return "public";
    }
  }

  function _genRandomString(length) {
    let s = '';
    let chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let n = chars.length;
    for (let i = 0; i < length; i++) {
      s += chars.charAt(Math.floor(Math.random() * n));
    }
    return s;
  }

  function forceRedraw() {
    let e;
    if (typeof (Event) === "function") {
      e = new Event("resize");
    } else {
      // For IE
      e = document.createEvent("Event");
      e.initEvent("resize", true, true);
    }
    window.dispatchEvent(e);
  }

  function _renderSmartTime(t) {
    let dt = Math.abs(t - Date.now()) / 1000;
    // Unit is seconds
    if (dt > glb.env.getSmartTimeDiffThreshold()) {
      return t.toLocaleString(
          [], {month : "numeric", day : "numeric", year : "2-digit"})
    } else {
      return ext.Utilities.timeDiffShortString(dt)
    }
  }

  function _renderTimeDiff(t1, t2 = null, isMs = true, isShortString = true) {
    let dt = Math.abs(t1 - (t2 ? t2 : Date.now()));
    if (isMs) {
      dt = dt / 1000;
    }
    return isShortString ? ext.Utilities.timeDiffShortString(dt)
                         : ext.Utilities.timeDiffString(dt);
  }

  function _getTopLevelDomain() {
    let name = window.location.hostname;
    if (name.indexOf("www.") == 0) {
      name = name.replace("www.", "");
    }
    return name;
  }

  function _renderSvgIcon(tIcon, stroke, fill) {
    let s = tIcon;
    s = s.replace(/__C_STROKE__/g, stroke ? stroke : "");
    s = s.replace(/__C_FILL__/g, fill ? fill : "");
    return s;
  }

  function _renderSvgFuncIcon(tIcon, isInverse = false) {
    if (isInverse) {
      return _renderSvgIcon(tIcon, "s-csecondarystk", "s-csecondaryfill");
    }
    return _renderSvgIcon(tIcon, "s-cfuncstk", "s-cfuncfill");
  }

  function _renderSvgMenuIcon(tIcon) {
    return _renderSvgIcon(tIcon, "s-cmenustk", "s-cmenufill");
  }

  function _renderSmallButton(actionId, id, name, className = "s-primary") {
    let s =
        `<span class="button-like small __CLASS_NAME__" onclick="javascript:G.action(__ACTION_ID__, '__ID__')">__NAME__</span>`;
    s = s.replace("__ACTION_ID__", actionId);
    s = s.replace("__NAME__", name);
    s = s.replace("__ID__", id);
    s = s.replace("__CLASS_NAME__", className);
    return s;
  }

  function _stringCompare(sa, sb) {
    if (sa < sb) {
      return -1;
    }
    if (sa > sb) {
      return 1;
    }
    return 0;
  }

  function _renderContent(s) {
    // Render with hashtag detection
    if (!s) {
      return "";
    }
    // Safari has issue with lookbehind, workaround needed...
    let btn1 =
        `$1<a class="hashtag" href="javascript:void(0)" onclick="G.action(ui.CR_VIEW_FRAME.ON_SEARCH, '$2')">$2</a>`;
    s = s.replace(/([ >\w!\p{L}]{1})(#[\w!\p{L}]{2,32})/gu, btn1);
    // Second times for # right after first match
    s = s.replace(/([ >\w!\p{L}]{1})(#[\w!\p{L}]{2,32})/gu, btn1);
    let btn2 =
        `<a class="hashtag" href="javascript:void(0)" onclick="G.action(ui.CR_VIEW_FRAME.ON_SEARCH, '$&')">$&</a>`;
    s = s.replace(/^(#[\w!\p{L}]{2,32})/gu, btn2);
    return s;
  }

  function _renderPrice(currency, value) {
    if (value || value == 0) {
      let s = `<span class="num-font">__SYMBOL__&nbsp;__VALUE__</span>`;
      s = s.replace("__SYMBOL__", __renderCurrencyIcon(currency));
      let v = Math.round(value * 100) / 100.0;
      s = s.replace("__VALUE__", v.toString());
      return s;
    } else {
      return "N/A";
    }
  }

  function __renderCurrencyIcon(c) {
    if (!c) {
      return "...";
    }

    // Try symbol first
    let symbol = c.getSymbol();
    if (symbol) {
      // $ has special meaning when replace strings
      return symbol.replace("$", "&#36;");
    }
    // Try icon
    let icon = c.getIcon();
    if (icon) {
      return icon;
    }

    // Not available
    return "...";
  }

  function _orderIdToReferenceId(orderId) { return "ORD" + orderId; }

  function _orderReferenceIdToOrderId(refId) { return refId.substring(3); }

  function _renderStatus(state, status) {
    let s = `<span class="status-text __CLASS_NAME__">__TEXT__</span>`;
    s = s.replace("__CLASS_NAME__", _getStateClassName(state, status));
    let t = status ? status : state;
    s = s.replace("__TEXT__", R.get(t));
    return s;
  }

  function _getStateClassName(state, status = null) {
    let name = "unknown";
    switch (state) {
    case C.STATE.NEW:
      name = "new";
      break;
    case C.STATE.ACTIVE:
      name = "active";
      break;
    case C.STATE.ONHOLD:
      name = "onhold";
      break;
    case C.STATE.FINISHED:
      name = "finished";
      if (status == C.STATE.STATUS.F_DONE) {
        name += " done";
      } else if (status == C.STATE.STATUS.F_FAILED) {
        name += "failed";
      }
      break;
    default:
      break;
    }
    return name;
  }

  function _getCountryByCode(code) {
    let idx2 = C.COUNTRIES.IDX.A2CODE;
    let idx3 = C.COUNTRIES.IDX.A3CODE;
    let i = C.COUNTRIES.DATA.find(i => i[idx2] == code || i[idx3] == code);
    if (i) {
      return new dat.Country({name : i[C.COUNTRIES.IDX.NAME]});
    }
    return null;
  }

  function _renderFlagIcon(countryCode, ratio = "4x3") {
    let s =
        `<span class="flag-icon" style="background-image:url(__FLAGS_PATH__/__DIR__/__CODE__.svg);"></span>`;
    let dir = ratio == "1x1" ? ratio : "4x3";
    s = s.replace("__FLAGS_PATH__", C.PATH.FLAGS);
    s = s.replace("__DIR__", dir);
    s = s.replace("__CODE__", countryCode.toLowerCase());
    return s;
  }

  function _writeIframe(iframe, content) {
    iframe.setAttribute("scrolling", "no");
    let doc = null;
    if (iframe.contentDocument) {
      doc = iframe.contentDocument;
    } else if (iframe.contentWindow) {
      doc = iframe.contentWindow.document;
    }
    doc.open();
    doc.write(content);
    doc.close();

    // TODO: Use onload event
    // 70 is from test result, not sure why
    let h = doc.documentElement.scrollHeight + 70;
    iframe.style.height = h + "px";
  }

  return {
    isOrderReferenceId : _isOrderReferenceId,
    getVisibilityClassName : _getVisibilityClassName,
    getStateClassName : _getStateClassName,
    getTopLevelDomain : _getTopLevelDomain,
    getCountryByCode : _getCountryByCode,
    escapeHtml : _escapeHtml,
    genRandomString : _genRandomString,
    orderIdToReferenceId : _orderIdToReferenceId,
    orderReferenceIdToOrderId : _orderReferenceIdToOrderId,
    renderSvgIcon : _renderSvgIcon,
    renderSvgMenuIcon : _renderSvgMenuIcon,
    renderSvgFuncIcon : _renderSvgFuncIcon,
    renderContent : _renderContent,
    renderSmallButton : _renderSmallButton,
    renderStatus : _renderStatus,
    renderPrice : _renderPrice,
    renderTimeDiff : _renderTimeDiff,
    renderSmartTime : _renderSmartTime,
    renderFlagIcon : _renderFlagIcon,
    stringCompare : _stringCompare,
    writeIframe : _writeIframe,
  };
}();
