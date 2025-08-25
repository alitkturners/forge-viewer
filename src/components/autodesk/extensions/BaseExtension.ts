export class BaseExtension extends window.Autodesk.Viewing.Extension {
  _onObjectTreeCreated: (ev: any) => void;
  _onSelectionChanged: (ev: any) => void;
  _onIsolationChanged: (ev: any) => void;
  _onBeforeModelUnload: (ev: any) => void;

  constructor(viewer: any, options: any) {
    super(viewer, options);
    this._onObjectTreeCreated = (ev) => {
      this.onModelLoaded(ev.model);
    };
    this._onSelectionChanged = (ev) => {
      this.onSelectionChanged(ev.model, ev.dbIdArray);
    };
    this._onIsolationChanged = (ev) => {
      this.onIsolationChanged(ev.model, ev.nodeIdArray);
    };
    this._onBeforeModelUnload = (ev) => {
      this._onBeforeModelUnload(ev.model);
    };
  }

  load() {
    this.viewer.addEventListener(window.Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, this._onObjectTreeCreated);
    this.viewer.addEventListener(window.Autodesk.Viewing.SELECTION_CHANGED_EVENT, this._onSelectionChanged);
    this.viewer.addEventListener(window.Autodesk.Viewing.ISOLATE_EVENT, this._onIsolationChanged);
    this.viewer.addEventListener(window.Autodesk.Viewing.BEFORE_MODEL_UNLOAD_EVENT, this._onBeforeModelUnload);
    return true;
  }

  unload() {
    this.viewer.removeEventListener(window.Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, this._onObjectTreeCreated);
    this.viewer.removeEventListener(window.Autodesk.Viewing.SELECTION_CHANGED_EVENT, this._onSelectionChanged);
    this.viewer.removeEventListener(window.Autodesk.Viewing.ISOLATE_EVENT, this._onIsolationChanged);
    this.viewer.removeEventListener(window.Autodesk.Viewing.BEFORE_MODEL_UNLOAD_EVENT, this._onBeforeModelUnload);
    return true;
  }

  onModelLoaded(model: any) {}

  onSelectionChanged(model: any, dbids: any) {}

  onBeforeModelUnload(model: any, dbids: any) {}

  onIsolationChanged(model: any, dbids: any) {}

  findLeafNodes(model: any) {
    return new Promise(function (resolve, reject) {
      model.getObjectTree(function (tree: any) {
        let leaves: any[] = [];
        tree.enumNodeChildren(
          tree.getRootId(),
          function (dbid: any) {
            if (tree.getChildCount(dbid) === 0) {
              leaves.push(dbid);
            }
          },
          true /* recursively enumerate children's children as well */
        );
        resolve(leaves);
      }, reject);
    });
  }

  async findPropertyNames(model: any) {
    const dbids = await this.findLeafNodes(model);

    return new Promise(function (resolve, reject) {
      model.getBulkProperties(
        dbids,
        {},
        function (results: any) {
          let propNames = new Set();
          for (const result of results) {
            for (const prop of result.properties) {
              propNames.add(prop.displayName);
            }
          }
          resolve(Array.from(propNames.values()));
        },
        reject
      );
    });
  }

  createToolbarButton(buttonId: any, buttonIconUrl: any, buttonTooltip: any) {
    let group = this.viewer.toolbar.getControl('dashboard-toolbar-group');
    if (!group) {
      group = new window.Autodesk.Viewing.UI.ControlGroup('dashboard-toolbar-group');
      this.viewer.toolbar.addControl(group);
    }
    const button = new window.Autodesk.Viewing.UI.Button(buttonId);
    button.setToolTip(buttonTooltip);
    group.addControl(button);
    const icon = button.container.querySelector('.adsk-button-icon');
    if (icon) {
      icon.style.backgroundImage = `url(${buttonIconUrl})`;
      icon.style.backgroundSize = `24px`;
      icon.style.backgroundRepeat = `no-repeat`;
      icon.style.backgroundPosition = `center`;
    }
    return button;
  }

  removeToolbarButton(button: any) {
    const group = this.viewer.toolbar.getControl('dashboard-toolbar-group');
    group.removeControl(button);
  }
}
