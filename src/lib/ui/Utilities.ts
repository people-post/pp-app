class UiUtilitiesClass {
  renderSvgIcon(tIcon: string, stroke: string | null = null, fill: string | null = null): string {
    let s = tIcon;
    s = s.replace(/__C_STROKE__/g, stroke ? stroke : "");
    s = s.replace(/__C_FILL__/g, fill ? fill : "");
    return s;
  }

  renderSvgFuncIcon(tIcon: string, isInverse: boolean = false): string {
    if (isInverse) {
      return this.renderSvgIcon(tIcon, "s-csecondarystk", "s-csecondaryfill");
    }
    return this.renderSvgIcon(tIcon, "s-cfuncstk", "s-cfuncfill");
  }
}

export const UiUtilities = new UiUtilitiesClass();