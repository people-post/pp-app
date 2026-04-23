type GlobalG = {
  action: (...args: unknown[]) => void;
};

type DelegatedEventConfig = {
  eventType: 'click' | 'change' | 'input' | 'keydown' | 'keyup' | 'blur' | 'scroll';
  actionAttr: string;
  argsAttr: string;
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
    if (arg === '$files0' && el instanceof HTMLInputElement) {
      return el.files?.[0] ?? null;
    }
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

function dispatchDelegatedAction(
    w: { G?: GlobalG },
    evt: Event,
    el: Element,
    actionAttr: string,
    argsAttr: string): void {
  const actionRaw = el.getAttribute(actionAttr);
  if (!actionRaw) {
    return;
  }
  const actionId = resolveAction(actionRaw);
  if (actionId == null) {
    return;
  }

  evt.stopPropagation();
  if (evt.type === 'click' && isAnchor(el)) {
    evt.preventDefault();
  }

  const args = parseArgs(el.getAttribute(argsAttr));
  const materializedArgs = args.map(a => materializeArg(el, a));
  const win = window as unknown as { event?: Event };
  const prevEvent = win.event;
  win.event = evt;
  try {
    w.G?.action(actionId, ...materializedArgs);
  } finally {
    win.event = prevEvent;
  }
}

function installDelegatedEvent(
    w: { G?: GlobalG },
    config: DelegatedEventConfig): void {
  document.addEventListener(
      config.eventType,
      evt => {
        const target = evt.target as Element | null;
        const selector = `[${config.actionAttr}]`;
        const el = target?.closest?.(selector) as Element | null;
        if (!el) {
          return;
        }
        if (config.eventType === 'click' && isSelfOnlyAction(el) && evt.target !== el) {
          return;
        }
        dispatchDelegatedAction(w, evt, el, config.actionAttr, config.argsAttr);
      },
      true);
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
  installDelegatedEvent(w, {
    eventType : 'click',
    actionAttr : 'data-pp-action',
    argsAttr : 'data-pp-args'
  });
  installDelegatedEvent(w, {
    eventType : 'change',
    actionAttr : 'data-pp-change-action',
    argsAttr : 'data-pp-change-args'
  });
  installDelegatedEvent(w, {
    eventType : 'input',
    actionAttr : 'data-pp-input-action',
    argsAttr : 'data-pp-input-args'
  });
  installDelegatedEvent(w, {
    eventType : 'keydown',
    actionAttr : 'data-pp-keydown-action',
    argsAttr : 'data-pp-keydown-args'
  });
  installDelegatedEvent(w, {
    eventType : 'keyup',
    actionAttr : 'data-pp-keyup-action',
    argsAttr : 'data-pp-keyup-args'
  });
  installDelegatedEvent(w, {
    eventType : 'blur',
    actionAttr : 'data-pp-blur-action',
    argsAttr : 'data-pp-blur-args'
  });
  installDelegatedEvent(w, {
    eventType : 'scroll',
    actionAttr : 'data-pp-scroll-action',
    argsAttr : 'data-pp-scroll-args'
  });
}

