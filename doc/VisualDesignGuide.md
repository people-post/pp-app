# Visual design guide (pp-app)

This document aligns **view styling** across fragments and raw HTML in this codebase: Tailwind utilities, legacy `hst.css`, session theme tokens, and the `Button` fragment. Use it when building or refactoring screens (e.g. `ListPanel` + `Panel`, `Fvc*` content fragments).

---

## 1. Tailwind usage

- **Prefix:** All Tailwind utilities use the **`tw:`** prefix (see `src/css/tailwind.css`).
- **Composition:** Prefer utilities on `Panel.setClassName(...)` and on HTML strings inside `replaceContent(...)`. Match existing fragments rather than introducing one-off spacing scales.
- **Custom utilities:** Project-specific sizes live in `tailwind.css` (e.g. `tw:text-s-font5`, `tw:w-s-icon6`). Prefer these over arbitrary pixel classes when a token exists.

---

## 2. Typography

| Role | Typical utilities | Notes |
|------|-------------------|--------|
| Screen title | `tw:text-s-font005`, `tw:font-bold`, `tw:tracking-tight`, `s-ctext` | **Do not** pair two `tw:text-s-font*` classes on one element—each sets `font-size`; use one size token plus `s-ctext` (or another **color** token) for contrast. |
| Section / body | `tw:text-s-font4`, `tw:text-s-font5` | `text-s-font5` is 12px—common for labels. |
| Secondary / helper | `tw:text-s-font7`, `tw:text-sm` | Captions, subtitles, hints. |
| Large display | `tw:text-s-font001` | **48px**—hero only; not for standard form titles. |

**Also available:** `text-u-font1`–`text-u-font7` (alternate scale). Prefer **`text-s-font*`** for consistency with existing sectors unless a screen already uses `text-u-font*`.

---

## 3. Session theme colors (`s-c*` classes)

Theme CSS is injected via `WcSession` (`src/session/WcSession.ts`): placeholders like `__PRIME__`, `__FUNC_COLOR__` are replaced at runtime. Use **`class` names**, not raw hex, so branding stays consistent.

| Class | Typical use |
|-------|----------------|
| `s-cprime`, `s-cprimebg`, `s-cprimebd` | Primary brand color (often aligns with **header / chrome**). |
| `s-cmenu` | Foreground intended on prime backgrounds (icons/text on header). |
| `s-csecondary`, `s-csecondarybg`, `s-csecondarydecorbg` | Page / panel surfaces, decorative bands. |
| `s-ctext` | Default body text color. |
| `s-cfunc`, `s-cfuncbg` | **Action / CTA** accents (contrasts with secondary surfaces). |
| `s-cinfotext` | Muted informational text. |

**Rule of thumb**

- **Match the top app bar:** prefer **`s-cprimebg` + `s-cmenu`** for a primary full-width action that should feel “same family” as the header.
- **General actions:** **`Button.T_THEME.FUNC`** maps to **`s-cfuncbg`** + **`s-csecondary`** (see `Button.ts`).

---

## 4. Buttons (`Button` fragment)

Defined in `src/lib/ui/controllers/fragments/Button.ts`; legacy appearance for wide CTAs uses **`a.button-bar`** (`src/css/hst.css`).

### Layout

- **`Button.LAYOUT_TYPE.BAR`** → renders an **`<a class="button-bar ...">`**. Use for full-width or prominent row actions (same pattern as `FvcRegister` submit).

### Themes (`Button.T_THEME`)

| Theme | Normal mode (typical) | Use when |
|-------|------------------------|----------|
| *(default)* | `s-cfuncbg s-csecondary` | Standard primary CTA. |
| `FUNC` | `s-primary s-cfuncbg s-csecondary` | Explicit functional styling. |
| **`PRIME`** | **`s-cprimebg s-cmenu`** | Primary action aligned with **header / prime** chrome. |
| `PALE` | Outlined / light | Secondary actions (e.g. “Continue as guest”). |
| `RISKY` / `DANGER` | Destructive | Delete, irreversible actions. |

### Full-width bar CTAs

Legacy CSS sets `a.button-bar` to **98% width** with side margins. For edge-to-edge bars inside cards, use **`setBarTailClassName(...)`** with Tailwind overrides, for example:

`tw:!ml-0 tw:!w-full tw:!max-w-none tw:min-h-[48px] tw:rounded-lg`

### Vertical alignment

`a.button-bar` uses **flexbox** (`display: flex; align-items: center; justify-content: center`) so label text stays vertically centered when `min-height` is increased. Avoid conflicting `tw:leading-*` tight line-heights on the same control unless you verify alignment.

---

## 5. Forms and cards

Reference implementation: **`src/sectors/auth/FvcLogin.ts`** (login card, fields, `Button` strip, footer).

### Layout

- **Content width:** `tw:w-full tw:max-w-sm tw:mx-auto` for readable single-column forms on phone and desktop strips.
- **Card:** Rounded container `tw:rounded-2xl` (or `rounded-t-*` / `rounded-b-*` when split across multiple `Panel`s), border `tw:border-lightgray/90`, optional `tw:shadow-md tw:shadow-slate-300/25`.
- **Vertical rhythm:** `tw:space-y-6` between major blocks; `tw:space-y-2` between label and field.

### Inputs

- **Touch-friendly height:** at least **`tw:min-h-[48px]`** (or 44px minimum for secondary targets).
- **Default field styling:** bordered, `tw:rounded-lg`, `tw:bg-white`, clear **`focus-visible`** border/ring (see existing `FIELD_CLASS` pattern in `FvcLogin.ts`).
- **Labels:** `tw:font-medium`, optional `tw:tracking-wide`.

### Links

- Secondary actions (forgot password, register): `tw:underline tw:underline-offset-4`, muted color `tw:text-s-font7` where appropriate.
- Keep **minimum tap height** (~44px) for inline links on touch layouts.

---

## 6. Strings and copy

- User-visible strings go through **`R.t(...)`** / **`R.get(...)`** (`src/common/constants/R.ts`) with English keys and optional `zh` entries.
- When adding new UI copy, add entries there for localization parity.

---

## 7. Where to change “global” look

| Concern | Primary file |
|---------|----------------|
| Tailwind theme / `@utility` font sizes | `src/css/tailwind.css` |
| Legacy widgets (`button-bar`, `.disabled`, etc.) | `src/css/hst.css` |
| Theme color variables and `s-c*` definitions | `src/session/WcSession.ts` (`_CRCT_SESSION.STYLE`) |
| Button behavior and theme mapping | `src/lib/ui/controllers/fragments/Button.ts` |

---

## 8. Pitfalls

1. **Double font-size classes** on one element (e.g. `tw:text-s-font005` + `tw:text-s-font3`)—both set `font-size`; the cascade can confuse designers and linters.
2. **`text-s-font001`** is **48px**—not for normal headings.
3. Mixing **FUNC** and **PRIME** without intent: FUNC (`s-cfuncbg`) and prime (`s-cprimebg`) may differ per tenant; pick one story per screen (e.g. login primary → PRIME).
4. Raw `<a class="button-bar">` duplicates `Button` behavior; prefer **`Button` + `LAYOUT_TYPE.BAR`** for delegates and disabled state unless you have a strong reason.

---

## 9. Related docs

- `doc/DelegatePattern.md` — fragment delegates and actions.
- `doc/LoginFlow.md` — auth flow overview (diagram).

When this guide conflicts with an existing sector, **follow the established pattern in that sector** for consistency within that feature, and consider aligning to this guide in a dedicated refactor.
