import { Country } from './datatypes/Country.js';
import UtilitiesExt from '../lib/ext/Utilities.js';
import { VIS, STATE, PATH } from './constants/Constants.js';
import { COUNTRIES } from './constants/CountryCodes.js';
import { Env } from './plt/Env.js';
import { R } from './constants/R.js';
import { Currency } from './datatypes/Currency.js';

class UtilitiesClass {
  isOrderReferenceId(key: string): boolean {
    return key.length == 27 && key.indexOf('ORD') == 0;
  }

  escapeHtml(unsafe: string): string {
    return unsafe.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
  }

  getVisibilityClassName(visibility: string): string {
    switch (visibility) {
    case VIS.PRIVATE:
      return "private";
    case VIS.PROTECTED:
      return "protected";
    case VIS.CONFIDENTIAL:
      return "restricted";
    default:
      return "public";
    }
  }

  genRandomString(length: number): string {
    let s = '';
    let chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let n = chars.length;
    for (let i = 0; i < length; i++) {
      s += chars.charAt(Math.floor(Math.random() * n));
    }
    return s;
  }

  // Unused function - kept for potential future use
  // @ts-expect-error - unused function
  private forceRedraw(): void {
    let e: Event;
    if (typeof (Event) === "function") {
      e = new Event("resize");
    } else {
      // For IE
      e = document.createEvent("Event");
      e.initEvent("resize", true, true);
    }
    window.dispatchEvent(e);
  }

  renderSmartTime(t: Date): string {
    let dt = Math.abs(t.getTime() - Date.now()) / 1000;
    // Unit is seconds
    if (dt > Env.getSmartTimeDiffThreshold()) {
      return t.toLocaleString(
          [], {month : "numeric", day : "numeric", year : "2-digit"})
    } else {
      return UtilitiesExt.timeDiffShortString(dt)
    }
  }

  renderTimeDiff(t1: number, t2: number | null = null, isMs: boolean = true, isShortString: boolean = true): string {
    let dt = Math.abs(t1 - (t2 ? t2 : Date.now()));
    if (isMs) {
      dt = dt / 1000;
    }
    return isShortString ? UtilitiesExt.timeDiffShortString(dt)
                         : UtilitiesExt.timeDiffString(dt);
  }

  getTopLevelDomain(): string {
    let name = window.location.hostname;
    if (name.indexOf("www.") == 0) {
      name = name.replace("www.", "");
    }
    return name;
  }

  renderSvgIcon(tIcon: string, stroke: string | null, fill: string | null): string {
    let s = tIcon;
    s = s.replace(/__C_STROKE__/g, stroke ? stroke : "");
    s = s.replace(/__C_FILL__/g, fill ? fill : "");
    return s;
  }

  renderSvgFuncIcon(tIcon: string, isInverse: boolean = false): string {
    if (isInverse) {
      return this.renderSvgIcon(tIcon, "s-csecondarystk", "s-csecondaryfill");
    }
    return this.renderSvgIcon(tIcon, "s-cfuncstk", "s-cfuncfill");
  }

  renderSvgMenuIcon(tIcon: string): string {
    return this.renderSvgIcon(tIcon, "s-cmenustk", "s-cmenufill");
  }

  renderSmallButton(actionId: string, id: string, name: string, className: string = "s-primary"): string {
    let s =
        `<span class="button-like small __CLASS_NAME__" onclick="javascript:G.action(__ACTION_ID__, '__ID__')">__NAME__</span>`;
    s = s.replace("__ACTION_ID__", actionId);
    s = s.replace("__NAME__", name);
    s = s.replace("__ID__", id);
    s = s.replace("__CLASS_NAME__", className);
    return s;
  }

  stringCompare(sa: string, sb: string): number {
    if (sa < sb) {
      return -1;
    }
    if (sa > sb) {
      return 1;
    }
    return 0;
  }

