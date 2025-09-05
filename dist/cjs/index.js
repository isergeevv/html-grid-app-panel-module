'use strict';

class ElementData {
    constructor(element) {
        this._element = element;
    }
    has(key) {
        return this._element.hasAttribute(`data-${key}`);
    }
    get(key) {
        return this._element.getAttribute(`data-${key}`);
    }
    set(key, value = '') {
        this._element.setAttribute(`data-${key}`, value);
    }
    remove(key) {
        this._element.removeAttribute(`data-${key}`);
    }
    toggle(key, value) {
        if (value) {
            this.set(key);
        }
        else {
            this.remove(key);
        }
    }
}

class GridAppModule {
    constructor(app, config) {
        this._app = app;
        this._element = document.createElement('div');
        this._element.gridAppInstance = this;
        this._data = new ElementData(this._element);
        this.element.classList.add('app-module');
        this.element.dataset['label'] = config.label;
    }
    get app() {
        return this._app;
    }
    get element() {
        return this._element;
    }
    get data() {
        return this._data;
    }
    get label() {
        const label = this._data.get('label');
        if (!label) {
            throw new Error('Module label is not set.');
        }
        return label;
    }
}

var CONNECTOR_TYPES;
(function (CONNECTOR_TYPES) {
    CONNECTOR_TYPES["INPUT"] = "input";
    CONNECTOR_TYPES["OUTPUT"] = "output";
})(CONNECTOR_TYPES || (CONNECTOR_TYPES = {}));
var RESIZE_TYPES;
(function (RESIZE_TYPES) {
    RESIZE_TYPES["LEFT"] = "left";
    RESIZE_TYPES["RIGHT"] = "right";
    RESIZE_TYPES["TOP"] = "top";
    RESIZE_TYPES["BOTTOM"] = "bottom";
})(RESIZE_TYPES || (RESIZE_TYPES = {}));

class GridAppPanel extends GridAppModule {
    constructor(app, config) {
        super(app, config);
        this._panelElementTypes = config.panelElementTypes;
        this.element.classList.add('open');
        this.element.style.setProperty('--gridapp-panel-bg-color', config.backgroundColor.join(', '));
        this._createToggleButtonElement();
        this._createPanelElements();
    }
    _createToggleButtonElement() {
        const toggleButton = document.createElement('button');
        toggleButton.classList.add('app-panel-toggle');
        toggleButton.innerText = '<';
        toggleButton.addEventListener('click', () => {
            this.element.classList.toggle('open');
            if (this.element.classList.contains('open')) {
                toggleButton.innerText = '<';
            }
            else {
                toggleButton.innerText = '>';
            }
        });
        this.element.append(toggleButton);
    }
    _createPanelElements() {
        const constructorsData = this.app.grid.gridElementConstructors.filter((constructorData) => this._panelElementTypes.includes(constructorData.type));
        for (const constuctorData of constructorsData) {
            const component = this.app.grid.createElement(constuctorData.type, constuctorData.label);
            component.element.setAttribute('panel-component', '');
            this.element.append(component.element);
        }
    }
    onMouseDown(e) {
        const target = e.target;
        if (!target.closest('.app-module[data-label="panel"]'))
            return;
        const componentElement = target.closest('.app-element[data-type="component"]');
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
    onMouseMove(_e) { }
    onMouseUp(_e) { }
    onClick(_e) { }
    onWheelMove(_e) { }
    onKeyDown(_e) { }
    onKeyUp(_e) { }
    onContextMenu(_e) { }
    import(_data) { }
    export() {
        return {};
    }
}

exports.GridAppPanel = GridAppPanel;
