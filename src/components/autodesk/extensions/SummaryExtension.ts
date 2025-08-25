'use client';

import { toggleModalViewState } from '@/redux/ModelViewslice';
import { store } from '@/redux/store';

import { BaseExtension } from './BaseExtension';
import { SummaryPanel } from './SummaryPanel';

const SUMMARY_PROPS = ['Length', 'Area', 'Volume', 'Density', 'Mass', 'Price'];

class SummaryExtension extends BaseExtension {
  constructor(viewer: any, options: any) {
    super(viewer, options);
    this._button = null;
    this._panel = null;
    this.buttonState = store.getState()?.modelBrowser?.buttonState;
  }

  load() {
    super.load();
    return true;
  }

  unload() {
    super.unload();
    if (this._button) {
      this.removeToolbarButton(this._button);
      this._button = null;
    }
    if (this._panel) {
      this._panel.setVisible(false);
      this._panel.uninitialize();
      this._panel = null;
    }
    return true;
  }

  onToolbarCreated() {
    this._panel = new SummaryPanel(this, 'model-summary-panel', 'Model Summary');
    this._button = this.createToolbarButton(
      'summary-button',
      'https://img.icons8.com/small/32/brief.png',
      'Show Model Summary'
    );

    this._button.onClick = () => {
      this.buttonState = !store.getState()?.modelBrowser?.buttonState;
      store.dispatch(toggleModalViewState());
    };
  }

  onModelLoaded(model: any) {
    super.onModelLoaded(model);
    this.update();
  }

  onSelectionChanged(model: any, dbids: any) {
    super.onSelectionChanged(model, dbids);
    this.update();
  }

  onIsolationChanged(model: any, dbids: any) {
    super.onIsolationChanged(model, dbids);
    this.update();
  }

  async update() {
    if (this._panel) {
      const selectedIds = this.viewer.getSelection();
      const isolatedIds = this.viewer.getIsolatedNodes();
      if (selectedIds.length > 0) {
        // If any nodes are selected, compute the aggregates for them
        this._panel.update(this.viewer.model, selectedIds, SUMMARY_PROPS);
      } else if (isolatedIds.length > 0) {
        // Or, if any nodes are isolated, compute the aggregates for those
        this._panel.update(this.viewer.model, isolatedIds, SUMMARY_PROPS);
      } else {
        // Otherwise compute the aggregates for all nodes
        const dbids = await this.findLeafNodes(this.viewer.model);
        this._panel.update(this.viewer.model, dbids, SUMMARY_PROPS);
      }
    }
  }
}

window.Autodesk.Viewing.theExtensionManager.registerExtension('SummaryExtension', SummaryExtension);