  renderContent(s: string | null | undefined): string {
    // Render with hashtag detection
    if (!s) {
      return "";
    }
    // Safari has issue with lookbehind, workaround needed...
    let btn1 =
        `$1<a class="hashtag" href="javascript:void(0)" onclick="G.action(window.CR_VIEW_FRAME.ON_SEARCH, '$2')">$2</a>`;
    s = s.replace(/([ >\w!\p{L}]{1})(#[\w!\p{L}]{2,32})/gu, btn1);
    // Second times for # right after first match
    s = s.replace(/([ >\w!\p{L}]{1})(#[\w!\p{L}]{2,32})/gu, btn1);
    let btn2 =
        `<a class="hashtag" href="javascript:void(0)" onclick="G.action(window.CR_VIEW_FRAME.ON_SEARCH, '$&')">$&</a>`;
    s = s.replace(/^(#[\w!\p{L}]{2,32})/gu, btn2);
    return s;
  }

  renderPrice(currency: Currency | null, value: number | null | undefined): string {
    if (value || value == 0) {
      let s = `<span class="num-font">__SYMBOL__&nbsp;__VALUE__</span>`;
      s = s.replace("__SYMBOL__", this.renderCurrencyIcon(currency));
      let v = Math.round(value * 100) / 100.0;
      s = s.replace("__VALUE__", v.toString());
      return s;
    } else {
      return "N/A";
    }
  }

  private renderCurrencyIcon(c: Currency | null): string {
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

  orderIdToReferenceId(orderId: string): string { return "ORD" + orderId; }

  orderReferenceIdToOrderId(refId: string): string { return refId.substring(3); }

  renderStatus(state: string, status: string | null): string {
    let s = `<span class="status-text __CLASS_NAME__">__TEXT__</span>`;
    s = s.replace("__CLASS_NAME__", this.getStateClassName(state, status));
    let t = status ? status : state;
    s = s.replace("__TEXT__", R.get(t));
    return s;
  }

  getStateClassName(state: string, status: string | null = null): string {
    let name = "unknown";
    switch (state) {
    case STATE.NEW:
      name = "new";
      break;
    case STATE.ACTIVE:
      name = "active";
      break;
    case STATE.ONHOLD:
      name = "onhold";
      break;
    case STATE.FINISHED:
      name = "finished";
      if (status == STATE.STATUS.F_DONE) {
        name += " done";
      } else if (status == STATE.STATUS.F_FAILED) {
        name += "failed";
      }
      break;
    default:
      break;
    }
    return name;
  }

  getCountryByCode(code: string): Country | null {
    let idx2 = COUNTRIES.IDX.A2CODE;
    let idx3 = COUNTRIES.IDX.A3CODE;
    let i = COUNTRIES.DATA.find(i => i[idx2] == code || i[idx3] == code);
    if (i) {
      return new Country({name : i[COUNTRIES.IDX.NAME]});
    }
    return null;
  }

  renderFlagIcon(countryCode: string, ratio: string = "4x3"): string {
    let s =
        `<span class="flag-icon" style="background-image:url(__FLAGS_PATH__/__DIR__/__CODE__.svg);"></span>`;
    let dir = ratio == "1x1" ? ratio : "4x3";
    s = s.replace("__FLAGS_PATH__", PATH.FLAGS);
    s = s.replace("__DIR__", dir);
    s = s.replace("__CODE__", countryCode.toLowerCase());
    return s;
  }

  writeIframe(iframe: HTMLIFrameElement, content: string): void {
    iframe.setAttribute("scrolling", "no");
    let doc: Document | null = null;
    if (iframe.contentDocument) {
      doc = iframe.contentDocument;
    } else if (iframe.contentWindow) {
      doc = iframe.contentWindow.document;
    }
    if (!doc) {
      return;
    }
    doc.open();
    doc.write(content);
    doc.close();

    // TODO: Use onload event
    // 70 is from test result, not sure why
    let h = doc.documentElement.scrollHeight + 70;
    iframe.style.height = h + "px";
  }
}

export const Utilities = new UtilitiesClass();
