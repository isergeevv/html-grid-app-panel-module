import { GridApp, GridAppComponentHTMLElement, GridAppModule } from '@isergeevv/html-grid-app-base';
import type { GridAppPanelModuleConfiguration } from './types';

export class GridAppPanel extends GridAppModule {
  private _panelElementTypes: string[];

  constructor(app: GridApp, config: GridAppPanelModuleConfiguration) {
    super(app, config);

    this._panelElementTypes = config.panelElementTypes;

    this.element.classList.add('open');

    this.element.style.setProperty('--gridapp-panel-bg-color', config.backgroundColor.join(', '));

    this._createToggleButtonElement();

    this._createPanelElements();
  }

  private _createToggleButtonElement(): void {
    const toggleButton = document.createElement('button');
    toggleButton.classList.add('app-panel-toggle');
    toggleButton.innerText = '<';

    toggleButton.addEventListener('click', () => {
      this.element.classList.toggle('open');

      if (this.element.classList.contains('open')) {
        toggleButton.innerText = '<';
      } else {
        toggleButton.innerText = '>';
      }
    });

    this.element.append(toggleButton);
  }

  private _createPanelElements(): void {
    const constructorsData = this.app.grid.gridElementConstructors.filter((constructorData) =>
      this._panelElementTypes.includes(constructorData.type),
    );

    for (const constuctorData of constructorsData) {
      const component = this.app.grid.createElement(constuctorData.type, constuctorData.label);

      component.element.setAttribute('panel-component', '');

      this.element.append(component.element);
    }
  }

  onMouseDown(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.closest('.app-module[data-label="panel"]')) return;

    const componentElement = target.closest(
      '.app-element[data-type="component"]',
    ) as GridAppComponentHTMLElement | null;
    if (componentElement) {
      if (this.app.grid.activeTool !== 'grab') {
        this.app.grid.setActiveTool('grab');
      }

      const zoom = this.app.grid.zoom;
      const offset = this.app.grid.offset;

      const newComponent = componentElement.gridAppInstance.copy();
      const size = newComponent.size;
      newComponent.setPosition({
        x: (e.clientX - this.app.grid.initialOffset.x) / zoom + this.app.grid.initialOffset.x - offset.x - size.w / 2,
        y: (e.clientY - this.app.grid.initialOffset.y) / zoom + this.app.grid.initialOffset.y - offset.y - size.h / 2,
      });

      this.app.grid.append(newComponent);

      newComponent.onMouseDown(e);

      this.app.grid.setFocusedComponent(newComponent);
      this.app.grid.setMoving('element');
    }
  }

  onMouseMove(_e: MouseEvent): void {}

  onMouseUp(_e: MouseEvent): void {}

  onClick(_e: MouseEvent): void {}

  onWheelMove(_e: WheelEvent): void {}

  onKeyDown(_e: KeyboardEvent): void {}

  onKeyUp(_e: KeyboardEvent): void {}

  onContextMenu(_e: KeyboardEvent): void {}

  import(_data: object): void {}

  export(): object {
    return {};
  }
}
