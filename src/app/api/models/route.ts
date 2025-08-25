import { listObjects, translateObject, uploadObject, urnify } from '@/services/aps';

export async function GET() {
  const objects = await listObjects();

  const data = objects.map((o: any) => ({
    name: o.objectKey,
    urn: urnify(o.objectId),
  }));
  return Response.json({ data });
}

export async function POST(req: Request) {
  // const formData = await req.formData();
  // const file = formData.get('model-file');
  // const field = formData.get('model-zip-entrypoint');

  // try {
  //   const obj = await uploadObject(file.name, file.path);
  //   await translateObject(urnify(obj.objectId), field);
  //   return Response.json({
  //     name: obj.objectKey,
  //     urn: urnify(obj.objectId),
  //   });
  // } catch (err) {
  //   return Response.json(err);
  // }
  return Response.json('err');
}
