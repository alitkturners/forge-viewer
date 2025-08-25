import '../components/autodesk/extensions/LoggerExtension';
import '../components/autodesk/extensions/SummaryExtension';

async function getAccessToken(callback: any) {
  try {
    const resp = await fetch('/api/auth/');
    if (!resp.ok) {
      throw new Error(await resp.text());
    }
    const { access_token, expires_in } = await resp.json();
    callback(access_token, expires_in);
  } catch (err) {
    console.error(err);
  }
}

export function initViewer(container: any) {
  return new Promise(async (resolve) => {
    window.Autodesk.Viewing.Initializer({ env: 'AutodeskProduction', getAccessToken }, () => {
      const config = {
        extensions: ['Autodesk.DocumentBrowser', 'LoggerExtension', 'SummaryExtension'],
      };
      const viewer = new window.Autodesk.Viewing.GuiViewer3D(container, config);
      viewer.start();
      viewer.setTheme('light-theme');
      resolve(viewer);
    });
  });
}

export function loadModel(viewer: any, urn: string) {
  return new Promise(function (resolve, reject) {
    function onDocumentLoadSuccess(doc: any) {
      resolve(viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry()));
    }
    function onDocumentLoadFailure({ code, message, errors }: any) {
      reject({ code, message, errors });
    }
    viewer.setLightPreset(0);
    window.Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
  });
}
