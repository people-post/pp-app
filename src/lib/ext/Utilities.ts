const _urlPattern = new RegExp(
  '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
  'i'
); // fragment locator

function __getWindowHeight(): number {
  return window.innerHeight || document.documentElement.clientHeight;
}

function __getWindowWidth(): number {
  return window.innerWidth || document.documentElement.clientWidth;
}

function __getRgbaColorArray(color: string, testObj: HTMLElement): number[] {
  const c = testObj.style.color;
  testObj.style.color = color;
  const name = window.getComputedStyle(testObj).getPropertyValue('color');
  // Name with rgb or rgba ()
  const arr = name
    .substring(name.indexOf('(') + 1, name.length - 1)
    .replace(/ /g, '')
    .split(',');
  // Set color back
  testObj.style.color = c;
  return arr.map((v) => parseFloat(v));
}

function __rgbaArrayToString(rgba: number[], sDefault?: string): string {
  switch (rgba.length) {
    case 3:
      return 'rgb(' + rgba.join(', ') + ')';
    case 4:
      return 'rgba(' + rgba.join(', ') + ')';
    default:
      break;
  }
  return sDefault || '';
}

// Unused function - kept for potential future use
// @ts-expect-error - unused function
function __rgbToHsv(rgb: number[]): [number, number, number] | [number, number, undefined] {
  const r = rgb[0];
  const g = rgb[1];
  const b = rgb[2];
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);

  const v = max;
  const delta = max - min;
  let s: number;
  let h: number;
  if (max !== 0) {
    s = delta / max; // s
  } else {
    // r = g = b = 0        // s = 0, v is undefined
    s = 0;
    h = -1;
    return [h, s, undefined];
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
  return [h, s, v];
}

// Unused function - kept for potential future use
// @ts-expect-error - unused function
function __hsvToRgb(hsv: [number, number, number]): number[] {
  const h = hsv[0];
  const s = hsv[1];
  const v = hsv[2];
  let r: number, g: number, b: number;
  if (s === 0) {
    // achromatic (grey)
    r = g = b = v;
    return [r, g, b];
  }
  const hNorm = h / 60; // sector 0 to 5
  const i = Math.floor(hNorm);
  const f = hNorm - i; // factorial part of h
  const p = v * (1 - s);
  const q = v * (1 - s * f);
  const t = v * (1 - s * (1 - f));
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
  return [r, g, b];
}

function __rgbToHsl(rgb: number[]): [number, number, number] {
  let r = rgb[0];
  let g = rgb[1];
  let b = rgb[2];
  r /= 255;
  g /= 255;
  b /= 255;
  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s
    ? l === r
      ? (g - b) / s
      : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
    : 0;
  return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ];
}

function __hslToRgb(hsl: [number, number, number]): number[] {
  const h = hsl[0];
  const s = hsl[1] / 100;
  const l = hsl[2] / 100;
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = __hueToRgb(p, q, h / 360 + 1 / 3);
    g = __hueToRgb(p, q, h / 360);
    b = __hueToRgb(p, q, h / 360 - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function __hueToRgb(p: number, q: number, t: number): number {
  let tNorm = t;
  if (tNorm < 0) tNorm += 1;
  if (tNorm > 1) tNorm -= 1;
  if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
  if (tNorm < 1 / 2) return q;
  if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
  return p;
}

function __uintArrayToHex(a: Uint8Array | Uint32Array, nPad: number): string {
  return Array.from(a)
    .map((b) => b.toString(16).padStart(nPad, '0'))
    .join('');
}

function _isEmptyString(s: string | null | undefined): boolean {
  return !(s && s.length);
}

function _isValidUrl(s: string): boolean {
  return !!_urlPattern.test(s);
}

function _isElementInViewport(element: Element | null): boolean {
  if (!element) {
    return false;
  }
  const rect = element.getBoundingClientRect();
  return (
    rect.bottom >= 0 &&
    rect.right >= 0 &&
    rect.top <= __getWindowHeight() &&
    rect.left <= __getWindowWidth()
  );
}

function _isElementAboveViewport(element: Element): boolean {
  return element.getBoundingClientRect().bottom < 0;
}

function _isElementCenterPointInViewport(element: Element | null): boolean {
  if (!element) {
    return false;
  }
  const rect = element.getBoundingClientRect();
  const x = (rect.left + rect.right) / 2;
  const y = (rect.top + rect.bottom) / 2;
  return (
    x > 0 && y > 0 && y < __getWindowHeight() - 1 && x < __getWindowWidth() - 1
  );
}

function _isValidColor(color: string): boolean {
  if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
    return true;
  }
  const s = new Option().style;
  s.color = color;
  const c = s.color.toLowerCase();
  if (color.indexOf('(') < 0) {
    return c === color.toLowerCase();
  } else {
    return c.replace(/ /g, '') === color.toLowerCase().replace(/ /g, '');
  }
}

function _getVisibleWidthInParent(element: Element | null): number {
  if (!element) {
    return 0;
  }
  const eP = element.parentElement;
  if (!eP) {
    return 0;
  }
  const r = element.getBoundingClientRect();
  const rP = eP.getBoundingClientRect();
  const d = Math.min(r.right, rP.right) - Math.max(r.left, rP.left);
  return Math.max(d, 0);
}

function _unionSet<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  const u = new Set(set1);
  for (const i of set2) {
    u.add(i);
  }
  return u;
}

