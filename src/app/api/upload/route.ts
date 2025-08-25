import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import type { NextRequest, NextResponse } from 'next/server';
import { createNewItemVersion, uploadFile } from '@/services/aps';
import TokenGenerator from '@/utils/TokenGenerator';

export async function POST(req: NextRequest, res: NextResponse) {
  const formData = await req.formData();
  const file = formData.get('model-file');

  if (!file || !(file instanceof Blob)) {
    return new Response('The required field ("model-file") is missing.', {
      status: 400,
    });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = req.headers.get('x-file-name');
  const projectId = req.headers.get('wip-proId');
  const folderId = req.headers.get('wip-folId');
  if (!name || !projectId || !folderId) {
    return new Response('The required headers ("x-file-name", "wip-proId", or "wip-folId") are missing.', {
      status: 400,
    });
  }

  const tempFilePath = join(tmpdir(), name);
  await fs.writeFile(tempFilePath, buffer);
  const token = TokenGenerator(req);

  try {
    var objectId = await uploadFile(projectId, folderId, name, file.size, tempFilePath, token);
  }  catch (err) {
    console.log(err);
    return Response.json({
      err,
    });
  }
  try {
    const attachmentVersionId = await createNewItemVersion(projectId, folderId, name, objectId, false, token);
  } catch (err) {
    console.log(err);
    return Response.json({
      err,
    });
  }

  return new Response('File uploaded successfully', { status: 200 });
}
