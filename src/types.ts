import type { GridAppModuleConfiguration, RGBColor } from '@isergeevv/html-grid-app-base';

export interface GridAppPanelModuleConfiguration extends GridAppModuleConfiguration {
  backgroundColor: RGBColor;
  panelElementTypes: string[];
}
