import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';

interface ScrollYProbe {
  (): { value: number; total: number } | null;
}

/**
 * Message list inside {@link FScrollableHook}: pull-at-top loads older messages,
 * scroll-probe gates elastic refresh until the user reaches the top.
 */
export class FChatMessagesScrollContent extends FSimpleFragmentList {
  #scrollProbe: ScrollYProbe | null = null;
  #loadOlder: (() => void) | null = null;

  setScrollProbe(p: ScrollYProbe): void {
    this.#scrollProbe = p;
  }

  setLoadOlderHandler(h: () => void): void {
    this.#loadOlder = h;
  }

  scrollToTop(): void {}

  onScrollFinished(): void {}

  hasHiddenTopBuffer(): boolean {
    const y = this.#scrollProbe?.();
    return y ? y.value > 0 : false;
  }

  override isReloadable(): boolean {
    return true;
  }

  override reload(): void {
    this.#loadOlder?.();
  }
}
