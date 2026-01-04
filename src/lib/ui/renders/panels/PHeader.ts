import { Panel } from './Panel.js';

export class PHeader extends Panel {
  #animationEndHandler: (() => void) | null = null;

  getNavPanel(): Panel | null { return null; }
  getMenuPanel(_i: number): Panel | null { return null; }
  getActionPanel(): Panel | null { return null; }
  getMenuContentElementId(): string | null { return null; }

  setEnableNav(_b: boolean): void {}
  setAnimationEndHandler(fcn: (() => void) | null): void { this.#animationEndHandler = fcn; }

  expandPanelIfPossible(_i: number): void {}

  _initMenuContentAnimationHandler(elementId: string): void {
    let e = document.getElementById(elementId);
    if (e) {
      e.addEventListener("animationend", () => this.#onMenuClosed());
      e.addEventListener("webkitAnimationEnd", () => this.#onMenuClosed());
    }
  }

  #onMenuClosed(): void {
    if (this.#animationEndHandler) {
      this.#animationEndHandler();
    }
  }
}

