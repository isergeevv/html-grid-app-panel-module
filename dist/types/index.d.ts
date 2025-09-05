import { GridAppModuleConfiguration, RGBColor, GridAppModule, GridApp } from '@isergeevv/html-grid-app-base';

interface GridAppPanelModuleConfiguration extends GridAppModuleConfiguration {
    backgroundColor: RGBColor;
    panelElementTypes: string[];
}

declare class GridAppPanel extends GridAppModule {
    private _panelElementTypes;
    constructor(app: GridApp, config: GridAppPanelModuleConfiguration);
    private _createToggleButtonElement;
    private _createPanelElements;
    onMouseDown(e: MouseEvent): void;
    onMouseMove(_e: MouseEvent): void;
    onMouseUp(_e: MouseEvent): void;
    onClick(_e: MouseEvent): void;
    onWheelMove(_e: WheelEvent): void;
    onKeyDown(_e: KeyboardEvent): void;
    onKeyUp(_e: KeyboardEvent): void;
    onContextMenu(_e: KeyboardEvent): void;
    import(_data: object): void;
    export(): object;
}

export { GridAppPanel };
