const Utilities = function() {
  let _urlPattern = new RegExp(
      '^(https?:\\/\\/)?' +                                    // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' +     // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' +        // query string
          '(\\#[-a-z\\d_]*)?$',
      'i'); // fragment locator

  function _isEmptyString(s) { return !(s && s.length); }
  function _isValidUrl(s) { return !!_urlPattern.test(s); }

  function _isElementInViewport(element) {
    if (!element) {
      return false;
    }
    let rect = element.getBoundingClientRect();
    return rect.bottom >= 0 && rect.right >= 0 &&
           rect.top <= __getWindowHeight() && rect.left <= __getWindowWidth();
  }

  function _isElementAboveViewport(element) {
    return element.getBoundingClientRect().bottom < 0;
  }

  function _isElementCenterPointInViewport(element) {
    if (!element) {
      return false;
    }
    let rect = element.getBoundingClientRect();
    let x = (rect.left + rect.right) / 2;
    let y = (rect.top + rect.bottom) / 2;
    return x > 0 && y > 0 && y < __getWindowHeight() - 1 &&
           x < __getWindowWidth() - 1;
  }

  function _isValidColor(color) {
    if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
      return true;
    }
    let s = new Option().style;
    s.color = color;
    let c = s.color.toLowerCase();
    if (color.indexOf('(') < 0) {
      return c == color.toLowerCase();
    } else {
      return c.replace(/ /g, '') == color.toLowerCase().replace(/ /g, '');
    }
  }

  function _getVisibleWidthInParent(element) {
    if (!element) {
      return 0;
    }
    let eP = element.parentElement;
    if (!eP) {
      return 0;
    }
    let r = element.getBoundingClientRect();
    let rP = eP.getBoundingClientRect();
    let d = Math.min(r.right, rP.right) - Math.max(r.left, rP.left);
    return Math.max(d, 0);
  }

  function _unionSet(set1, set2) {
    let u = new Set(set1);
    for (let i of set2) {
      u.add(i);
    }
    return u;
  }

  function _shuffle(array) {
    let m = array.length, t, i;
    // Remain elements
    while (m) {
      // Pick
      i = Math.floor(Math.random() * m--);
      // Swap with current
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

  function _nToShortString(n) {
    const lookup = [
      {value : 1e17, symbol : "E"},
      {value : 1e14, symbol : "P"},
      {value : 1e11, symbol : "T"},
      {value : 1e8, symbol : "G"},
      {value : 1e5, symbol : "M"},
      {value : 1e2, symbol : "k"},
    ];
    let item = lookup.find(i => n >= i.value);
    return item ? (n / 10 / item.value).toPrecision(2) + item.symbol : n;
  }

  function _timeDiffString(dt) {
    // dt in seconds
    let sDay = 3600 * 24;
    let sMon = sDay * 30;
    let sYr = sDay * 365;
    if (dt < 60) {
      return Math.round(dt) + ' seconds';
    } else if (dt < 3600) {
      return Math.round(dt / 60) + ' minutes';
    } else if (dt < sDay) {
      return Math.round(dt / 3600) + ' hours';
    } else if (dt < sMon) {
      return Math.round(dt / sDay) + ' days';
    } else if (dt < sYr) {
      return Math.round(dt / sMon) + ' months';
    } else {
      return Math.round(dt / sYr) + ' years';
    }
  }

  function _timeDiffShortString(dt) {
    // dt in seconds
    let sDay = 3600 * 24;
    let sMon = sDay * 30;
    let sYr = sDay * 365;
    if (dt < 60) {
      return Math.round(dt) + 's';
    } else if (dt < 3600) {
      return Math.round(dt / 60) + 'm';
    } else if (dt < sDay) {
      return Math.round(dt / 3600) + 'h';
    } else if (dt < sMon) {
      return Math.round(dt / sDay) + 'd';
    } else if (dt < sYr) {
      return Math.round(dt / sMon) + 'M';
    } else {
      return Math.round(dt / sYr) + 'y';
    }
  }

  function _addNameToClassNameStr(name, str) {
    let items = str.split(" ");
    if (items.indexOf(name) < 0) {
      items.push(name);
      return items.join(" ");
    } else {
      return str;
    }
  }

  function _rmNameFromClassNameStr(name, str) {
    return str.split(" ").filter(i => i != name).join(" ");
  }

  function _uuidV4() {
    return ([ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11)
        .replace(/[018]/g,
                 c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] &
                               15 >> c / 4)
                          .toString(16));
  }

  function _uint8ArrayToHex(a) { return __uintArrayToHex(a, 2); }
  function _uint32ArrayToHex(a) { return __uintArrayToHex(a, 8); }
  function _uint8ArrayFromHex(s) {
    if (typeof s !== 'string') {
      throw new TypeError('Input must be a string');
    }
    if (s.length % 2 !== 0) {
      throw new RangeError('Hex string must have an even number of characters');
    }
    const bytes = [];
    for (let i = 0; i < s.length; i += 2) {
      const byte = parseInt(s.substring(i, i + 2), 16);
      if (isNaN(byte)) {
        throw new RangeError('Invalid hex character in string');
      }
      bytes.push(byte);
    }
    return new Uint8Array(bytes);
  }

  function _colorDiff(c1, c2, testObj) {
    let rgba1 = __getRgbaColorArray(c1, testObj);
    let rgba2 = __getRgbaColorArray(c2, testObj);
    let dd = 0;
    dd += (rgba1[0] - rgba2[0]) * (rgba1[0] - rgba2[0]);
    dd += (rgba1[1] - rgba2[1]) * (rgba1[1] - rgba2[1]);
    dd += (rgba1[2] - rgba2[2]) * (rgba1[2] - rgba2[2]);
    // in 0-100
    return Math.sqrt(dd / 3) / 2.55;
  }

  function _hslTransformColor(c, ratios, testObj) {
    let rgba = __getRgbaColorArray(c, testObj);
    let hsl = __rgbToHsl(rgba);
    hsl[0] = Math.min(360, hsl[0] * ratios[0]);
    hsl[1] = Math.min(100, hsl[1] * ratios[1]);
    hsl[2] = Math.min(100, hsl[2] * ratios[2]);
    let newRgb = __hslToRgb(hsl);
    if (rgba.length == 4) {
      newRgb.push(rgba[3]);
    }
    return __rgbaArrayToString(newRgb);
  }

  function _lighterColor(c, ratio, testObj) {
    let rgba = __getRgbaColorArray(c, testObj);
    rgba[0] = rgba[0] + (255 - rgba[0]) * ratio;
    rgba[1] = rgba[1] + (255 - rgba[1]) * ratio;
    rgba[2] = rgba[2] + (255 - rgba[2]) * ratio;
    return __rgbaArrayToString(rgba, c);
  }

  function _darkerColor(c, ratio, testObj) {
    let rgba = __getRgbaColorArray(c, testObj);
    rgba[0] *= ratio;
    rgba[1] *= ratio;
    rgba[2] *= ratio;
    return __rgbaArrayToString(rgba, c);
  }

  function _timestampToDateTimeString(s) {
    // Timestamp in seconds
    return new Date(s * 1000).toLocaleString()
  }

  function _timestampToDateString(s) {
    // Timestamp in seconds
    return new Date(s * 1000).toLocaleString(
        [], {month : "numeric", day : "numeric", year : "numeric"})
  }

  function _timestampToWeekdayString(s) {
    // Timestamp in seconds
    return new Date(s * 1000).toLocaleString([], {weekday : "short"})
  }

  function _timestampToTimeString(s) {
    // Timestamp in seconds
    return new Date(s * 1000).toLocaleString(
        [], {hour : "numeric", minute : "2-digit"})
  }

  function _findItemBefore(items, item) {
    let index = items.findIndex(i => i == item);
    if (index > 0) {
      return items[index - 1];
    } else {
      return null;
    }
  }

  function _findItemAfter(items, item) {
    let index = items.findIndex(i => i == item);
    if (index >= 0 && index + 1 < items.length) {
      return items[index + 1];
    } else {
      return null;
    }
  }

  function _optCall(obj, fcnName, ...args) {
    let f = obj ? obj[fcnName] : null;
    if (typeof f === "function") {
      return f.apply(obj, args);
    }
    return null;
  }

  function __getRgbaColorArray(color, testObj) {
    let c = testObj.style.color;
    testObj.style.color = color;
    let name = window.getComputedStyle(testObj).getPropertyValue("color");
    // Name with rgb or rgba ()
    let arr = name.substring(name.indexOf('(') + 1, name.length - 1)
                  .replace(/ /g, '')
                  .split(',');
    // Set color back
    testObj.style.color = c;
    return arr.map(v => parseFloat(v));
  }

  function __rgbaArrayToString(rgba, sDefault) {
    switch (rgba.length) {
    case 3:
      return "rgb(" + rgba.join(", ") + ")";
    case 4:
      return "rgba(" + rgba.join(", ") + ")";
    default:
      break;
    }
    return sDefault;
  }

  function __rgbToHsv(rgb) {
    var r, g, b, h, s, v;
    r = rgb[0];
    g = rgb[1];
    b = rgb[2];
    min = Math.min(r, g, b);
    max = Math.max(r, g, b);

    v = max;
    delta = max - min;
    if (max != 0) {
      s = delta / max; // s
    } else {
      // r = g = b = 0        // s = 0, v is undefined
      s = 0;
      h = -1;
      return [ h, s, undefined ];
    }
    if (r === max) {
      h = (g - b) / delta; // between yellow & magenta
    } else if (g === max) {
      h = 2 + (b - r) / delta; // between cyan & yellow
    } else {
      h = 4 + (r - g) / delta; // between magenta & cyan
    }
    h *= 60; // degrees
    if (h < 0) {
      h += 360;
    }
    if (isNaN(h)) {
      h = 0;
    }
    return [ h, s, v ];
  };

  function __hsvToRgb(hsv) {
    let h = hsv[0];
    let s = hsv[1];
    let v = hsv[2];
    let r, g, b;
    if (s === 0) {
      // achromatic (grey)
      r = g = b = v;
      return [ r, g, b ];
    }
    h /= 60; // sector 0 to 5
    let i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));
    switch (i) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    default: // case 5:
      r = v;
      g = p;
      b = q;
      break;
    }
    return [ r, g, b ];
  }

  function __rgbToHsl(rgb) {
    let r = rgb[0];
    let g = rgb[1];
    let b = rgb[2];
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s ? l === r   ? (g - b) / s
                  : l === g ? 2 + (b - r) / s
                            : 4 + (r - g) / s
                : 0;
    return [
      60 * h < 0 ? 60 * h + 360 : 60 * h,
      100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
      (100 * (2 * l - s)) / 2,
    ];
  };

  function __hslToRgb(hsl) {
    let h = hsl[0];
    let s = hsl[1];
    let l = hsl[2];
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = __hueToRgb(p, q, h + 1 / 3);
      g = __hueToRgb(p, q, h);
      b = __hueToRgb(p, q, h - 1 / 3);
    }

    return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255) ];
  }

  function __hueToRgb(p, q, t) {
    if (t < 0)
      t += 1;
    if (t > 1)
      t -= 1;
    if (t < 1 / 6)
      return p + (q - p) * 6 * t;
    if (t < 1 / 2)
      return q;
    if (t < 2 / 3)
      return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  function __getWindowHeight() {
    return window.innerHeight || document.documentElement.clientHeight;
  }

  function __getWindowWidth() {
    return window.innerWidth || document.documentElement.clientWidth;
  }

  function __uintArrayToHex(a, nPad) {
    return Array.from(a).map(b => b.toString(16).padStart(nPad, '0')).join('');
  }

  return {
    isEmptyString : _isEmptyString,
    isValidUrl : _isValidUrl,
    isValidColor : _isValidColor,
    isElementInViewport : _isElementInViewport,
    isElementAboveViewport : _isElementAboveViewport,
    isElementCenterPointInViewport : _isElementCenterPointInViewport,
    getVisibleWidthInParent : _getVisibleWidthInParent,
    uuid : _uuidV4,
    unionSet : _unionSet,
    shuffle : _shuffle,
    colorDiff : _colorDiff,
    lighterColor : _lighterColor,
    hslTransformColor : _hslTransformColor,
    darkerColor : _darkerColor,
    nToShortString : _nToShortString,
    timestampToDateTimeString : _timestampToDateTimeString,
    timestampToDateString : _timestampToDateString,
    timestampToWeekdayString : _timestampToWeekdayString,
    timestampToTimeString : _timestampToTimeString,
    timeDiffString : _timeDiffString,
    timeDiffShortString : _timeDiffShortString,
    addNameToClassNameStr : _addNameToClassNameStr,
    rmNameFromClassNameStr : _rmNameFromClassNameStr,
    uint8ArrayToHex : _uint8ArrayToHex,
    uint32ArrayToHex : _uint32ArrayToHex,
    uint8ArrayFromHex : _uint8ArrayFromHex,
    findItemBefore : _findItemBefore,
    findItemAfter : _findItemAfter,
    optCall : _optCall,
  };
}();

export default Utilities;
