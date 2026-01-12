import Utilities from '../../lib/ext/Utilities.js';
import type { ColorThemeData, ColorTheme as ColorThemeType } from '../../types/Basic.js';

export class ColorTheme implements ColorThemeType {
  #cWhite = '#FFF';
  #cDark = '#333';
  #cDimGray = '#696969';
  #cLightGray = '#D3D3D3';
  #data: ColorThemeData;

  constructor(data: ColorThemeData) {
    this.#data = data;
  }

  getPrimaryColor(): string {
    return this.#data.primary_color;
  }

  getSecondaryColor(): string {
    return this.#data.secondary_color;
  }

  getTextColor(eTest: HTMLElement | null): string {
    if (this.#tooDark(this.getSecondaryColor(), eTest)) {
      return this.#cWhite;
    }
    return this.#cDark;
  }

  getInfoTextColor(eTest: HTMLElement | null): string {
    if (Utilities.colorDiff(this.getSecondaryColor(), this.#cDimGray, eTest) < 20) {
      return this.#cLightGray;
    }
    return this.#cDimGray;
  }

  getMenuColor(eTest: HTMLElement | null): string {
    if (this.#tooWhite(this.getPrimaryColor(), eTest)) {
      return this.#cDark;
    }
    return this.#cWhite;
  }

  getFuncColor(eTest: HTMLElement | null): string {
    if (this.#hasEnoughContrast(eTest)) {
      return this.getPrimaryColor();
    }
    if (this.#tooWhite(this.getSecondaryColor(), eTest)) {
      return this.#cDark;
    }
    return this.#cWhite;
  }

  getPrimeDecorColor(eTest: HTMLElement | null): string {
    if (this.#tooWhite(this.getPrimaryColor(), eTest)) {
      return this.#getDarkerPrimeColor(eTest);
    }
    return this.#getLightPrimeColor(eTest);
  }

  getSecondaryDecorColor(eTest: HTMLElement | null): string {
    if (this.#tooWhite(this.getSecondaryColor(), eTest)) {
      return this.#getDarkerSecondaryColor(eTest);
    }
    return this.#getLightSecondaryColor(eTest);
  }

  getSeparationColor(eTest: HTMLElement | null): string | null {
    if (this.#hasEnoughContrast(eTest)) {
      return null;
    }
    return this.getPrimeDecorColor(eTest);
  }

  #hasEnoughContrast(eTest: HTMLElement | null): boolean {
    // Color diff big enough to use primary color as system widget color
    return Utilities.colorDiff(this.getPrimaryColor(), this.getSecondaryColor(), eTest) > 20;
  }

  #tooWhite(color: string, eTest: HTMLElement | null): boolean {
    return Utilities.colorDiff(color, '#FFF', eTest) < 20;
  }

  #tooDark(color: string, eTest: HTMLElement | null): boolean {
    return Utilities.colorDiff(color, '#000', eTest) < 20;
  }

  #getLightPrimeColor(eTest: HTMLElement | null): string {
    return Utilities.lighterColor(this.getPrimaryColor(), 0.1, eTest);
  }

  #getDarkerPrimeColor(eTest: HTMLElement | null): string {
    return Utilities.darkerColor(this.getPrimaryColor(), 0.9, eTest);
  }

  #getLightSecondaryColor(eTest: HTMLElement | null): string {
    return Utilities.lighterColor(this.getSecondaryColor(), 0.5, eTest);
  }

  #getDarkerSecondaryColor(eTest: HTMLElement | null): string {
    return Utilities.darkerColor(this.getSecondaryColor(), 0.9, eTest);
  }
}

