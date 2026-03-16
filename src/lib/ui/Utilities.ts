interface UiSvgStyleConfig {
  secondaryStrokeClassName: string;
  secondaryFillClassName: string;
  functionStrokeClassName: string;
  functionFillClassName: string;
  menuStrokeClassName: string;
  menuFillClassName: string;
}

class UiUtilitiesClass {
  #svgStyleConfig: UiSvgStyleConfig = {
    secondaryStrokeClassName: 's-csecondarystk',
    secondaryFillClassName: 's-csecondaryfill',
    functionStrokeClassName: 's-cfuncstk',
    functionFillClassName: 's-cfuncfill',
    menuStrokeClassName: 's-cmenustk',
    menuFillClassName: 's-cmenufill',
  };

  setSvgStyleConfig(config: Partial<UiSvgStyleConfig>): void {
    this.#svgStyleConfig = { ...this.#svgStyleConfig, ...config };
  }

  renderSvgIcon(tIcon: string, stroke: string | null = null, fill: string | null = null): string {
    let s = tIcon;
    s = s.replace(/__C_STROKE__/g, stroke ? stroke : "");
    s = s.replace(/__C_FILL__/g, fill ? fill : "");
    return s;
  }

  renderSvgFuncIcon(tIcon: string, isInverse: boolean = false): string {
    if (isInverse) {
      return this.renderSvgIcon(
          tIcon,
          this.#svgStyleConfig.secondaryStrokeClassName,
          this.#svgStyleConfig.secondaryFillClassName);
    }
    return this.renderSvgIcon(
        tIcon,
        this.#svgStyleConfig.functionStrokeClassName,
        this.#svgStyleConfig.functionFillClassName);
  }

  renderSvgMenuIcon(tIcon: string): string {
    return this.renderSvgIcon(
        tIcon,
        this.#svgStyleConfig.menuStrokeClassName,
        this.#svgStyleConfig.menuFillClassName);
  }
}

export const UiUtilities = new UiUtilitiesClass();