function _shuffle<T>(array: T[]): T[] {
  let m = array.length;
  let t: T;
  let i: number;
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

function _nToShortString(n: number): string {
  const lookup = [
    { value: 1e17, symbol: 'E' },
    { value: 1e14, symbol: 'P' },
    { value: 1e11, symbol: 'T' },
    { value: 1e8, symbol: 'G' },
    { value: 1e5, symbol: 'M' },
    { value: 1e2, symbol: 'k' },
  ];
  const item = lookup.find((i) => n >= i.value);
  return item ? (n / 10 / item.value).toPrecision(2) + item.symbol : n.toString();
}

function _timeDiffString(dt: number): string {
  // dt in seconds
  const sDay = 3600 * 24;
  const sMon = sDay * 30;
  const sYr = sDay * 365;
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

function _timeDiffShortString(dt: number): string {
  // dt in seconds
  const sDay = 3600 * 24;
  const sMon = sDay * 30;
  const sYr = sDay * 365;
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

function _addNameToClassNameStr(name: string, str: string): string {
  const items = str.split(' ');
  if (items.indexOf(name) < 0) {
    items.push(name);
    return items.join(' ');
  } else {
    return str;
  }
}

function _rmNameFromClassNameStr(name: string, str: string): string {
  return str
    .split(' ')
    .filter((i) => i !== name)
    .join(' ');
}

function _uuidV4(): string {
  // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function _uint8ArrayToHex(a: Uint8Array): string {
  return __uintArrayToHex(a, 2);
}

function _uint32ArrayToHex(a: Uint32Array): string {
  return __uintArrayToHex(a, 8);
}

function _uint8ArrayFromHex(s: string): Uint8Array {
  if (typeof s !== 'string') {
    throw new TypeError('Input must be a string');
  }
  if (s.length % 2 !== 0) {
    throw new RangeError('Hex string must have an even number of characters');
  }
  const bytes: number[] = [];
  for (let i = 0; i < s.length; i += 2) {
    const byte = parseInt(s.substring(i, i + 2), 16);
    if (isNaN(byte)) {
      throw new RangeError('Invalid hex character in string');
    }
    bytes.push(byte);
  }
  return new Uint8Array(bytes);
}

function _colorDiff(c1: string, c2: string, testObj: HTMLElement | null): number {
  if (!testObj) {
    return 0;
  }
  const rgba1 = __getRgbaColorArray(c1, testObj);
  const rgba2 = __getRgbaColorArray(c2, testObj);
  let dd = 0;
  dd += (rgba1[0] - rgba2[0]) * (rgba1[0] - rgba2[0]);
  dd += (rgba1[1] - rgba2[1]) * (rgba1[1] - rgba2[1]);
  dd += (rgba1[2] - rgba2[2]) * (rgba1[2] - rgba2[2]);
  // in 0-100
  return Math.sqrt(dd / 3) / 2.55;
}

function _hslTransformColor(
  c: string,
  ratios: [number, number, number],
  testObj: HTMLElement | null
): string {
  if (!testObj) {
    return c;
  }
  const rgba = __getRgbaColorArray(c, testObj);
  const hsl = __rgbToHsl(rgba);
  hsl[0] = Math.min(360, hsl[0] * ratios[0]);
  hsl[1] = Math.min(100, hsl[1] * ratios[1]);
  hsl[2] = Math.min(100, hsl[2] * ratios[2]);
  const newRgb = __hslToRgb(hsl);
  if (rgba.length === 4) {
    newRgb.push(rgba[3]);
  }
  return __rgbaArrayToString(newRgb, c);
}

function _lighterColor(c: string, ratio: number, testObj: HTMLElement | null): string {
  if (!testObj) {
    return c;
  }
  const rgba = __getRgbaColorArray(c, testObj);
  rgba[0] = rgba[0] + (255 - rgba[0]) * ratio;
  rgba[1] = rgba[1] + (255 - rgba[1]) * ratio;
  rgba[2] = rgba[2] + (255 - rgba[2]) * ratio;
  return __rgbaArrayToString(rgba, c);
}

function _darkerColor(c: string, ratio: number, testObj: HTMLElement | null): string {
  if (!testObj) {
    return c;
  }
  const rgba = __getRgbaColorArray(c, testObj);
  rgba[0] *= ratio;
  rgba[1] *= ratio;
  rgba[2] *= ratio;
  return __rgbaArrayToString(rgba, c);
}

function _timestampToDateTimeString(s: number): string {
  // Timestamp in seconds
  return new Date(s * 1000).toLocaleString();
}

function _timestampToDateString(s: number): string {
  // Timestamp in seconds
  return new Date(s * 1000).toLocaleString([], {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
}

function _timestampToWeekdayString(s: number): string {
  // Timestamp in seconds
  return new Date(s * 1000).toLocaleString([], { weekday: 'short' });
}

function _timestampToTimeString(s: number): string {
  // Timestamp in seconds
  return new Date(s * 1000).toLocaleString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function _findItemBefore<T>(items: T[], item: T): T | null {
  const index = items.findIndex((i) => i === item);
  if (index > 0) {
    return items[index - 1];
  } else {
    return null;
  }
}

function _findItemAfter<T>(items: T[], item: T): T | null {
  const index = items.findIndex((i) => i === item);
  if (index >= 0 && index + 1 < items.length) {
    return items[index + 1];
  } else {
    return null;
  }
}

function _optCall(obj: unknown, fcnName: string, ...args: unknown[]): unknown {
  const f = obj && typeof obj === 'object' && fcnName in obj ? (obj as Record<string, unknown>)[fcnName] : null;
  if (typeof f === 'function') {
    return f.apply(obj, args);
  }
  return null;
}

const Utilities = {
  isEmptyString: _isEmptyString,
  isValidUrl: _isValidUrl,
  isValidColor: _isValidColor,
  isElementInViewport: _isElementInViewport,
  isElementAboveViewport: _isElementAboveViewport,
  isElementCenterPointInViewport: _isElementCenterPointInViewport,
  getVisibleWidthInParent: _getVisibleWidthInParent,
  uuid: _uuidV4,
  unionSet: _unionSet,
  shuffle: _shuffle,
  colorDiff: _colorDiff,
  lighterColor: _lighterColor,
  hslTransformColor: _hslTransformColor,
  darkerColor: _darkerColor,
  nToShortString: _nToShortString,
  timestampToDateTimeString: _timestampToDateTimeString,
  timestampToDateString: _timestampToDateString,
  timestampToWeekdayString: _timestampToWeekdayString,
  timestampToTimeString: _timestampToTimeString,
  timeDiffString: _timeDiffString,
  timeDiffShortString: _timeDiffShortString,
  addNameToClassNameStr: _addNameToClassNameStr,
  rmNameFromClassNameStr: _rmNameFromClassNameStr,
  uint8ArrayToHex: _uint8ArrayToHex,
  uint32ArrayToHex: _uint32ArrayToHex,
  uint8ArrayFromHex: _uint8ArrayFromHex,
  findItemBefore: _findItemBefore,
  findItemAfter: _findItemAfter,
  optCall: _optCall,
};

export default Utilities;

