import { BaseExtension } from './BaseExtension';

class LoggerExtension extends BaseExtension {
  load() {
    super.load();
    return true;
  }

  unload() {
    super.unload();
    return true;
  }

  async onModelLoaded(model: any) {
    super.onModelLoaded(model);
    const props = await this.findPropertyNames(this.viewer.model);
  }

  async onSelectionChanged(model: any, dbids: any) {
    super.onSelectionChanged(model, dbids);
  }

  onIsolationChanged(model: any, dbids: any) {
    super.onIsolationChanged(model, dbids);
  }
}

window.Autodesk.Viewing.theExtensionManager.registerExtension('LoggerExtension', LoggerExtension);
