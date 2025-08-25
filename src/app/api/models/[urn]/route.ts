import { getManifest } from '@/services/aps';

export async function GET(_: any, { params }: { params: { urn: string } }) {
  let response;
  const manifest = await getManifest(params.urn);
  if (manifest) {
    let messages: any[] = [];
    if (manifest.derivatives) {
      for (const derivative of manifest.derivatives) {
        messages = messages.concat(derivative.messages || []);
        if (derivative.children) {
          for (const child of derivative.children) {
            messages.concat(child.messages || []);
          }
        }
      }
    }
    response = { status: manifest.status, progress: manifest.progress, messages };
  } else {
    response = { status: 'n/a' };
  }
  return Response.json(response);
}
