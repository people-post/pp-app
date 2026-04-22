type GlobalG = {
  action: (...args: unknown[]) => void;
};

function isAnchor(el: Element): el is HTMLAnchorElement {
  return el.tagName.toLowerCase() === 'a';
}

function isSelfOnlyAction(el: Element): boolean {
  return el.getAttribute('data-pp-action-self') === 'true';
}

function parseArgs(raw: string | null): unknown[] {
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
}

function materializeArg(el: Element, arg: unknown): unknown {
  if (arg === '$this') {
    return el;
  }
  if (typeof arg === 'string') {
    if (arg === '$checked' && el instanceof HTMLInputElement) {
      return el.checked;
    }
    if (arg === '$value' && el instanceof HTMLInputElement) {
      return el.value;
    }
    if (arg === '$value' && el instanceof HTMLTextAreaElement) {
      return el.value;
    }
    if (arg === '$value' && el instanceof HTMLSelectElement) {
      return el.value;
    }
  }
  return arg;
}

function resolveAction(raw: string): unknown {
  // Allow symbolic / non-string action IDs via a window path, e.g. `window.CF_NOTICE.CLOSE`.
  if (raw.startsWith('window.') || raw.startsWith('globalThis.')) {
    const parts = raw.split('.');
    let cur: any = raw.startsWith('window.') ? window : globalThis;
    for (let i = 1; i < parts.length; i++) {
      cur = cur?.[parts[i]];
    }
    return cur;
  }
  return raw;
}

export function installDomActionDelegator(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const w = window as unknown as { __pp_dom_action_delegator_installed?: boolean; G?: GlobalG };
  if (w.__pp_dom_action_delegator_installed) {
    return;
  }
  w.__pp_dom_action_delegator_installed = true;

  // Capture phase: must run before bubble reaches ancestors that call stopPropagation()
  // (e.g. LContext's panel uses onclick="G.anchorClick()" which blocks the event from
  // reaching document in the bubble phase, which would otherwise prevent data-pp-action
  // from working inside context layers).
  document.addEventListener(
      'click',
      (evt: MouseEvent) => {
        const target = evt.target as Element | null;
        const el = target?.closest?.('[data-pp-action]') as Element | null;
        if (!el) {
          return;
        }
        if (isSelfOnlyAction(el) && evt.target !== el) {
          return;
        }

        const actionRaw = el.getAttribute('data-pp-action');
        if (!actionRaw) {
          return;
        }
        const actionId = resolveAction(actionRaw);
        if (actionId == null) {
          return;
        }

        // Preserve existing inline-handler semantics.
        evt.stopPropagation();
        if (isAnchor(el)) {
          evt.preventDefault();
        }

        const args = parseArgs(el.getAttribute('data-pp-args'));
        const materializedArgs = args.map(a => materializeArg(el, a));
        const win = window as unknown as { event?: Event };
        const prevEvent = win.event;
        win.event = evt;
        try {
          w.G?.action(actionId, ...materializedArgs);
        } finally {
          win.event = prevEvent;
        }
      },
      true);
}

