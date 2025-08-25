import tokenGenerator from '../../../../../../../../../utils/TokenGenerator.js';

const { getItemVersions } = require('../../../../../../../../../services/aps.ts');

export async function GET(req, { params }) {
  const token = tokenGenerator(req);
  const project_id = params.project_id;
  const item_id = params.item_id;

  try {
    const versions = await getItemVersions(project_id, item_id, token);
    return Response.json(versions);
  } catch (err) {
    console.log(err);
    return Response.json({
      err,
    });
  }
}
