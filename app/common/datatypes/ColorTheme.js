export class ColorTheme {
  #cWhite = "#FFF";
  #cDark = "#333";
  #cDimGray = "#696969";
  #cLightGray = "#D3D3D3";
  #data;

  constructor(data) { this.#data = data; }

  getPrimaryColor() { return this.#data.primary_color; }
  getSecondaryColor() { return this.#data.secondary_color; }
  getTextColor(eTest) {
    if (this.#tooDark(this.getSecondaryColor(), eTest)) {
      return this.#cWhite;
    }
    return this.#cDark;
  }
  getInfoTextColor(eTest) {
    if (ext.Utilities.colorDiff(this.getSecondaryColor(), this.#cDimGray,
                                eTest) < 20) {
      return this.#cLightGray;
    }
    return this.#cDimGray;
  }
  getMenuColor(eTest) {
    if (this.#tooWhite(this.getPrimaryColor(), eTest)) {
      return this.#cDark;
    }
    return this.#cWhite;
  }
  getFuncColor(eTest) {
    if (this.#hasEnoughContrast(eTest)) {
      return this.getPrimaryColor();
    }
    if (this.#tooWhite(this.getSecondaryColor(), eTest)) {
      return this.#cDark;
    }
    return this.#cWhite;
  }
  getPrimeDecorColor(eTest) {
    if (this.#tooWhite(this.getPrimaryColor(), eTest)) {
      return this.#getDarkerPrimeColor(eTest);
    }
    return this.#getLightPrimeColor(eTest);
  }
  getSecondaryDecorColor(eTest) {
    if (this.#tooWhite(this.getSecondaryColor(), eTest)) {
      return this.#getDarkerSecondaryColor(eTest);
    }
    return this.#getLightSecondaryColor(eTest);
  }
  getSeparationColor(eTest) {
    if (this.#hasEnoughContrast(eTest)) {
      return null;
    }
    return this.getPrimeDecorColor(eTest);
  }

  #hasEnoughContrast(eTest) {
    // Color diff big enough to use primary color as system widget color
    return ext.Utilities.colorDiff(this.getPrimaryColor(),
                                   this.getSecondaryColor(), eTest) > 20;
  }

  #tooWhite(color, eTest) {
    return ext.Utilities.colorDiff(color, "#FFF", eTest) < 20;
  }

  #tooDark(color, eTest) {
    return ext.Utilities.colorDiff(color, "#000", eTest) < 20;
  }

  #getLightPrimeColor(eTest) {
    return ext.Utilities.lighterColor(this.getPrimaryColor(), 0.1, eTest);
  }

  #getDarkerPrimeColor(eTest) {
    return ext.Utilities.darkerColor(this.getPrimaryColor(), 0.9, eTest);
  }

  #getLightSecondaryColor(eTest) {
    return ext.Utilities.lighterColor(this.getSecondaryColor(), 0.5, eTest);
  }

  #getDarkerSecondaryColor(eTest) {
    return ext.Utilities.darkerColor(this.getSecondaryColor(), 0.9, eTest);
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.ColorTheme = ColorTheme;
}
