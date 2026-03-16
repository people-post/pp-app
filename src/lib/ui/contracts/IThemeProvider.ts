export interface IThemeProvider {
  getCurrentTheme(): any;
  setThemeId(themeId: string | null): void;
}
