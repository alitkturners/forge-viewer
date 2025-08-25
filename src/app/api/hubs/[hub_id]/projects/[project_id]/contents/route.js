import tokenGenerator from '../../../../../../../utils/TokenGenerator.js';

const { getProjectContents } = require('../../../../../../../services/aps.ts');

export async function GET(req, { params }) {
  const token = tokenGenerator(req);
  const hub_id = params.hub_id;
  const project_id = params.project_id;
  const searchParams = req.nextUrl.searchParams;
  const folder_id = searchParams.get('folder_id');
  try {
    const contents = await getProjectContents(hub_id, project_id, folder_id, token);
    return Response.json(contents);
  } catch (err) {
    console.log(err);
    return Response.json({
      err,
    });
  }
}
